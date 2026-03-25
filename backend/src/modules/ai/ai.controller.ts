import { NextFunction, Request, Response } from "express";
import mammoth from "mammoth";
import { generateAIReviewer } from "./ai.service";
import { ApiResponse } from "../../common/types/api";
const { PDFParse } = require("pdf-parse");

export const generateReviewer = async (
  req: Request,
  res: Response<ApiResponse<string>>,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    let combinedText = "";

    for (const file of files) {
      const buffer = file.buffer;

      // PDF
      if (file.mimetype === "application/pdf") {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();

        combinedText += result.text + "\n";
      }

      // DOCX
      else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer });
        combinedText += result.value + "\n";
      }

      // Image (optional OCR later)
      else {
        combinedText += `[Unsupported file: ${file.originalname}]\n`;
      }
    }

    // Send to AI
    const reviewer = await generateAIReviewer(combinedText);

    return res.json({
      success: true,
      data: reviewer,
    });
  } catch (error) {
    console.error("Error in generateReviewer:", error);
    // Return JSON error instead of letting Express render HTML
    return res.status(500).json({
      success: false,
      message: "Failed to generate reviewer",
    });
  }
};

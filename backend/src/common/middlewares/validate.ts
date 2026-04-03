import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed: any = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
        files: req.files,
      });

      req.body = parsed.body;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(err);
    }
  };

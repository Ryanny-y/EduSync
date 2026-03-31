import Papa from "papaparse";
import * as XLSX from "xlsx";
import prismaClient from "../../config/client";
import { CustomError } from "../../common/utils/Errors";
import { verifyClassAccess } from "./class.helpers";


export const getMasterlist = async (teacherId: string, classId: string) => {
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  return prismaClient.studentMasterlist.findMany({
    where: { classId },
    orderBy: { fullName: "asc" },
  });
};

const REQUIRED_COLUMNS = 5;
const REQUIRED_HEADERS = [
  "student_id",
  "email",
  "last_name",
  "first_name",
  "middle_name",
];

interface MasterlistRow {
  studentId: string;
  email: string;
  lastName: string;
  firstName: string;
  middleName: string;
}

// Parse rows into MasterlistRow[]
function parseRows(rows: string[][]): MasterlistRow[] {
  return rows
    .filter((row) => row.some((cell) => String(cell).trim() !== ""))
    .map((row) => ({
      studentId: String(row[0] ?? "").trim(),
      email:      String(row[1] ?? "").trim(),
      lastName:   String(row[2] ?? "").trim(),
      firstName:  String(row[3] ?? "").trim(),
      middleName: String(row[4] ?? "").trim(),
    }));
}

// CSV parser
function parseCsv(buffer: Buffer): string[][] {
  const text = buffer.toString("utf-8");
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
  return result.data;
}

// Excel parser
function parseExcel(buffer: Buffer): string[][] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
}

export const uploadMasterlist = async (
  teacherId: string,
  classId: string,
  file: Express.Multer.File,
): Promise<{ imported: number }> => {
  // Verify teacher access to class
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  // Determine file type
  const mime = file.mimetype;
  const isExcel =
    mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "application/vnd.ms-excel" ||
    file.originalname.endsWith(".xlsx") ||
    file.originalname.endsWith(".xls");
  const isCsv = mime === "text/csv" || file.originalname.endsWith(".csv");

  if (!isExcel && !isCsv) {
    throw new CustomError(400, "Only CSV or Excel files are allowed");
  }

  // Parse file into raw rows
  const rawRows: string[][] = isExcel ? parseExcel(file.buffer) : parseCsv(file.buffer);

  if (rawRows.length === 0) {
    throw new CustomError(400, "File is empty");
  }

  // Validate headers
  const firstRow = rawRows[0]?.map((cell) => String(cell).trim().toLowerCase());

  if (!firstRow || firstRow.length !== REQUIRED_COLUMNS) {
    throw new CustomError(
      400,
      `File must have exactly ${REQUIRED_COLUMNS} columns: ${REQUIRED_HEADERS.join(", ")}`
    );
  }

  const isValidHeaders = REQUIRED_HEADERS.every(
    (header, index) => firstRow[index] === header
  );

  if (!isValidHeaders) {
    throw new CustomError(
      400,
      `Invalid column headers. Required: ${REQUIRED_HEADERS.join(", ")}`
    );
  }

  // Parse data rows (skip header)
  const dataRows = rawRows.slice(1);
  const rows = parseRows(dataRows);

  if (rows.length === 0) {
    throw new CustomError(400, "No valid rows found in file");
  }

  // Upsert all rows — replace existing masterlist for this class
  await prismaClient.$transaction(async (tx) => {
    await tx.studentMasterlist.deleteMany({ where: { classId } });

    await tx.studentMasterlist.createMany({
      data: rows.map((row) => ({
        classId,
        studentId: row.studentId,
        email: row.email,
        fullName: `${row.lastName}, ${row.firstName}${row.middleName ? " " + row.middleName : ""}`,
      })),
    });
  });

  return { imported: rows.length };
};
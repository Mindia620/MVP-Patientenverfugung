import crypto from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type RenderedPdf = {
  bytes: Uint8Array;
  contentHash: string;
};

const A4 = {
  width: 595.28,
  height: 841.89,
};

const margin = 52;
const lineHeight = 16;
const fontSize = 11;

export const renderPdfFromText = async (title: string, body: string): Promise<RenderedPdf> => {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([A4.width, A4.height]);
  let y = A4.height - margin;

  page.drawText(title, {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  const lines = body.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.length === 0 ? " " : rawLine;
    const wrapped = wrapText(line, 88);

    for (const segment of wrapped) {
      if (y < margin) {
        page = doc.addPage([A4.width, A4.height]);
        y = A4.height - margin;
      }

      page.drawText(segment, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineHeight;
    }
  }

  const bytes = await doc.save();
  const contentHash = crypto.createHash("sha256").update(bytes).digest("hex");

  return { bytes, contentHash };
};

const wrapText = (input: string, maxChars: number): string[] => {
  if (input.length <= maxChars) {
    return [input];
  }

  const words = input.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) {
        lines.push(current);
      }
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

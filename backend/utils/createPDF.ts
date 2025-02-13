import PDFDocument from "pdfkit";
import fs from "fs";
import { REPORT } from "./../constants/submission-report.js";

export async function createPDF(
  generatePDFContent: (doc: PDFKit.PDFDocument) => void,
  path: string = "/tmp/output.pdf"
) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(path);

  doc.pipe(writeStream);
  generatePDFContent(doc);
  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(writeStream));
    writeStream.on("error", reject);
  });

  return fs.readFileSync(path, "base64");
}

// Need to add type verification for data
export function generateBuildBlockReport(doc: PDFKit.PDFDocument, lang: "en" | "fr", data: any) {
  doc.fontSize(25);
  const text = REPORT[lang]["title"];
  const textWidth = doc.widthOfString(text);
  doc.text(text, (doc.page.width - textWidth) / 2, 75);

  const addSection = (title: string) => {
    doc.moveDown(0.5).fontSize(14).fillColor("#1565c0").text(title).fillColor("black");
  };

  addSection(REPORT[lang]["quantities"]);
  Object.entries(data.blockQuantities || {}).forEach(([size, blockTypes]) => {
    const cleanSize = size.replace(/\\/g, "");
    doc.fontSize(12).text(`Blocks ${cleanSize}:`, { underline: true }).moveDown(0.3);

    Object.entries(blockTypes as object).forEach(([type, details]) => {
      if (details.quantity > 0) {
        doc
          .text(`• ${type}: `, { continued: true })
          .text(`${details.quantity} ${REPORT[lang]["units"]} `, {
            continued: true,
          })
          .text(`(${details.nBundles} ${REPORT[lang]["bundles"]})`);
      }
    });
    doc.moveDown();
  });

  addSection("Bridges");
  doc
    .text(`${REPORT[lang]["totalQuantity"]}: ${data.bridges?.quantity || 0}`)
    .text(`${REPORT[lang]["bundles"]}: ${data.bridges?.nBundles || 0}`);

  addSection("Clips");
  doc
    .text(`${REPORT[lang]["totalQuantity"]}: ${data.clips?.quantity || 0}`)
    .text(`${REPORT[lang]["bundles"]}: ${data.clips?.nBundles || 0}`);

  addSection(REPORT[lang]["concreteVolume"]);
  doc.text(`${data.concreteVolume || 0} m^3`);

  addSection("Rebars");
  Object.entries((data.rebars as Object) || {}).forEach(([diameter, quantity]) => {
    if (quantity > 0) {
      doc.text(`• ${diameter}": ${quantity}`);
    }
  });

  doc.addPage().fontSize(10).text(REPORT[lang]["terms"], { width: 500, align: "left" });
}

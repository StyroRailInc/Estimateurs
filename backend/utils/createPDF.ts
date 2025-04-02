import PDFDocument from "pdfkit";
import fs from "fs";
import { REPORT } from "./../constants/submission-report.js";

export async function createPDF(
  generatePDFContent: (doc: PDFKit.PDFDocument) => void,
  path: string = "/tmp/output.pdf"
) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
    info: {
      Title: "Construction Block Report",
      Author: "Your Company Name",
      Creator: "Your Application Name",
    },
  });
  const writeStream = fs.createWriteStream(path);

  doc.pipe(writeStream);
  try {
    generatePDFContent(doc);
  } catch (error) {
    console.log(error);
  }
  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(writeStream));
    writeStream.on("error", reject);
  });

  return fs.readFileSync(path, "base64");
}

export function generateBuildBlockReport(doc: PDFKit.PDFDocument, lang: "eng" | "fr", data: any) {
  doc
    .fillColor("#333333")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(REPORT[lang]["title"], 110, 57)
    .fontSize(10)
    .text(new Date().toLocaleDateString(), 50, 85, { align: "right" })
    .moveDown(2);

  doc.strokeColor("#1565c0").lineWidth(1).moveTo(50, 100).lineTo(550, 100).stroke();

  const checkPageEnd = (requiredSpace: number = 100) => {
    if (doc.y + requiredSpace > doc.page.height - 50) {
      doc.addPage();
      doc.y = 50;
    }
  };

  const addSection = (title: string, contentHeightEstimate: number = 100) => {
    checkPageEnd(contentHeightEstimate + 50);

    const y = doc.y;
    doc
      .fontSize(12)
      .fillColor("#1565c0")
      .font("Helvetica-Bold")
      .text(title, 50, y + 20)
      .fillColor("#333333")
      .moveDown(0.5);
    doc
      .strokeColor("#1565c0")
      .lineWidth(0.5)
      .moveTo(50, y + 35)
      .lineTo(550, y + 35)
      .stroke();
  };

  addSection(REPORT[lang]["quantities"], Object.keys(data.blockQuantities || {}).length * 50);
  Object.entries(data.blockQuantities || {}).forEach(([size, blockTypes]) => {
    checkPageEnd(30);

    const cleanSize = size.replace(/\\/g, "");
    doc.fontSize(12).font("Helvetica-Bold").text(`Blocs ${cleanSize}:`, 50).moveDown(0.3);

    Object.entries(blockTypes as Object).forEach(([type, details]: any) => {
      if (details.quantity > 0) {
        checkPageEnd(20);

        doc
          .font("Helvetica")
          .text(
            `• ${REPORT[lang]["blocks"][type as keyof (typeof REPORT)[typeof lang]["blocks"]]}: `,
            { indent: 60, continued: true }
          )
          .font("Helvetica-Bold")
          .text(`${details.quantity} ${REPORT[lang]["units"]} `, { continued: true })
          .font("Helvetica")
          .text(` (${details.nBundles} ${REPORT[lang]["bundles"]})`);
      }
    });
    doc.moveDown(0.5);
  });

  addSection(REPORT[lang]["rebars"], Object.keys(data.rebars || {}).length * 20);
  Object.entries(data.rebars || {}).forEach(([diameter, quantity]) => {
    checkPageEnd(20);

    if ((quantity as number) > 0) {
      doc
        .font("Helvetica")
        .text(`• ${diameter}":`, { indent: 60, continued: true })
        .font("Helvetica-Bold")
        .text(` ${quantity} ${REPORT[lang]["units"]}`);
    }
  });

  addSection(REPORT[lang]["bridges"], Object.keys(data.bridges || {}).length * 50);
  Object.entries(data.bridges || {}).forEach(([width, details]: any) => {
    checkPageEnd(30);

    const cleanWidth = width.replace(/\\/g, "");
    doc.fontSize(12).font("Helvetica-Bold").text(`Bridges ${cleanWidth}:`, 50).moveDown(0.3);

    doc
      .font("Helvetica-Bold")
      .text(`• ${details.quantity} ${REPORT[lang]["units"]}`, { indent: 60, continued: true })
      .font("Helvetica")
      .text(` (${details.nBundles} ${REPORT[lang]["bundles"]})`);

    doc.moveDown(0.5);
  });

  addSection(REPORT[lang]["additionalInformation"], 30);
  if (data.clips?.quantity > 0) {
    checkPageEnd(20);

    doc
      .font("Helvetica")
      .text(`• ${REPORT[lang]["clips"]}: `, { indent: 60, continued: true })
      .font("Helvetica-Bold")
      .text(`${data.clips?.quantity} ${REPORT[lang]["units"]}`, { continued: true })
      .font("Helvetica")
      .text(` (${data.clips?.nBundles} ${REPORT[lang]["bundles"]})`)

      .text(`• ${REPORT[lang]["concreteVolume"]}: `, { indent: 60, continued: true })
      .font("Helvetica-Bold")
      .text(`${data.concreteVolume || 0} m³`)

      .font("Helvetica")
      .text(`• ${REPORT[lang]["grossSquareFootage"]}: `, { indent: 60, continued: true })
      .font("Helvetica-Bold")
      .text(`${data.squareFootage.gross || 0} ft²`)

      .font("Helvetica")
      .text(`• ${REPORT[lang]["netSquareFootage"]}: `, { indent: 60, continued: true })
      .font("Helvetica-Bold")
      .text(`${data.squareFootage.net || 0} ft²`)

      .font("Helvetica")
      .text(`• ${REPORT[lang]["openingSquareFootage"]}: `, { indent: 60, continued: true })
      .font("Helvetica-Bold")
      .text(`${data.squareFootage.opening || 0} ft²`);
  }

  doc.moveDown(0.5);

  const termsHeight = doc.heightOfString(REPORT[lang]["terms"], {
    width: 500,
    align: "left",
  });

  checkPageEnd(termsHeight + 20);

  doc.fontSize(8).fillColor("#666666").font("Helvetica-Oblique").text(REPORT[lang]["terms"], {
    width: 500,
    align: "left",
    paragraphGap: 3,
  });
}

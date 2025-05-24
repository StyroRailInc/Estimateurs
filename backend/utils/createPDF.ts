import PDFDocument from "pdfkit";
import fs from "fs";
import { REPORT } from "./../constants/submission-report-constants.js";
import { PdfMeta, PdfFont, PdfFontSize, PdfColor, PdfPosition, PdfSpacingEstimate } from "../constants/pdf-constants.js";

export async function createPDF(generatePDFContent: (doc: PDFKit.PDFDocument) => void, path: string = PdfMeta.DefaultPath) {
  const doc = new PDFDocument({
    margin: PdfPosition.Margin,
    size: PdfMeta.PageSize,
    info: {
      Title: PdfMeta.Title,
      Author: PdfMeta.Author,
      Creator: PdfMeta.Creator,
    },
  });

  const writeStream = fs.createWriteStream(path);
  doc.pipe(writeStream);

  try {
    generatePDFContent(doc);
  } catch (error) {
    console.error(error);
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
    .fillColor(PdfColor.Text)
    .fontSize(PdfFontSize.Title)
    .font(PdfFont.Bold)
    .text(REPORT[lang]["title"], PdfPosition.TitleX, PdfPosition.TitleY)
    .fontSize(PdfFontSize.Text)
    .text(new Date().toLocaleDateString(), PdfPosition.Margin, PdfPosition.DateY, { align: "right" })
    .moveDown(2);

  doc
    .strokeColor(PdfColor.Primary)
    .lineWidth(1)
    .moveTo(PdfPosition.Margin, PdfPosition.LineY)
    .lineTo(PdfPosition.LineEndX, PdfPosition.LineY)
    .stroke();

  const checkPageEnd = (requiredSpace: number = PdfSpacingEstimate.DefaultRequiredSpace) => {
    if (doc.y + requiredSpace > doc.page.height - PdfPosition.Margin) {
      doc.addPage();
      doc.y = PdfPosition.Margin;
    }
  };

  const addSection = (title: string, contentHeightEstimate: number = PdfSpacingEstimate.DefaultRequiredSpace) => {
    checkPageEnd(contentHeightEstimate + PdfPosition.Margin);
    const y = doc.y;

    doc
      .fontSize(PdfFontSize.Section)
      .fillColor(PdfColor.Primary)
      .font(PdfFont.Bold)
      .text(title, PdfPosition.Margin, y + PdfPosition.SectionTitleYOffset)
      .fillColor(PdfColor.Text)
      .moveDown(0.5);

    doc
      .strokeColor(PdfColor.Primary)
      .lineWidth(0.5)
      .moveTo(PdfPosition.Margin, y + PdfPosition.SectionLineYOffset)
      .lineTo(PdfPosition.LineEndX, y + PdfPosition.SectionLineYOffset)
      .stroke();
  };

  addSection(REPORT[lang]["quantities"], Object.keys(data.blockQuantities || {}).length * PdfSpacingEstimate.BlockLineHeight);
  Object.entries(data.blockQuantities || {}).forEach(([size, blockTypes]) => {
    checkPageEnd(30);
    const cleanSize = size.replace(/\\/g, "");
    doc.fontSize(PdfFontSize.Section).font(PdfFont.Bold).text(`${REPORT[lang]["quantities"]} ${cleanSize}:`, PdfPosition.Margin).moveDown(0.3);

    Object.entries(blockTypes as object).forEach(([type, details]: any) => {
      if (details.quantity > 0) {
        checkPageEnd(20);

        doc
          .font(PdfFont.Regular)
          .text(`• ${REPORT[lang]["blocks"][type as keyof (typeof REPORT)[typeof lang]["blocks"]]}: `, {
            indent: PdfPosition.TextIndent,
            continued: true,
          })
          .font(PdfFont.Bold)
          .text(`${details.quantity} ${REPORT[lang]["units"]} `, { continued: true })
          .font(PdfFont.Regular)
          .text(`(${details.nBundles} ${REPORT[lang]["bundles"]})`);
      }
    });

    doc.moveDown(0.5);
  });

  addSection(REPORT[lang]["rebars"], Object.keys(data.rebars || {}).length * PdfSpacingEstimate.RebarLineHeight);
  Object.entries(data.rebars || {}).forEach(([diameter, quantity]) => {
    checkPageEnd(PdfSpacingEstimate.RebarLineHeight);
    if ((quantity as number) > 0) {
      doc
        .font(PdfFont.Regular)
        .text(`• ${diameter}":`, { indent: PdfPosition.TextIndent, continued: true })
        .font(PdfFont.Bold)
        .text(` ${quantity} ${REPORT[lang]["units"]}`);
    }
  });

  addSection(REPORT[lang]["bridges"], Object.keys(data.bridges || {}).length * PdfSpacingEstimate.BlockLineHeight);
  Object.entries(data.bridges || {}).forEach(([width, details]: any) => {
    checkPageEnd(30);
    const cleanWidth = width.replace(/\\/g, "");

    doc
      .fontSize(PdfFontSize.Section)
      .font(PdfFont.Bold)
      .text(`Bridges ${cleanWidth}:`, PdfPosition.Margin)
      .moveDown(0.3)
      .font(PdfFont.Bold)
      .text(`• ${details.quantity} ${REPORT[lang]["units"]}`, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Regular)
      .text(` (${details.nBundles} ${REPORT[lang]["bundles"]})`)
      .moveDown(0.5);
  });

  addSection(REPORT[lang]["additionalInformation"], PdfSpacingEstimate.AdditionalInfoHeight);
  if (data.clips?.quantity > 0) {
    checkPageEnd(20);

    doc
      .font(PdfFont.Regular)
      .text(`• ${REPORT[lang]["clips"]}: `, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Bold)
      .text(`${data.clips?.quantity} ${REPORT[lang]["units"]}`, { continued: true })
      .font(PdfFont.Regular)
      .text(` (${data.clips?.nBundles} ${REPORT[lang]["bundles"]})`)
      .text(`• ${REPORT[lang]["concreteVolume"]}: `, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Bold)
      .text(`${data.concreteVolume || 0} m³`)
      .font(PdfFont.Regular)
      .text(`• ${REPORT[lang]["grossSquareFootage"]}: `, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Bold)
      .text(`${data.squareFootage.gross || 0} ft²`)
      .font(PdfFont.Regular)
      .text(`• ${REPORT[lang]["netSquareFootage"]}: `, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Bold)
      .text(`${data.squareFootage.net || 0} ft²`)
      .font(PdfFont.Regular)
      .text(`• ${REPORT[lang]["openingSquareFootage"]}: `, { indent: PdfPosition.TextIndent, continued: true })
      .font(PdfFont.Bold)
      .text(`${data.squareFootage.opening || 0} ft²`);
  }

  doc.moveDown(0.5);

  const termsHeight = doc.heightOfString(REPORT[lang]["terms"], {
    width: PdfPosition.TermsWidth,
    align: "left",
  });

  checkPageEnd(termsHeight + 20);

  doc.fontSize(PdfFontSize.Terms).fillColor(PdfColor.SubText).font(PdfFont.Italic).text(REPORT[lang]["terms"], {
    width: PdfPosition.TermsWidth,
    align: "left",
    paragraphGap: 3,
  });
}

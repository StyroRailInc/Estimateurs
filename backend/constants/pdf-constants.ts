export enum PdfMeta {
  Title = "Construction Block Report",
  Author = "Your Company Name",
  Creator = "Your Application Name",
  PageSize = "A4",
  DefaultPath = "/tmp/output.pdf",
}

export enum PdfFont {
  Bold = "Helvetica-Bold",
  Regular = "Helvetica",
  Italic = "Helvetica-Oblique",
}

export enum PdfFontSize {
  Title = 20,
  Text = 10,
  Section = 12,
  Terms = 8,
}

export enum PdfColor {
  Primary = "#1565c0",
  Text = "#333333",
  SubText = "#666666",
}

export enum PdfPosition {
  Margin = 50,
  TitleX = 110,
  TitleY = 57,
  DateY = 85,
  LineY = 100,
  LineEndX = 550,
  SectionTitleYOffset = 20,
  SectionLineYOffset = 35,
  TextIndent = 60,
  TermsWidth = 500,
}

export enum PdfSpacingEstimate {
  DefaultRequiredSpace = 100,
  BlockLineHeight = 50,
  RebarLineHeight = 20,
  AdditionalInfoHeight = 30,
}

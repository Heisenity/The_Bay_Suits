import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

type InvoiceLineItem = {
  label: string;
  detail?: string;
  value: string;
};

type InvoicePdfInput = {
  confirmation: string;
  guestName: string;
  propertyName: string;
  propertyLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  issuedAt: string;
  total: number;
  lineItems: InvoiceLineItem[];
};

const colors = {
  navy: rgb(15 / 255, 31 / 255, 53 / 255),
  gold: rgb(201 / 255, 177 / 255, 124 / 255),
  ivory: rgb(251 / 255, 250 / 255, 247 / 255),
  white: rgb(1, 1, 1),
  text: rgb(24 / 255, 39 / 255, 57 / 255),
  muted: rgb(110 / 255, 121 / 255, 138 / 255),
  border: rgb(226 / 255, 232 / 255, 240 / 255),
  panel: rgb(245 / 255, 242 / 255, 235 / 255),
  soft: rgb(244 / 255, 246 / 255, 248 / 255)
};

function formatDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function drawLogo(page: PDFPage, x: number, y: number, boldFont: PDFFont, regularFont: PDFFont) {
  page.drawCircle({
    x: x + 26,
    y: y - 25,
    size: 26,
    borderColor: colors.gold,
    borderWidth: 1.4
  });

  page.drawLine({
    start: { x: x + 16, y: y - 21 },
    end: { x: x + 20, y: y - 12 },
    color: colors.gold,
    thickness: 1.15
  });
  page.drawLine({
    start: { x: x + 20, y: y - 12 },
    end: { x: x + 26, y: y - 19 },
    color: colors.gold,
    thickness: 1.15
  });
  page.drawLine({
    start: { x: x + 26, y: y - 19 },
    end: { x: x + 32, y: y - 12 },
    color: colors.gold,
    thickness: 1.15
  });
  page.drawLine({
    start: { x: x + 32, y: y - 12 },
    end: { x: x + 36, y: y - 21 },
    color: colors.gold,
    thickness: 1.15
  });
  page.drawLine({
    start: { x: x + 18, y: y - 21 },
    end: { x: x + 34, y: y - 21 },
    color: colors.gold,
    thickness: 1.15
  });
  page.drawLine({
    start: { x: x + 20, y: y - 25 },
    end: { x: x + 32, y: y - 25 },
    color: colors.gold,
    thickness: 1.15
  });

  page.drawText("THE BAY SUITES", {
    x: x + 64,
    y: y - 18,
    font: boldFont,
    size: 23,
    color: colors.ivory
  });

  page.drawText("VACATION & CORPORATE RENTALS", {
    x: x + 64,
    y: y - 38,
    font: regularFont,
    size: 9.4,
    color: colors.gold
  });
}

function fitText(font: PDFFont, text: string, size: number, maxWidth: number) {
  const width = font.widthOfTextAtSize(text, size);
  if (width <= maxWidth) {
    return { text, size };
  }

  const ratio = maxWidth / width;
  return {
    text,
    size: Math.max(size * ratio, size - 2.5)
  };
}

export async function buildInvoicePdfBase64(input: InvoicePdfInput) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 42;
  const contentWidth = width - margin * 2;
  const rightColumnWidth = 176;
  const leftColumnWidth = contentWidth - rightColumnWidth - 18;

  page.drawRectangle({ x: 0, y: 0, width, height, color: colors.ivory });
  page.drawRectangle({ x: 0, y: height - 186, width, height: 186, color: colors.navy });
  page.drawRectangle({
    x: margin,
    y: height - 156,
    width: contentWidth,
    height: 2,
    color: colors.gold,
    opacity: 0.55
  });

  drawLogo(page, margin, height - 54, bold, regular);

  page.drawText("Invoice", {
    x: width - margin - 112,
    y: height - 72,
    font: bold,
    size: 27,
    color: colors.ivory
  });
  page.drawText(`Issued ${formatDate(input.issuedAt)}`, {
    x: width - margin - 122,
    y: height - 97,
    font: regular,
    size: 10.5,
    color: colors.white,
    opacity: 0.82
  });
  page.drawText(`Ref ${input.confirmation}`, {
    x: width - margin - 122,
    y: height - 116,
    font: bold,
    size: 10.5,
    color: colors.gold
  });

  let cursorY = height - 224;

  page.drawRectangle({
    x: margin,
    y: cursorY - 142,
    width: leftColumnWidth,
    height: 142,
    color: colors.white,
    borderColor: colors.border,
    borderWidth: 1
  });
  page.drawRectangle({
    x: margin + leftColumnWidth + 18,
    y: cursorY - 142,
    width: rightColumnWidth,
    height: 142,
    color: colors.panel,
    borderColor: colors.border,
    borderWidth: 1
  });

  page.drawText("Bill to", {
    x: margin + 18,
    y: cursorY - 24,
    font: bold,
    size: 9.5,
    color: colors.muted
  });
  page.drawText(input.guestName, {
    x: margin + 18,
    y: cursorY - 48,
    font: bold,
    size: 18,
    color: colors.text
  });
  page.drawText("Hosted and invoiced by The Bay Suites", {
    x: margin + 18,
    y: cursorY - 71,
    font: regular,
    size: 10.4,
    color: colors.muted
  });
  page.drawText("admin@thebaysuites.com", {
    x: margin + 18,
    y: cursorY - 89,
    font: regular,
    size: 10.4,
    color: colors.text
  });
  page.drawText("+1 (877) 721-1311", {
    x: margin + 18,
    y: cursorY - 106,
    font: regular,
    size: 10.4,
    color: colors.text
  });
  page.drawText("67 Mowat Ave, Toronto, ON M6K 3E3, Canada", {
    x: margin + 18,
    y: cursorY - 123,
    font: regular,
    size: 9.7,
    color: colors.muted
  });

  const summaryX = margin + leftColumnWidth + 36;
  const summaryRows = [
    ["Residence", input.propertyName],
    ["Location", input.propertyLocation],
    ["Stay", `${formatDate(input.checkIn)} - ${formatDate(input.checkOut)}`],
    ["Guests", `${input.guests} guest${input.guests === 1 ? "" : "s"}`]
  ];

  summaryRows.forEach(([label, value], index) => {
    const rowY = cursorY - 25 - index * 27;
    page.drawText(label, {
      x: summaryX,
      y: rowY,
      font: bold,
      size: 9.3,
      color: colors.muted
    });

    const fitted = fitText(regular, value, 10.4, rightColumnWidth - 96);
    page.drawText(fitted.text, {
      x: summaryX,
      y: rowY - 13,
      font: regular,
      size: fitted.size,
      color: colors.text
    });
  });

  cursorY -= 176;

  page.drawText("Charge summary", {
    x: margin,
    y: cursorY,
    font: bold,
    size: 14.5,
    color: colors.text
  });

  cursorY -= 16;
  page.drawRectangle({
    x: margin,
    y: cursorY - 30,
    width: contentWidth,
    height: 30,
    color: colors.soft
  });
  page.drawText("Description", {
    x: margin + 14,
    y: cursorY - 19,
    font: bold,
    size: 9.5,
    color: colors.muted
  });
  page.drawText("Amount", {
    x: width - margin - 74,
    y: cursorY - 19,
    font: bold,
    size: 9.5,
    color: colors.muted
  });

  cursorY -= 44;

  input.lineItems.forEach((item, index) => {
    const rowHeight = item.detail ? 42 : 28;
    page.drawLine({
      start: { x: margin, y: cursorY + 8 },
      end: { x: width - margin, y: cursorY + 8 },
      color: index === 0 ? colors.border : colors.soft,
      thickness: 0.9
    });

    page.drawText(item.label, {
      x: margin + 14,
      y: cursorY - 4,
      font: bold,
      size: 10.7,
      color: colors.text
    });

    if (item.detail) {
      page.drawText(item.detail, {
        x: margin + 14,
        y: cursorY - 18,
        font: regular,
        size: 9.3,
        color: colors.muted
      });
    }

    page.drawText(item.value, {
      x: width - margin - 74,
      y: cursorY - 4,
      font: regular,
      size: 10.7,
      color: colors.text
    });

    cursorY -= rowHeight;
  });

  page.drawLine({
    start: { x: margin, y: cursorY + 10 },
    end: { x: width - margin, y: cursorY + 10 },
    color: colors.border,
    thickness: 1.1
  });

  const totalBoxY = cursorY - 62;
  page.drawRectangle({
    x: width - margin - 184,
    y: totalBoxY,
    width: 184,
    height: 54,
    color: colors.navy
  });
  page.drawText("Total paid", {
    x: width - margin - 164,
    y: totalBoxY + 34,
    font: regular,
    size: 10,
    color: colors.white,
    opacity: 0.76
  });
  page.drawText(`CAD ${input.total.toFixed(2)}`, {
    x: width - margin - 164,
    y: totalBoxY + 14,
    font: bold,
    size: 19.5,
    color: colors.ivory
  });

  page.drawRectangle({
    x: margin,
    y: 82,
    width: contentWidth,
    height: 70,
    color: colors.white,
    borderColor: colors.border,
    borderWidth: 1
  });
  page.drawText("Thank you for choosing The Bay Suites.", {
    x: margin + 16,
    y: 126,
    font: bold,
    size: 11.5,
    color: colors.text
  });
  page.drawText("This invoice confirms payment for your reservation and is ready for your records.", {
    x: margin + 16,
    y: 108,
    font: regular,
    size: 10,
    color: colors.muted
  });
  page.drawText("Support: admin@thebaysuites.com  |  +1 (877) 721-1311", {
    x: margin + 16,
    y: 90,
    font: regular,
    size: 10,
    color: colors.text
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

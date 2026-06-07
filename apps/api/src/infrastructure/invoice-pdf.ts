type InvoicePdfInput = {
  confirmation: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  issuedAt: string;
};

function escapePdfText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

export function buildInvoicePdfBase64(input: InvoicePdfInput) {
  const lines = [
    "BT",
    "/F1 24 Tf 56 780 Td (The Bay Suites Invoice) Tj",
    "0 -28 Td /F1 11 Tf (Vacation and Corporate Rentals) Tj",
    "0 -42 Td /F1 12 Tf (Issued: " + escapePdfText(input.issuedAt) + ") Tj",
    "0 -24 Td (Confirmation: " + escapePdfText(input.confirmation) + ") Tj",
    "0 -24 Td (Guest: " + escapePdfText(input.guestName) + ") Tj",
    "0 -24 Td (Property: " + escapePdfText(input.propertyName) + ") Tj",
    "0 -24 Td (Check-in: " + escapePdfText(input.checkIn) + ") Tj",
    "0 -24 Td (Check-out: " + escapePdfText(input.checkOut) + ") Tj",
    "0 -24 Td (Guests: " + escapePdfText(String(input.guests)) + ") Tj",
    "0 -24 Td (Total paid: CAD " + escapePdfText(input.total.toFixed(2)) + ") Tj",
    "0 -48 Td (For questions about this invoice, contact admin@thebaysuites.com.) Tj",
    "ET"
  ].join("\n");

  const stream = `<< /Length ${lines.length} >>\nstream\n${lines}\nendstream`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n${stream}\nendobj`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8").toString("base64");
}

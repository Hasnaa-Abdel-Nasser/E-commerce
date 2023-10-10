import { createWriteStream } from "fs";
import PDFDocument from "pdfkit";

export async function createInvoice(order, path , userName , coupon) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, order , userName);
  generateInvoiceTable(doc, order , coupon);
  generateFooter(doc);

  doc.end();
  doc.pipe(createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 100 })
    .fillColor("#444444")
    .fontSize(20)
    .text("EazyShop", 160, 80)
    .fontSize(10)
    .moveDown();
}

function generateCustomerInformation(doc, order , userName) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop)
    .text(formatDate(new Date()), 150, customerInformationTop)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(order.totalOrderPrice * 100), // price
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(userName, 300, customerInformationTop) //username
    .font("Helvetica")
    .text(order.address, 300, customerInformationTop + 15) // Address
    .text(order.phoneNumber, 300, customerInformationTop + 30) // phone number
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, order , coupon) {
  const invoiceTableTop = 300;
  let i = order.cartItems.length;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Product",
    "Discount",
    "Unit Cost",
    "Quantity",
    "Price",
    "After Discount"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");
  let amount = 0;
  order.cartItems.map((product , index)=>{
    const position = invoiceTableTop + (index + 1) * 30;
    let price = product.price-(product.price * product.discount)/100;
    amount += +(price*product.quantity*100).toFixed(2);
    generateTableRow(
      doc,
      position,
      product.name,
      `${product.discount}%`,
      formatCurrency(product.price * 100),
      product.quantity,
      formatCurrency(product.price * product.quantity * 100),
      formatCurrency(price*product.quantity*100),
    );
    generateHr(doc, position + 20);
  })

  let subtotalPosition = invoiceTableTop + (i + 1) * 50;
  generateTableRow(
    doc,
    subtotalPosition,
    "Subtotal",
    formatCurrency(amount),
    "",
    "",
    "",
  );

  if(order.couponId){
    subtotalPosition = invoiceTableTop + (i + 1) * 65;
    generateTableRow(
      doc,
      subtotalPosition,
      "Coupon",
      `${coupon}%`,
      "",
      "",
      "",
    );
  }

  const duePosition = subtotalPosition + 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "Balance Due",
    formatCurrency(order.totalOrderPrice * 100),
    "",
    "",
    "",
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 7 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  product,
  discount,
  unitCost,
  quantity,
  price,
  afterDiscount
) {
  doc
    .fontSize(10)
    .text(product, 50, y)
    .text(discount, 130, y)
    .text(unitCost, 180, y, { width: 90, align: "right" })
    .text(quantity, 270, y, { width: 90, align: "right" })
    .text(price, 350, y, { width: 90, align: "right" })
    .text(afterDiscount, 450, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}


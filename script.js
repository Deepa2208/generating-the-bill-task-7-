// script.js
let totalAmount = 0;

function addProduct() {
  const name = document.getElementById("productName").value;
  const qty = parseInt(document.getElementById("productQty").value);
  const price = parseFloat(document.getElementById("productPrice").value);
  if (!name || qty <= 0 || price <= 0) {
    alert("Please enter valid product details.");
    return;
  }

  const total = qty * price;
  totalAmount += total;

  const table = document.getElementById("productTable").querySelector("tbody");
  const row = table.insertRow();

  row.insertCell(0).innerText = name;
  row.insertCell(1).innerText = qty;
  row.insertCell(2).innerText = price.toFixed(2);
  row.insertCell(3).innerText = total.toFixed(2);

  document.getElementById(
    "totalAmount"
  ).innerText = `Total: ₹${totalAmount.toFixed(2)}`;

  // Clear product input fields
  document.getElementById("productName").value = "";
  document.getElementById("productQty").value = "";
  document.getElementById("productPrice").value = "";
}

function saveBill() {
  const buyerName = document.getElementById("buyerName").value;
  const buyerAddress = document.getElementById("buyerAddress").value;
  const buyerContact = document.getElementById("buyerContact").value;
  const buyerEmail = document.getElementById("buyerEmail").value;

  const transactionId = document.getElementById("transactionId").value;
  const transactionDate = document.getElementById("transactionDate").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  const productRows = document
    .getElementById("productTable")
    .querySelectorAll("tbody tr");
  let products = [];
  productRows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    products.push({
      name: cells[0].innerText,
      quantity: cells[1].innerText,
      price: cells[2].innerText,
      total: cells[3].innerText,
    });
  });

  if (!buyerName || !transactionId || products.length === 0) {
    alert("Please fill out all required fields and add at least one product.");
    return;
  }

  fetch("save_bill.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buyer: { buyerName, buyerAddress, buyerContact, buyerEmail },
      transaction: { transactionId, transactionDate, paymentMethod },
      products,
      totalAmount,
    }),
  })
    .then((res) => res.text())
    .then((data) => alert(data))
    .catch((err) => console.error("Error saving bill:", err));
}

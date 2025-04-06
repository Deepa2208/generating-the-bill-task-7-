<?php
// save_bill.php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "billing_db";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$buyer = $data['buyer'];
$transaction = $data['transaction'];
$products = $data['products'];
$totalAmount = $data['totalAmount'];

// Insert buyer info
$stmt = $conn->prepare("INSERT INTO buyers (name, address, contact, email) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $buyer['buyerName'], $buyer['buyerAddress'], $buyer['buyerContact'], $buyer['buyerEmail']);
$stmt->execute();
$buyer_id = $stmt->insert_id;
$stmt->close();

// Insert transaction
$stmt = $conn->prepare("INSERT INTO transactions (transaction_id, date, method, total, buyer_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssdi", $transaction['transactionId'], $transaction['transactionDate'], $transaction['paymentMethod'], $totalAmount, $buyer_id);
$stmt->execute();
$transaction_id = $stmt->insert_id;
$stmt->close();

// Insert each product
$stmt = $conn->prepare("INSERT INTO products (name, quantity, price, total, transaction_id) VALUES (?, ?, ?, ?, ?)");
foreach ($products as $prod) {
  $stmt->bind_param("siddi", $prod['name'], $prod['quantity'], $prod['price'], $prod['total'], $transaction_id);
  $stmt->execute();
}
$stmt->close();

$conn->close();
echo "✅ Bill saved successfully!";
?>

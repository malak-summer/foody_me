<?php
session_start();
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "food_data";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]));
}

$table = $_GET['table'];
$status = isset($_GET['status']) ? $_GET['status'] : '';

// Validate table name
if (!in_array($table, ['coupons', 'menu_items', 'orders'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid table name']);
    exit;
}

// Build SQL query
$sql = "SELECT * FROM $table";
if ($table === 'orders' && $status) {
    $sql .= " WHERE status = ?";
}

$stmt = $conn->prepare($sql);

if ($table === 'orders' && $status) {
    $stmt->bind_param("s", $status);
}

$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);

$stmt->close();
$conn->close();
?>

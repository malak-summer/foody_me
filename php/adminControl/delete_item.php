<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "food_data"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$table = $data['table'];
$id = $data['id'];

// Validate table name
$validTables = ['coupons', 'menu_items','orders'];
if (!in_array($table, $validTables)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid table name']);
    exit;
}

// Prepare SQL statement based on table
if ($table === 'coupons') {
    $sql = "DELETE FROM coupons WHERE id = ?";
} else if ($table === 'menu_items') {
    $sql = "DELETE FROM menu_items WHERE id = ?";
}
else if ($table === 'orders') {
    $sql = "DELETE FROM orders WHERE id = ?";
}

// Prepare and execute the SQL statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Item deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete item']);
}

$stmt->close();
$conn->close();
?>

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
$code = $data['code'];
$expiryDate = $data['expiry_date'];
$usageLimit = $data['usage_limit'];

// Check if all required fields are provided
if (empty($code) || empty($expiryDate) || !is_numeric($usageLimit)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input. Please check your data and try again.']);
    exit;
}

// Prepare an SQL statement to insert the coupon into the database
$sql = "INSERT INTO coupons (code, expiry_date, usage_limit) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssi", $code, $expiryDate, $usageLimit);

// Execute the statement and check for success
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Coupon added successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add coupon. Please try again.']);
}

$stmt->close();
$conn->close();
?>

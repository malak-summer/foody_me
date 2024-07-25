<?php
// Database connection
$servername = "localhost";
$username = "root";        
$password = "";           
$dbname = "food_data";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve data from the request
    $customerEmail = $_POST['customer_email'];
    $customerPhone = $_POST['customer_phone'];
    $customerAddress = $_POST['customer_address'];
    $cartItems = json_decode($_POST['cart_items'], true);
    $total = floatval($_POST['total']);

    // Check if all required fields are provided
    if (empty($customerEmail) || empty($customerPhone) || empty($customerAddress) || empty($cartItems) || !is_numeric($total)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input. Please check your data and try again.']);
        exit;
    }

    // Prepare an SQL statement to insert the order into the database
    $stmt = $conn->prepare("INSERT INTO orders (customer_email, customer_phone, customer_address, cart_items, total, status) VALUES (?, ?, ?, ?, ?, ?)");

    // Check if preparation was successful
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    $cartItemsJson = json_encode($cartItems);
    $status = 'pending'; // Default status value
    $stmt->bind_param("ssssss", $customerEmail, $customerPhone, $customerAddress, $cartItemsJson, $total, $status);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Order placed successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to place order. Please try again.']);
    }

    $stmt->close();
    $conn->close();
}
?>

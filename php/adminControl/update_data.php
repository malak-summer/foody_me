<?php
// Database connection
$servername = "localhost";
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "food_data"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$table = $data['table'];
$id = $data['id'];
$fields = $data['data'];

// Build SQL query dynamically based on the table and fields
$fieldAssignments = [];
foreach ($fields as $field => $value) {
    $fieldAssignments[] = "$field = '" . $conn->real_escape_string($value) . "'";
}

$sql = "UPDATE $table SET " . implode(', ', $fieldAssignments) . " WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>

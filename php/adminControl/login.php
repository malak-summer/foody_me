<?php
session_start(); // Start the session

include '../../db/local.php';

if ($con->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $con->connect_error]));
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Check if user exists
$sql = "SELECT id, username, password FROM users WHERE username = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($password, $user['password'])) {
        // Store user session data
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['loggedin'] = true; // Set logged-in status

        // Return success response
        echo json_encode(['success' => true]);
    } else {
        // Incorrect password
        echo json_encode(['success' => false, 'error' => 'Incorrect password']);
    }
} else {
    // User not found
    echo json_encode(['success' => false, 'error' => 'User not found']);
}

$stmt->close();
$con->close();
?>

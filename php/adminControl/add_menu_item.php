<?php
// add_menu_item.php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "food_data";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

// Check if a file was uploaded
if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $fileSize = $_FILES['image']['size'];
    $fileType = $_FILES['image']['type'];

    // Specify the directory for uploaded images
    $uploadDir = '../../img/';
    $destination = $uploadDir . basename($fileName);

    // Move the file to the destination directory
    if (move_uploaded_file($fileTmpPath, $destination)) {
        // Prepare SQL query
        $name = $_POST['name'];
        $price = $_POST['price'];
        $imagePath = '../img/' . basename($fileName);

        $stmt = $conn->prepare("INSERT INTO menu_items (name, price, image) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $price, $imagePath);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to insert menu item']);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
}

$conn->close();
?>

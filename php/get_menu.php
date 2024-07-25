<?php
header('Content-Type: application/json');

session_start();

// Include the database connection file
include '../db/local.php';

// Fetch menu items from the database
$sql = "SELECT name, price, image FROM menu_items"; // Adjust table and column names as needed
$result = mysqli_query($con, $sql);

$menuItems = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $menuItems[] = $row;
    }
}

mysqli_close($con);

echo json_encode($menuItems);
?>

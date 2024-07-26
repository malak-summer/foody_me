<?php
session_start();

// Destroy the session to log out
session_destroy();

// Send a JSON response
echo json_encode(['success' => true]);
?>

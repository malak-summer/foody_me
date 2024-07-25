<?php
// Include the database connection file
include '../db/local.php';

// Check if a coupon code is provided
if (isset($_POST['coupon_code'])) {
    $coupon_code = mysqli_real_escape_string($con, $_POST['coupon_code']);
    
    // Query to check if the coupon exists and is valid
    $query = "SELECT * FROM coupons WHERE code = '$coupon_code' AND expiry_date >= CURDATE()";
    $result = mysqli_query($con, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $coupon = mysqli_fetch_assoc($result);

        // Check if the coupon usage limit has not been reached
        if ($coupon['usage_limit'] > 0) {
            $response = array(
                'status' => 'success',
                'discount' => $coupon['discount'],
                'type' => $coupon['type'] // 'percentage' or 'fixed'
            );

            // Decrease the usage limit by 1
            $update_query = "UPDATE coupons SET usage_limit = usage_limit - 1 WHERE code = '$coupon_code'";
            mysqli_query($con, $update_query);
        } else {
            // Coupon usage limit exceeded
            $response = array(
                'status' => 'error',
                'message' => 'Coupon usage limit exceeded.'
            );
        }
    } else {
        // Invalid or expired coupon
        $response = array(
            'status' => 'error',
            'message' => 'Invalid or expired coupon code.'
        );
    }
    
    // Return JSON response
    echo json_encode($response);
}
?>

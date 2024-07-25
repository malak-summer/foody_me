<?php
session_start();

// Include the database connection file
include '../db/local.php'; // Ensure this file contains your database connection

$cart_items = [];

if (isset($_POST['cart_items'])) {
    $cart_items = json_decode($_POST['cart_items'], true);
}

$discount = 0;
$fixed_discount = 0;
$shipping = 4.99;

$appliedCoupons = isset($_POST['appliedCoupons']) ? json_decode($_POST['appliedCoupons'], true) : [];

$notUsedCoupons = array_filter($appliedCoupons, function($coupon) {
    return !$coupon['used'];
});

$percentageDiscount = 0;
$fixedDiscount = 0;

foreach ($notUsedCoupons as $coupon) {
    if ($coupon['type'] === 'percentage') {
        $percentageDiscount += $coupon['value'];
    } elseif ($coupon['type'] === 'fixed') {
        $fixedDiscount += $coupon['value'];
    }
}
$cart_subtotal = 0;
foreach ($cart_items as $item) {
    $cart_subtotal += $item['price'] * $item['quantity'];
}
$discountAmount = ($cart_subtotal * $percentageDiscount) / 100;
$discountAmount += $fixedDiscount;

$shipping = $cart_subtotal > 0 ? 4.99 : 0;

$total = $cart_subtotal - $discountAmount + $shipping;

echo json_encode([
    'subtotal' => number_format($cart_subtotal, 2),
    'discount' => number_format($discountAmount, 2),
    'shipping' => number_format($shipping, 2),
    'total' => number_format($total, 2)
]);
?>
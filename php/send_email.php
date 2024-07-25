<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../vendor/autoload.php'; // Adjust path if needed

use \Mailjet\Resources;

$publicApiKey = '';
$privateApiKey = '';

if (!$publicApiKey || !$privateApiKey) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'API keys not set']);
    exit;
}

$mj = new \Mailjet\Client($publicApiKey, $privateApiKey, true, ['version' => 'v3.1']);

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$body = [
    'Messages' => [
        [
            'From' => [
                'Email' => "your-email@example.com",
                'Name' => "Your Name"
            ],
            'To' => [
                [
                    'Email' => "your-email@example.com",
                    'Name' => "Your Name"
                ]
            ],
            'Subject' => "Contact Form Submission from " . htmlspecialchars($data['name']),
            'TextPart' => "Message from: " . htmlspecialchars($data['name']) . "\nEmail: " . htmlspecialchars($data['email']) . "\nPhone: " . htmlspecialchars($data['phone']) . "\n\n" . htmlspecialchars($data['message']),
            'HTMLPart' => "<h3>Message from: " . htmlspecialchars($data['name']) . "</h3><p>Email: " . htmlspecialchars($data['email']) . "</p><p>Phone: " . htmlspecialchars($data['phone']) . "</p><p>" . nl2br(htmlspecialchars($data['message'])) . "</p>"
        ]
    ]
];

try {
    $response = $mj->post(Resources::$Email, ['body' => $body]);

    header('Content-Type: application/json');
    if ($response->success()) {
        echo json_encode(['success' => true]);
    } else {
        $errorData = $response->getData();
        // Print entire response for debugging
        echo json_encode([
            'success' => false,
            'error' => 'API call failed',
            'response' => $errorData
        ]);
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Exception: ' . $e->getMessage()
    ]);
}
?>

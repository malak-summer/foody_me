<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../vendor/autoload.php';

use Dotenv\Dotenv; 
use MailerSend\MailerSend;
use MailerSend\Exceptions\MailerSendException;
use MailerSend\Helpers\Builder\Recipient;
use MailerSend\Helpers\Builder\EmailParams;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$apiKey = $_ENV['MAILERSEND_API_KEY'];
$senderEmail = $_ENV['MAILERSEND_SENDER_EMAIL'];
$senderName = $_ENV['MAILERSEND_SENDER_NAME'];
$recipientEmail = $_ENV['MAILERSEND_RECIPIENT_EMAIL'];
$recipientName = $_ENV['MAILERSEND_RECIPIENT_NAME'];

if (!$apiKey) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'API key not set']);
    exit;
}

$mailerSend = new MailerSend(['api_key' => $apiKey]);

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $recipients = [new Recipient($recipientEmail, $recipientName)];

    $emailParams = (new EmailParams())
        ->setFrom($senderEmail)
        ->setFromName($senderName)
        ->setRecipients($recipients)
        ->setSubject("Contact Form Submission from " . htmlspecialchars($data['name']))
        ->setText("Message from: " . htmlspecialchars($data['name']) . "\nEmail: " . htmlspecialchars($data['email']) . "\nPhone: " . htmlspecialchars($data['phone']) . "\n\n" . htmlspecialchars($data['message']))
        ->setHtml("<h3>Message from: " . htmlspecialchars($data['name']) . "</h3><p>Email: " . htmlspecialchars($data['email']) . "</p><p>Phone: " . htmlspecialchars($data['phone']) . "</p><p>" . nl2br(htmlspecialchars($data['message'])) . "</p>");

    $mailerSend->email->send($emailParams);

    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
} catch (MailerSendException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'MailerSendException: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Exception: ' . $e->getMessage()
    ]);
}
?>
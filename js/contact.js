document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Send data using Fetch API
    fetch('../php/send_email.php', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        if (data.success) {
            responseMessage.innerHTML = '<p class="text-success">Email sent successfully!</p>';
            document.getElementById('contactForm').reset(); // Reset form after successful submission
        } else {
            responseMessage.innerHTML = '<p class="text-danger">Failed to send email: ' + data.error + '</p>';
        }
    })
    .catch(error => {
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.innerHTML = '<p class="text-danger">Error: ' + error.message + '</p>';
    });
});
function redirectToOrder() {
    window.location.href = 'menu.html';
  }
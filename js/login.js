document.addEventListener('DOMContentLoaded', function() {
    fetch('../php/adminControl/check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                window.location.href = '../html/adminHome.html'; //Rediect to login
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('../php/adminControl/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');

        if (data.success) {
            // Redirect to the home page on successful login
            window.location.href = '../html/adminHome.html';
        } else {
            // Display error message
            responseMessage.textContent = data.error;
            responseMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

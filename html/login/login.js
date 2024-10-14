document.addEventListener('DOMContentLoaded', function () {
    // Get the login form element
    const loginForm = document.querySelector('.login-form');

    // Add a submit event listener to the form
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent the form from submitting the traditional way

        // Get the values from the input fields
        const username = loginForm.querySelector('input[placeholder="username"]').value;
        const password = loginForm.querySelector('input[placeholder="password"]').value;

        // Prepare the request payload
        const loginPayload = {
            username: username,
            password: password
        };

        try {
            // Make the POST request to the authenticate API
            const response = await fetch('http://localhost:5291/api/User/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginPayload)
            });

            // Parse the JSON response
            const result = await response.json();

            if (response.ok) {
                
                localStorage.setItem('user', JSON.stringify(result.user)); // Assuming user info is part of the response

                // Redirect to home-page.html
                window.location.href = '../home/index.html';
            } else {
                // Show an error message if login fails
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
});

document.getElementById("sub").addEventListener("click", event => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm-password").value;

    if (password !== confirm_password) {
        document.getElementById("registration-message").textContent = "Password and confirm password do not match.";
        return;
    }

    // Send a POST request to your FastAPI backend to handle the registration.
    fetch('http://localhost:8000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, email: email, password: password })
    })

    .then(response => {
        
        if (response.ok) {
            // Redirect to a success page or perform other actions
            window.location.replace("http://localhost:7000/index.html");
        } else {
            alert("Username already exist");
            window.location.reload();
            return response.json(); // Parse the response JSON
        }
    })

    // .then(data => {
    //     if (data && data.error) {
    //         // Display the error message in an alert or on the page
    //         alert(data.error);
    //     } else {
    //         // Handle other errors as needed
    //         alert('Registration failed. Please check your data.');
    //     }
    // })

    .catch(error => {
        console.error('Error:', error);
    });
});

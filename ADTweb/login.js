document.getElementById("sub").addEventListener("click", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.message === "Login successful") {
                sessionStorage.setItem("username",username);
                // Redirect to the home page (home.html) after successful login.
                window.location.replace("http://localhost:7000/home.html");
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during login.');
    }
});

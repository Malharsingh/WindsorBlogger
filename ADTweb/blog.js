document.getElementById("sub").addEventListener("click", event => {

    local = sessionStorage.getItem("username");

    if (local == null) {
        window.location.replace("http://localhost:7000/index.html")
    }

    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value;

    const t = { title: title, content: content, author: { username: sessionStorage.getItem("username") }, tags: tags };
    console.log(t);
    // You can send a POST request to your FastAPI backend to handle the registration.
    // Replace 'YOUR_BACKEND_URL' with the actual URL of your backend API.
    fetch('http://localhost:8000/blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(t)

    })

        .then(response => {
            console.log(response);
            if (response.ok) {
                // Redirect to a success page or perform other actions
                window.location.replace("http://localhost:7000/home.html")
            } else {
                alert('error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
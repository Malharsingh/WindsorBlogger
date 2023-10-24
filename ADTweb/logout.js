document.getElementById("out").addEventListener("click" , event =>{

    sessionStorage.clear();
    window.location.replace("http://localhost:7000/index.html");
} )
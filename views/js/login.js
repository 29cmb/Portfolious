function login(event){
    event.preventDefault();

    const loginButton = event.target.querySelector('input[type="submit"]');
    loginButton.disabled = true;

    const data = new FormData(event.target)
    const body = {
        username: data.get('username'),
        password: data.get('password')
    }

    document.getElementById("status").innerHTML = "Processing"

    fetch("/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(returned => {
        loginButton.disabled = false;
        document.getElementById("status").innerHTML = returned.message 
        if(returned.success == true){
            var generatedcookie = returned.cookie
            document.cookie=`session=${generatedcookie}; expires=${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toUTCString()}; path=/` 
        }
    })
    .catch(error => {
        console.error("Error logging in: ", error.message)
    })
}
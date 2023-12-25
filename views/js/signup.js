function signup(event){
    event.preventDefault();

    const signupButton = event.target.querySelector('input[type="submit"]');
    signupButton.disabled = true;

    const data = new FormData(event.target)
    const body = {
        email: data.get('email'),
        username: data.get('username'),
        password: data.get('password')
    }

    document.getElementById("status").innerHTML = "Processing"

    fetch("/api/v1/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(returned => {
        signupButton.disabled = false;
        document.getElementById("status").innerHTML = returned.message
    })
    .catch(error => {
        console.error("Error signing up: ", error.message)
    })
}
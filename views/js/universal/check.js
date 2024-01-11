function runLoginCheck(){

    const body = {
        cookie: getCookie("session") || ""
    }

    console.log(body)

    fetch("/api/v1/universal/getUserFromCookie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(returned => {
        console.log(returned)
        if(returned.success === false){
            window.location.href = "/login.html"
        }
    })
}


// snippet from w3schools
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}



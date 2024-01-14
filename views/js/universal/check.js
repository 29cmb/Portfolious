async function runLoginCheck(){

    const body = {
        cookie: getCookie("session")
    }

    var success = false


    await fetch("/api/universal/v1/getUserFromCookie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(returned => {
       success = returned.success
        // if(returned.success === false){
        //    window.location.href = "/login.html"
        // }
    })
    return success
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



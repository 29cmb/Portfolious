function themeHandle(pOnPage){
    const checkbox = document.querySelector('.input');
    var prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if(getCookie("theme") != ""){
        prefersDarkMode = getCookie("theme") == "dark" ? true : false
    } 
    
    if (prefersDarkMode) {
        checkbox.checked = true;
        applyDarkTheme(pOnPage, true);
    } else {
        checkbox.checked = false;
        applyLightTheme(pOnPage, true);
    }
    
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            applyDarkTheme(pOnPage, false);
        } else {
            applyLightTheme(pOnPage, false);
        }
    });
};

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



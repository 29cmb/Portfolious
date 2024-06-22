function disableLoader() {
    var loader = document.querySelector('.loader');
    var otherElements = document.querySelectorAll('body > *:not(.loader):not(script):not(style)');
    
    loader.style.display = 'none';
    
    otherElements.forEach(function(element) {
        element.style.display = 'block';
    });
}
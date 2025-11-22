function loadHeaderFooter(){
    fetch('header.html')
    .then(res => res.text())
    .then(data => document.querySelector('header').innerHTML = data);

    fetch('footer.html')
    .then(res => res.text())
    .then(data => document.querySelector('footer').innerHTML = data);
}

document.addEventListener('DOMContentLoaded', loadHeaderFooter);

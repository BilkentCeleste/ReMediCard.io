document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 30,
            behavior: 'smooth'
        });
    });
});

// Navbar menüsünü mobilde açıp kapama
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar ul');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Panelin açılıp kapanmasını sağlayan işlev
document.querySelector('.contact-tab').addEventListener('click', function() {
    document.getElementById('contact-panel').classList.toggle('active');
});

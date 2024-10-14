document.addEventListener('DOMContentLoaded', function() {
    fetch('./../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            const user = localStorage.getItem('user');

            if (user) {
                // Ako postoji korisnik, dodaj "Logout" dugme
                const menu = document.querySelector('.menu');
                const logoutLink = document.createElement('a');
                logoutLink.href = "#"; // Ovde možeš dodati link ka logout funkciji ili ostaviti prazno
                logoutLink.innerText = "Logout";
                logoutLink.addEventListener('click', function() {
                    // Logika za odjavu korisnika, npr. brisanje korisnika iz localStorage
                    localStorage.removeItem('user');
                    window.location.reload(); // Osveži stranicu nakon odjave
                    window.location.href = '../login/auth.html';
                });
                menu.appendChild(logoutLink); // Dodaj "Logout" u meni
            }
        })
        .catch(error => console.error('Error loading header:', error));
});

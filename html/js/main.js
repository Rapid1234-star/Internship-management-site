// main.js

// Confirm JS loaded
console.log('JS Loaded');

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Filter internships on index or internships page
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filterForm');
    const internshipCards = document.querySelectorAll('.internship-card');
    if (filterForm) {
        filterForm.addEventListener('submit', e => {
            e.preventDefault();
            const keyword = document.getElementById('searchKeyword').value.toLowerCase();
            internshipCards.forEach(card => {
                const title = card.querySelector('.internship-title').textContent.toLowerCase();
                const location = card.querySelector('.internship-location').textContent.toLowerCase();
                card.style.display = (title.includes(keyword) || location.includes(keyword)) ? 'block' : 'none';
            });
        });
    }

    // Dynamic label color on focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.color = 'goldenrod';
            }
        });
        input.addEventListener('blur', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.color = '#003366';
            }
        });
    });
});

// Mobile nav toggle (if implemented)
function toggleNav() {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('open');
}

// Smooth scrolling for section navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});



// Toggle mobile menu visibility
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('visible');
});

// Collapse mobile menu when a menu item is clicked
document.querySelectorAll('#mobile-menu a').forEach(menuItem => {
    menuItem.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the target
        }
        collapseMobileMenu(); // Call the collapse function
    });
});

// Ensure the collapseMobileMenu function is globally accessible
window.collapseMobileMenu = collapseMobileMenu;

// Toggle "about" section visibility
const aboutToggle = document.getElementById('about-toggle');
const aboutFull = document.getElementById('about-full');
const aboutSummary = document.getElementById('about-summary');

aboutToggle.addEventListener('click', () => {
    if (aboutFull.style.display === 'none') {
        aboutFull.style.display = 'block';
        aboutSummary.style.display = 'none';
        aboutToggle.textContent = 'Zobrazit méně';
    } else {
        aboutFull.style.display = 'none';
        aboutSummary.style.display = 'block';
        aboutToggle.textContent = 'Zobrazit více';
    }
});

// Load references from JSON file
async function loadReferences() {
    try {
        const response = await fetch('references.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch references: ${response.status}`);
        }
        const references = await response.json();
        const carouselItems = document.getElementById('carousel-items');

        if (references.length === 0) {
            carouselItems.innerHTML = '<p>No references available.</p>';
            return;
        }

        references.forEach(reference => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `<p>${reference.text}</p><i>${reference.author}</i>`;
            carouselItems.appendChild(item);
        });

        updateCarousel();
    } catch (error) {
        console.error('Error loading references:', error);
        const carouselItems = document.getElementById('carousel-items');
        carouselItems.innerHTML = '<p>Error loading references. Please try again later.</p>';
    }
}

// Carousel functionality
const carousel = document.getElementById('carousel-items');
const leftButton = document.getElementById('carousel-left');
const rightButton = document.getElementById('carousel-right');
let currentIndex = 0;

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        item.style.display = index === currentIndex ? 'block' : 'none';
    });
}

leftButton.addEventListener('click', () => {
    const items = document.querySelectorAll('.carousel-item');
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
});

rightButton.addEventListener('click', () => {
    const items = document.querySelectorAll('.carousel-item');
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
});

// Swipe functionality for mobile
let startX = 0;
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const items = document.querySelectorAll('.carousel-item');
    if (startX - endX > 50) {
        currentIndex = (currentIndex + 1) % items.length;
    } else if (endX - startX > 50) {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    }
    updateCarousel();
});

// Initialize carousel
document.addEventListener('DOMContentLoaded', loadReferences);

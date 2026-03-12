// --- 1. Compliment Generator ---
const compliments = [
    "You have the most beautiful smile.",
    "I love how passionate you are about the things you care about.",
    "Your sense of humor is my absolute favorite.",
    "I always feel safe and happy when I'm talking to you.",
    "You are the best teammate I could ask for.",
    "Even when we are just playing games, you make my whole day better.",
    "You are my favorite flower, Tofu."
];
const complimentBtn = document.getElementById('compliment-btn');
const textDisplay = document.getElementById('compliment-text');

complimentBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    textDisplay.textContent = compliments[randomIndex];
});

// --- 2. Music Player ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "🎵 Play Our Song";
    } else {
        bgMusic.play();
        musicBtn.textContent = "⏸️ Pause Song";
    }
    isPlaying = !isPlaying;
});

// --- 3. Scroll Fade-in Animation ---
// This makes the cards fade in beautifully as she scrolls down
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 }); // Triggers when 10% of the card is visible

cards.forEach(card => observer.observe(card));

// --- 4. Falling Petals Animation ---
function createPetal() {
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomize petal size, start position, and falling speed
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.width = Math.random() * 10 + 10 + 'px';
    petal.style.height = petal.style.width;
    petal.style.animationDuration = Math.random() * 3 + 5 + 's'; // Falls between 5-8 seconds
    
    container.appendChild(petal);
    
    // Remove the petal after it falls to keep the website running fast
    setTimeout(() => {
        petal.remove();
    }, 8000);
}

// Generate a new petal every 400 milliseconds
setInterval(createPetal, 400);

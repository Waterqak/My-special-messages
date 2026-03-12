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

complimentBtn.addEventListener('click', (e) => {
    // Add a quick fade out/in effect for the text
    textDisplay.style.opacity = 0;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * compliments.length);
        textDisplay.textContent = compliments[randomIndex];
        textDisplay.style.opacity = 1;
    }, 300);
});

// --- 2. Music Player ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "🎵 Play Our Song";
        musicBtn.style.background = "var(--dark-pink)";
    } else {
        bgMusic.play();
        musicBtn.textContent = "⏸️ Pause Song";
        musicBtn.style.background = "var(--leaf-green)"; // Changes color when playing
    }
    isPlaying = !isPlaying;
});

// --- 3. Scroll Fade-in Animation ---
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 }); 

cards.forEach(card => observer.observe(card));

// --- 4. Falling Petals Animation ---
function createPetal() {
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.width = Math.random() * 10 + 10 + 'px';
    petal.style.height = petal.style.width;
    petal.style.animationDuration = Math.random() * 3 + 5 + 's'; 
    
    container.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
    }, 8000);
}
setInterval(createPetal, 400);

// --- 5. Interactive Click Hearts (NEW!) ---
// Whenever she clicks anywhere on the page, a little heart floats up
document.addEventListener('click', function(e) {
    // Don't spawn hearts if she is clicking the buttons
    if(e.target.tagName === 'BUTTON') return;

    const heart = document.createElement('div');
    heart.innerHTML = '❤️'; // You can change this to 🌸 if you prefer!
    heart.classList.add('click-heart');
    
    // Position the heart exactly where she clicked
    heart.style.left = `${e.pageX - 10}px`;
    heart.style.top = `${e.pageY - 10}px`;
    
    document.body.appendChild(heart);
    
    // Remove the heart from the code after the float animation finishes
    setTimeout(() => {
        heart.remove();
    }, 1000);
});
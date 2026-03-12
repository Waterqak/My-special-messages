// --- 1. Entrance Animation & Music ---
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-btn');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden-screen');
    bgMusic.play();
    isPlaying = true;
    musicBtn.textContent = "⏸️ Pause Song";
    musicBtn.style.background = "var(--leaf-green)";
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "🎵 Play Our Song";
        musicBtn.style.background = "var(--dark-pink)";
    } else {
        bgMusic.play();
        musicBtn.textContent = "⏸️ Pause Song";
        musicBtn.style.background = "var(--leaf-green)";
    }
    isPlaying = !isPlaying;
});

// --- 2. Compliment Generator ---
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
    textDisplay.style.opacity = 0;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * compliments.length);
        textDisplay.textContent = compliments[randomIndex];
        textDisplay.style.opacity = 1;
    }, 300);
});

// --- 3. Typewriter Logic ---
const letterParagraphs = [
    { id: 'typewriter-text1', text: "Dear Tofu," },
    { id: 'typewriter-text2', text: "I wanted to make this because I want you to know how much I truly value you. I know I’m still learning how to be the partner you deserve, but my goal is always to take care of your heart." },
    { id: 'typewriter-text3', text: "Thank you for being my flower and for letting me be the one who gets to water it." },
    { id: 'signature-text', text: "- Yours ❤️" }
];

let isTyping = false;
function typeWriter() {
    if(isTyping) return;
    isTyping = true;
    let currentP = 0;
    let charIndex = 0;

    function typeNextChar() {
        if (currentP < letterParagraphs.length) {
            const pConfig = letterParagraphs[currentP];
            const element = document.getElementById(pConfig.id);
            element.classList.add('typing-cursor');

            if (charIndex < pConfig.text.length) {
                element.textContent += pConfig.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeNextChar, 35); // Speed of typing
            } else {
                element.classList.remove('typing-cursor');
                currentP++;
                charIndex = 0;
                setTimeout(typeNextChar, 500); // Pause between paragraphs
            }
        }
    }
    typeNextChar();
}

// --- 4. Scroll Animations & Triggering the Typewriter ---
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            
            // If the card sliding in is the letter, wait half a second then start typing!
            if (entry.target.classList.contains('letter-wrapper')) {
                setTimeout(typeWriter, 500);
            }
        }
    });
}, { threshold: 0.15 }); 

cards.forEach(card => observer.observe(card));

// --- 5. Falling Petals ---
function createPetal() {
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.width = Math.random() * 10 + 10 + 'px';
    petal.style.height = petal.style.width;
    petal.style.animationDuration = Math.random() * 3 + 5 + 's'; 
    container.appendChild(petal);
    setTimeout(() => { petal.remove(); }, 8000);
}
setInterval(createPetal, 400);

// --- 6. Interactive Click Hearts ---
document.addEventListener('click', function(e) {
    if(e.target.tagName === 'BUTTON') return;
    const heart = document.createElement('div');
    heart.innerHTML = '❤️'; 
    heart.classList.add('click-heart');
    heart.style.left = `${e.pageX - 10}px`;
    heart.style.top = `${e.pageY - 10}px`;
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 1000);
});
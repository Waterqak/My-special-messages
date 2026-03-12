// --- 1. Custom Cursor ---
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
const clickables = document.querySelectorAll('button, .gallery-item img, #close-lightbox');
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// --- 2. Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// --- 3. Audio & Entrance ---
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-btn');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

function fadeAudio(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - audio.volume) / steps;
    let currentStep = 0;
    const fadeInterval = setInterval(() => {
        currentStep++;
        let newVol = audio.volume + volumeStep;
        audio.volume = Math.max(0, Math.min(1, newVol));
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            if(targetVolume === 0) audio.pause();
        }
    }, stepTime);
}

enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden-screen');
    bgMusic.volume = 0;
    bgMusic.play().then(() => fadeAudio(bgMusic, 0.6, 2000)).catch(e => console.log("Blocked"));
    isPlaying = true;
    musicBtn.textContent = "⏸️ Pause Song";
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) { fadeAudio(bgMusic, 0, 1000); musicBtn.textContent = "🎵 Play Our Song"; } 
    else { bgMusic.play(); fadeAudio(bgMusic, 0.6, 1000); musicBtn.textContent = "⏸️ Pause Song"; }
    isPlaying = !isPlaying;
});

// --- 4. Growth Garden & Compliments ---
let waterCount = 0;
const maxWater = 10;
const compliments = [
    "You have the most beautiful smile.", "I love how passionate you are.", "Your sense of humor is my favorite.",
    "I always feel safe and happy with you.", "You are the best teammate.", "You make my whole day better.", "You are my favorite flower, Tofu."
];
const flowerEmoji = document.getElementById('flower-stage');
const waterFill = document.getElementById('water-fill');
const waterText = document.getElementById('water-count-text');
const secretMsg = document.getElementById('secret-message');
const complimentBtn = document.getElementById('compliment-btn');
const textDisplay = document.getElementById('compliment-text');
const flowerStages = ['🌱', '🌿', '🎍', '🪴', '🎋', '🍃', '🌸', '🌷', '🌹', '💐'];

complimentBtn.addEventListener('click', () => {
    textDisplay.style.opacity = 0;
    setTimeout(() => {
        textDisplay.textContent = compliments[Math.floor(Math.random() * compliments.length)];
        textDisplay.style.opacity = 1;
    }, 400);

    if (waterCount < maxWater) {
        waterCount++;
        waterFill.style.width = (waterCount / maxWater) * 100 + "%";
        waterText.textContent = `Watering Level: ${waterCount}/10`;
        flowerEmoji.textContent = flowerStages[waterCount - 1];
        flowerEmoji.classList.remove('flower-bounce');
        void flowerEmoji.offsetWidth;
        flowerEmoji.classList.add('flower-bounce');
        if (waterCount === maxWater) {
            flowerEmoji.style.transform = "scale(1.5)";
            secretMsg.classList.add('show-message');
            waterText.textContent = "Fully Bloomed! ✨";
        }
    }
});

// --- 5. Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const images = document.querySelectorAll('.enlargeable');
images.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden-screen');
        lightbox.classList.add('active-lightbox');
    });
});
lightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden-screen');
    lightbox.classList.remove('active-lightbox');
});

// --- 6. 3D Tilt ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3; 
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1200px) rotateX(0) rotateY(0) translateY(0)`;
    });
});

// --- 7. Typewriter ---
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
    let currentP = 0, charIndex = 0;
    function typeNextChar() {
        if (currentP < letterParagraphs.length) {
            const pConfig = letterParagraphs[currentP];
            const element = document.getElementById(pConfig.id);
            element.classList.add('typing-cursor');
            if (charIndex < pConfig.text.length) {
                element.textContent += pConfig.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeNextChar, 35);
            } else {
                element.classList.remove('typing-cursor');
                currentP++; charIndex = 0;
                setTimeout(typeNextChar, 500);
            }
        }
    }
    typeNextChar();
}

// --- 8. Observer & Petals & Heart Bursts ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            if (entry.target.classList.contains('letter-wrapper')) setTimeout(typeWriter, 500);
        }
    });
}, { threshold: 0.15 }); 
tiltCards.forEach(card => observer.observe(card));

function createPetal() {
    if (document.hidden) return; 
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 14 + 10;
    petal.style.width = size + 'px'; petal.style.height = size + 'px';
    const fallDuration = Math.random() * 4 + 7; 
    petal.style.animationDuration = `${fallDuration}s, ${Math.random() * 2 + 3}s`; 
    container.appendChild(petal);
    setTimeout(() => petal.remove(), fallDuration * 1000);
}
setInterval(createPetal, 400);

document.addEventListener('click', function(e) {
    if(['BUTTON', 'IMG'].includes(e.target.tagName)) return;
    for(let i=0; i<5; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️'; heart.classList.add('click-heart');
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 40;
        heart.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        heart.style.setProperty('--ty', Math.sin(angle) * velocity - 20 + 'px');
        heart.style.setProperty('--rot', (Math.random() * 90 - 45) + 'deg');
        heart.style.left = `${e.clientX - 10}px`; heart.style.top = `${e.clientY - 10}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});
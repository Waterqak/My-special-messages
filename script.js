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

// --- 3. Audio Fade & Entrance Animation ---
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-btn');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

// Function to smoothly fade audio in or out
function fadeAudio(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - audio.volume) / steps;
    
    let currentStep = 0;
    const fadeInterval = setInterval(() => {
        currentStep++;
        let newVol = audio.volume + volumeStep;
        if(newVol > 1) newVol = 1;
        if(newVol < 0) newVol = 0;
        audio.volume = newVol;
        
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            if(targetVolume === 0) audio.pause();
        }
    }, stepTime);
}

enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden-screen');
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
        fadeAudio(bgMusic, 0.6, 2000); // Smooth 2-second fade-in to 60% volume
    }).catch(e => console.log("Audio blocked"));
    
    isPlaying = true;
    musicBtn.textContent = "⏸️ Pause Song";
    musicBtn.style.background = "var(--leaf-green)";
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) { 
        fadeAudio(bgMusic, 0, 1000); // 1-second fade out
        musicBtn.textContent = "🎵 Play Our Song"; 
        musicBtn.style.background = "var(--dark-pink)"; 
    } else { 
        bgMusic.play();
        fadeAudio(bgMusic, 0.6, 1000); // 1-second fade in
        musicBtn.textContent = "⏸️ Pause Song"; 
        musicBtn.style.background = "var(--leaf-green)"; 
    }
    isPlaying = !isPlaying;
});

// --- 4. Lightbox ---
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

// --- 5. 3D Card Tilt Effect ---
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
            card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 20}px 50px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.6)`;
        }
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1200px) rotateX(0) rotateY(0) translateY(0)`;
        card.style.boxShadow = `0 20px 50px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.5)`;
    });
});

// --- 6. Compliment Generator ---
const compliments = [
    "You have the most beautiful smile.", "I love how passionate you are.", "Your sense of humor is my favorite.",
    "I always feel safe and happy with you.", "You are the best teammate.", "You make my whole day better.", "You are my favorite flower, Tofu."
];
const complimentBtn = document.getElementById('compliment-btn');
const textDisplay = document.getElementById('compliment-text');

complimentBtn.addEventListener('click', () => {
    textDisplay.style.opacity = 0;
    setTimeout(() => {
        textDisplay.textContent = compliments[Math.floor(Math.random() * compliments.length)];
        textDisplay.style.opacity = 1;
    }, 400);
});

// --- 7. Typewriter Logic ---
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

// --- 8. Smooth Scroll Fade-in ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            if(!entry.target.style.transform.includes('perspective')) {
                entry.target.style.transform = "translateY(0)";
            }
            if (entry.target.classList.contains('letter-wrapper')) { setTimeout(typeWriter, 500); }
        }
    });
}, { threshold: 0.15 }); 
tiltCards.forEach(card => observer.observe(card));

// --- 9. Falling Petals ---
function createPetal() {
    if (document.hidden) return; 
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 14 + 10;
    petal.style.width = size + 'px'; petal.style.height = size + 'px';
    const fallDuration = Math.random() * 4 + 7; 
    const swayDuration = Math.random() * 2 + 3; 
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`; 
    container.appendChild(petal);
    setTimeout(() => { petal.remove(); }, fallDuration * 1000);
}
setInterval(createPetal, 400);

// --- 10. Flawless Heart Burst (Multiple hearts on click!) ---
document.addEventListener('click', function(e) {
    if(['BUTTON', 'IMG'].includes(e.target.tagName)) return;
    
    // Spawn 5 hearts exploding outward
    for(let i=0; i<5; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️'; 
        heart.classList.add('click-heart');
        
        // Calculate random explosion directions
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 40; // How far they fly
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity - 20 + 'px'; // Bias upwards slightly
        const rot = (Math.random() * 90 - 45) + 'deg';
        
        heart.style.setProperty('--tx', tx);
        heart.style.setProperty('--ty', ty);
        heart.style.setProperty('--rot', rot);
        
        heart.style.left = `${e.clientX - 10}px`; 
        heart.style.top = `${e.clientY - 10}px`;
        
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1000);
    }
});
/* ═══════════════════════════════════════
   MOON — script.js
   ═══════════════════════════════════════ */
(function () {
    'use strict';

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const rand  = (a, b) => Math.random() * (b - a) + a;
    const randInt = (a, b) => Math.floor(rand(a, b + 1));
    const lerp  = (a, b, t) => a + (b - a) * t;

    /* ── 1. BIRTHDAY COUNTDOWN ───────────────────────────── */
    (function initCountdown() {
        const dEl = $('#cd-d'), hEl = $('#cd-h'), mEl = $('#cd-m'), sEl = $('#cd-s');
        const msgEl = $('#bday-msg');
        if (!dEl) return;
        let prev = { d:-1, h:-1, m:-1, s:-1 };

        function getTarget() {
            const now = new Date();
            const y = (now.getMonth() > 3 || (now.getMonth() === 3 && now.getDate() > 21))
                ? now.getFullYear() + 1 : now.getFullYear();
            return new Date(y, 3, 21, 0, 0, 0, 0);
        }
        const pad = n => String(n).padStart(2, '0');

        function bump(el, val, key) {
            if (prev[key] !== val) {
                el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
                prev[key] = val;
            }
            el.textContent = pad(val);
        }

        const bdayLines = [
            "Today's the day. Happy birthday, Moon. 🎂",
            "21 years of you and the world is better for it. 🌙",
            "You made it to 21. That deserves a whole celebration.",
            "Happy birthday. I hope today feels as good as you make me feel. 🌕",
        ];
        let bdayIdx = 0;

        function tick() {
            const diff = getTarget() - new Date();
            if (diff <= 0) {
                ['d','h','m','s'].forEach(k => document.getElementById('cd-'+k).textContent = '00');
                msgEl.textContent = bdayLines[bdayIdx % bdayLines.length];
                if (diff > -86400000) { spawnConfettiBurst(); bdayIdx++; }
                return;
            }
            const t = Math.floor(diff / 1000);
            bump(dEl, Math.floor(t/86400), 'd');
            bump(hEl, Math.floor((t%86400)/3600), 'h');
            bump(mEl, Math.floor((t%3600)/60), 'm');
            bump(sEl, t%60, 's');
            const d = Math.floor(t/86400);
            msgEl.textContent = d===0&&Math.floor((t%86400)/3600)===0 ? "Any minute now. 🌙"
                : d===0  ? "It's today! Just a few hours left. 🎂"
                : d===1  ? "Tomorrow. I'm already excited for you."
                : d<=7   ? `Only ${d} more days. I can't wait.`
                : d<=30  ? `${d} days to go. It's coming up fast.`
                          : "Counting down every single day. 🌕";
        }
        tick(); setInterval(tick, 1000);
    })();

    /* ── 2. CONFETTI ─────────────────────────────────────── */
    function spawnConfettiBurst(count = 60) {
        const c = $('#confetti-container'); if (!c) return;
        const cols = ['#e8c96a','#c4d8f5','#f5a0c0','#a0e0d0','#ffffff','#ffd700'];
        const f = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            const sz = rand(5,11), dur = rand(2.2,4.8), spin = rand(-720,720);
            el.style.cssText = `left:${rand(8,92)}%;top:-${sz*2}px;width:${sz}px;height:${sz*rand(.4,1.2)}px;background:${cols[randInt(0,cols.length-1)]};border-radius:${rand(0,4)}px;animation-duration:${dur}s;animation-delay:${rand(0,1.6)}s;--spin:${spin}deg;transform:rotate(${rand(0,360)}deg);`;
            f.appendChild(el);
            setTimeout(() => el.remove(), (dur+2)*1000);
        }
        c.appendChild(f);
    }

    /* ── 3. NEBULA ───────────────────────────────────────── */
    (function initNebula() {
        const canvas = $('#nebula-canvas');
        const ctx    = canvas.getContext('2d', { alpha: false });
        let W, H, blobs = [], raf;
        const DEFS = [
            { cx:.15, cy:.25, rx:.50, ry:.38, r:60,  g:80,  b:220, a:.055 },
            { cx:.80, cy:.70, rx:.45, ry:.36, r:80,  g:50,  b:200, a:.048 },
            { cx:.50, cy:.50, rx:.60, ry:.45, r:30,  g:100, b:180, a:.035 },
            { cx:.85, cy:.20, rx:.38, ry:.30, r:180, g:140, b:50,  a:.038 },
            { cx:.20, cy:.80, rx:.40, ry:.32, r:50,  g:80,  b:210, a:.042 },
            { cx:.65, cy:.35, rx:.35, ry:.28, r:100, g:160, b:220, a:.030 },
        ];
        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            blobs = DEFS.map(d => ({ ...d, t: rand(0, Math.PI*2) }));
        }
        function draw() {
            ctx.fillStyle = '#030810'; ctx.fillRect(0,0,W,H);
            blobs.forEach(b => {
                b.t += 0.0018; // slow and dreamy
                const px = b.cx*W + Math.sin(b.t*.65+1.0)*W*.055;
                const py = b.cy*H + Math.cos(b.t*.5 +0.5)*H*.048;
                const rx = b.rx*W*.5, ry = b.ry*H*.5;
                const pulse = 1 + .07*Math.sin(b.t*1.3);
                ctx.save(); ctx.translate(px,py); ctx.scale(1, ry/rx);
                const g = ctx.createRadialGradient(0,0,0,0,0,rx*pulse);
                g.addColorStop(0,   `rgba(${b.r},${b.g},${b.b},${b.a*1.55})`);
                g.addColorStop(.5,  `rgba(${b.r},${b.g},${b.b},${b.a*.65})`);
                g.addColorStop(1,   `rgba(${b.r},${b.g},${b.b},0)`);
                ctx.beginPath(); ctx.arc(0,0,rx*pulse,0,Math.PI*2);
                ctx.fillStyle = g; ctx.fill(); ctx.restore();
            });
            raf = requestAnimationFrame(draw);
        }
        window.addEventListener('resize', resize, { passive:true });
        document.addEventListener('visibilitychange', () => {
            document.hidden ? cancelAnimationFrame(raf) : (raf = requestAnimationFrame(draw));
        });
        resize(); raf = requestAnimationFrame(draw);
    })();

    /* ── 4. STARS + SHOOTING STARS ───────────────────────── */
    (function initStars() {
        const canvas = $('#star-canvas');
        const ctx    = canvas.getContext('2d');
        let W, H, stars = [], shots = [], raf;
        const SPECIALS = 14;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            stars = Array.from({ length: 300 }, (_, i) => ({
                x: rand(0,W), y: rand(0,H),
                r: i < SPECIALS ? rand(1.2,2.3) : rand(0.15,1.05),
                base: rand(0.08,.7), speed: rand(.0006,.0035),
                phase: rand(0, Math.PI*2), special: i < SPECIALS,
            }));
        }
        function shoot() {
            if (document.hidden) return;
            const a = rand(18,42)*(Math.PI/180);
            shots.push({ x:rand(W*.04,W*.72), y:rand(H*.01,H*.32), vx:Math.cos(a)*rand(9,18), vy:Math.sin(a)*rand(9,18), life:1, len:rand(65,175) });
        }
        window._shootStar = () => { for (let i=0;i<4;i++) shoot(); };

        function drawCross(x,y,sz,alpha) {
            ctx.save(); ctx.globalAlpha=alpha*.5;
            ctx.strokeStyle=`rgba(220,235,255,${alpha})`; ctx.lineWidth=.55;
            ctx.beginPath(); ctx.moveTo(x-sz*3,y); ctx.lineTo(x+sz*3,y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x,y-sz*3); ctx.lineTo(x,y+sz*3); ctx.stroke();
            ctx.restore();
        }
        function draw(t) {
            ctx.clearRect(0,0,W,H);
            stars.forEach(s => {
                const tw = .5+.5*Math.sin(t*s.speed*1000+s.phase);
                const alpha = s.base*(.28+.72*tw);
                ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
                ctx.fillStyle=`rgba(220,235,255,${alpha})`; ctx.fill();
                if (s.special && tw>.72) drawCross(s.x,s.y,s.r,alpha*.55);
            });
            for (let i=shots.length-1;i>=0;i--) {
                const s=shots[i];
                const tx=s.x-s.vx*(s.len/14), ty=s.y-s.vy*(s.len/14);
                const g=ctx.createLinearGradient(s.x,s.y,tx,ty);
                g.addColorStop(0,`rgba(255,255,255,${s.life})`);
                g.addColorStop(.28,`rgba(232,201,106,${s.life*.5})`);
                g.addColorStop(1,'rgba(255,255,255,0)');
                ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(tx,ty);
                ctx.strokeStyle=g; ctx.lineWidth=1.4; ctx.stroke();
                ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2);
                ctx.fillStyle=`rgba(255,255,255,${s.life*.9})`; ctx.fill();
                s.x+=s.vx; s.y+=s.vy; s.life-=.02;
                if (s.life<=0) shots.splice(i,1);
            }
            raf = requestAnimationFrame(draw);
        }
        window.addEventListener('resize', resize, { passive:true });
        document.addEventListener('visibilitychange', () => {
            document.hidden ? cancelAnimationFrame(raf) : (raf = requestAnimationFrame(draw));
        });
        resize(); raf = requestAnimationFrame(draw);
        setInterval(() => { if (!document.hidden && Math.random()<.4) shoot(); }, 3500);
    })();

    /* ── 5. ORBIT MOON ───────────────────────────────────── */
    (function initOrbitMoon() {
        const moon = $('#orbit-moon'); if (!moon) return;
        let angle = -Math.PI/2;
        let W = window.innerWidth, H = window.innerHeight;
        window.addEventListener('resize', ()=>{ W=window.innerWidth; H=window.innerHeight; }, { passive:true });
        (function loop() {
            if (!document.hidden) {
                angle += 0.0034; // gentle, unhurried
                const rx = W*.43, ry = H*.37;
                const x = W*.5 + Math.cos(angle)*rx;
                const y = H*.5 + Math.sin(angle)*ry;
                const depth = .82 + .18*((Math.sin(angle)+1)/2);
                moon.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%)) scale(${depth})`;
            }
            requestAnimationFrame(loop);
        })();
    })();

    /* ── 6. DUST ─────────────────────────────────────────── */
    (function initDust() {
        const cont = $('#dust-container');
        function spawn() {
            if (document.hidden) return;
            const d = document.createElement('div');
            d.className = 'dust';
            const sz = rand(1.5,4.5), dur = rand(16,26);
            d.style.cssText = `left:${rand(0,100)}%;top:-${sz}px;width:${sz}px;height:${sz}px;animation-duration:${dur}s;`;
            cont.appendChild(d);
            setTimeout(() => d.remove(), dur*1000);
        }
        setInterval(spawn, 1900);
    })();

    /* ── 7. MUSIC VISUALIZER ─────────────────────────────── */
    let audioCtx=null, analyser=null, dataArray=null, vizActive=false;

    function setupAudio(audioEl) {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const src = audioCtx.createMediaElementSource(audioEl);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256; analyser.smoothingTimeConstant = .84;
            src.connect(analyser); analyser.connect(audioCtx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            vizActive = true;
            $('#viz-canvas').classList.add('active');
            $('#music-ring-canvas').classList.add('active');
        } catch(e) { console.warn('Web Audio unavailable'); }
    }

    (function initRingViz() {
        const rc = $('#music-ring-canvas'), ctx = rc.getContext('2d');
        const S = 110; rc.width = rc.height = S;
        (function draw() {
            requestAnimationFrame(draw); ctx.clearRect(0,0,S,S);
            if (!vizActive || !analyser) return;
            analyser.getByteFrequencyData(dataArray);
            const cx=S/2, cy=S/2, base=34, barMax=22, total=48;
            for (let i=0;i<total;i++) {
                const val = dataArray[Math.floor(i/total*dataArray.length*.55)]/255;
                const barH = val*barMax+1.5, angle = i/total*Math.PI*2-Math.PI/2;
                const x1=cx+Math.cos(angle)*base, y1=cy+Math.sin(angle)*base;
                const x2=cx+Math.cos(angle)*(base+barH), y2=cy+Math.sin(angle)*(base+barH);
                const alpha = .32+val*.68;
                const g=ctx.createLinearGradient(x1,y1,x2,y2);
                g.addColorStop(0,`rgba(232,201,106,${alpha*.7})`);
                g.addColorStop(1,`rgba(196,216,245,${alpha})`);
                ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
                ctx.strokeStyle=g; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.stroke();
            }
        })();
    })();

    (function initHorizonViz() {
        const canvas = $('#viz-canvas'), ctx = canvas.getContext('2d');
        let W = window.innerWidth; canvas.width=W; canvas.height=90;
        window.addEventListener('resize', ()=>{ W=window.innerWidth; canvas.width=W; }, { passive:true });
        let smooth = [];
        (function draw() {
            requestAnimationFrame(draw); ctx.clearRect(0,0,W,90);
            if (!vizActive || !analyser) return;
            analyser.getByteFrequencyData(dataArray);
            const bars=80, usable=Math.floor(dataArray.length*.6), barW=W/bars;
            if (smooth.length!==bars) smooth=new Array(bars).fill(0);
            for (let i=0;i<bars;i++) {
                const raw = dataArray[Math.floor(i/bars*usable)]/255;
                smooth[i] = lerp(smooth[i], raw, 0.12);
                const h=smooth[i]*76+1, x=i*barW, y=90-h;
                const g=ctx.createLinearGradient(x,90,x,y);
                g.addColorStop(0, `rgba(232,201,106,${.16+smooth[i]*.36})`);
                g.addColorStop(.6,`rgba(196,216,245,${.12+smooth[i]*.38})`);
                g.addColorStop(1, `rgba(196,216,245,${.05+smooth[i]*.26})`);
                ctx.fillStyle=g; ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x+1,y,barW-2,h,[2,2,0,0]);
                else ctx.rect(x+1,y,barW-2,h);
                ctx.fill();
            }
        })();
    })();

    /* ── 8. CURSOR ───────────────────────────────────────── */
    (function initCursor() {
        const cursor = $('.custom-cursor'); if (!cursor) return;
        let mx=-200, my=-200, cx=-200, cy=-200;

        document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });

        (function loop() {
            // Slower lerp = more butter
            cx = lerp(cx, mx, 0.1);
            cy = lerp(cy, my, 0.1);
            cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        })();

        $$('button, .gallery-item, #close-lightbox, .phase, .list-item, a').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
        document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; });
    })();

    /* ── 9. SCROLL PROGRESS ──────────────────────────────── */
    (function() {
        const bar = $('#scroll-progress');
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const pct = scrollHeight <= clientHeight ? 100 : scrollTop/(scrollHeight-clientHeight)*100;
            bar.style.width = clamp(pct,0,100) + '%';
        }, { passive:true });
    })();

    /* ── 10. WELCOME + AUDIO ─────────────────────────────── */
    (function initWelcome() {
        const screen = $('#welcome-screen');
        const enterBtn = $('#enter-btn');
        const music = $('#bg-music');
        const musicBtn = $('#music-btn');
        const musicIcon = $('#music-icon');
        const musicLbl  = $('#music-label');
        let playing = false;

        function fade(audio, to, ms) {
            const steps=30, stepMs=ms/steps, delta=(to-audio.volume)/steps;
            let n=0;
            const iv = setInterval(() => {
                audio.volume = clamp(audio.volume+delta, 0, 1);
                if (++n>=steps) { clearInterval(iv); if (to===0) audio.pause(); }
            }, stepMs);
        }

        enterBtn.addEventListener('click', () => {
            screen.classList.add('fade-out');
            setupAudio(music);
            music.volume = 0;
            music.play().then(() => {
                fade(music, 0.5, 3000); playing=true;
                musicIcon.textContent='⏸️';
                if (musicLbl) musicLbl.textContent='Pause';
            }).catch(()=>{});
        });

        musicBtn.addEventListener('click', () => {
            setupAudio(music);
            if (playing) {
                fade(music, 0, 1200);
                musicIcon.textContent='🎵';
                if (musicLbl) musicLbl.textContent='Our Song';
            } else {
                music.play().catch(()=>{});
                fade(music, 0.5, 1200);
                musicIcon.textContent='⏸️';
                if (musicLbl) musicLbl.textContent='Pause';
            }
            playing = !playing;
        });
    })();

    /* ── 11. CARD REVEAL ─────────────────────────────────── */
    (function initReveal() {
        function revealList(card) {
            $$('.list-item', card).forEach((item, i) => {
                setTimeout(() => item.classList.add('visible'), i*140 + 220);
            });
        }

        const allCards = $$('.tilt-card');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const idx = allCards.indexOf(entry.target);
                // gentle cascade — each card 40ms after the previous
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    if (entry.target.id === 'love-card')   revealList(entry.target);
                    if (entry.target.id === 'letter-card') setTimeout(startTypewriter, 900);
                }, 60 + idx*40);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

        allCards.forEach(c => obs.observe(c));
    })();

    /* ── 12. 3D TILT — smooth lerp, glides back ─────────── */
    (function initTilt() {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        $$('.tilt-card').forEach(card => {
            let rx=0, ry=0, tx=0, ty=0, inside=false;

            card.addEventListener('mouseenter', () => { inside=true; });
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                tx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -4.5;
                ty = ((e.clientX - r.left - r.width /2) / (r.width /2)) *  4.5;
            }, { passive:true });
            card.addEventListener('mouseleave', () => {
                inside=false; tx=0; ty=0;
            });

            (function loop() {
                rx = lerp(rx, tx, 0.08);  // 0.08 = very smooth glide
                ry = lerp(ry, ty, 0.08);
                const settled = Math.abs(rx)<0.02 && Math.abs(ry)<0.02 && !inside;
                card.style.transform = settled
                    ? ''  // hand control back to CSS once settled
                    : `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${inside?-6:0}px)`;
                requestAnimationFrame(loop);
            })();
        });
    })();

    /* ── 13. SVG BLOOM TREE ──────────────────────────────── */
    (function initBloom() {
        const treeSvg   = $('#tree-svg');
        const treeParts = $$('.tp', treeSvg);
        const fill      = $('#water-fill');
        const levelText = $('#water-count-text');
        const complText = $('#compliment-text');
        const btn       = $('#compliment-btn');
        const secret    = $('#secret-message');
        if (!btn) return;
        let count=0; const MAX=10;

        const compliments = [
            "You've always been more than enough — I hope you know that.",
            "There's no version of my day that doesn't get better when you're in it.",
            "The way you care about things is one of my favourite things about you.",
            "You have no idea how good it is talking to you. Like genuinely.",
            "You are, without question, the funniest person I know.",
            "Even the boring moments feel good with you in them.",
            "I'm really glad I get to know you. Like actually really glad.",
        ];

        function updateTree(n) {
            treeParts
                .filter(el => parseInt(el.dataset.s,10) <= n && !el.classList.contains('show'))
                .forEach((el, i) => setTimeout(() => el.classList.add('show'), i*55));
        }

        btn.addEventListener('click', () => {
            complText.style.opacity = '0';
            setTimeout(() => {
                complText.textContent = compliments[randInt(0, compliments.length-1)];
                complText.style.opacity = '1';
            }, 400);
            if (count >= MAX) return;
            count++;
            fill.style.width = (count/MAX*100) + '%';
            fill.classList.add('active');
            levelText.textContent = count < MAX
                ? `Moonlight Level  ${count} / ${MAX}`
                : 'The Moon Tree is in Full Bloom ✦ 🌕';
            updateTree(count);
            if (count===MAX) {
                treeSvg.classList.add('full-bloom');
                secret.classList.add('revealed');
                btn.disabled = true;
                if (window._shootStar) window._shootStar();
            }
        });
    })();

    /* ── 14. LIGHTBOX ────────────────────────────────────── */
    (function initLightbox() {
        const box      = $('#lightbox');
        const imgEl    = $('#lightbox-img');
        const caption  = $('#lightbox-caption');
        const backdrop = $('#lightbox-backdrop');
        const closeBtn = $('#close-lightbox');

        function open(src, cap) {
            imgEl.style.opacity='0'; imgEl.src='';
            if (caption) caption.textContent = cap||'';
            const pre = new Image();
            pre.onload = () => {
                imgEl.src = src;
                box.classList.add('open'); box.setAttribute('aria-hidden','false');
                document.body.style.overflow='hidden';
                requestAnimationFrame(()=>requestAnimationFrame(()=>{ imgEl.style.opacity='1'; }));
            };
            pre.onerror = () => {
                imgEl.src=src; box.classList.add('open'); box.setAttribute('aria-hidden','false');
                document.body.style.overflow='hidden'; imgEl.style.opacity='1';
            };
            pre.src = src;
        }

        function close() {
            box.classList.remove('open'); box.setAttribute('aria-hidden','true');
            document.body.style.overflow='';
            setTimeout(()=>{ imgEl.src=''; imgEl.style.opacity='0'; }, 550);
        }

        document.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                e.preventDefault(); e.stopPropagation();
                const img = item.querySelector('img'); if (!img) return;
                open(img.dataset.src||img.src, item.dataset.caption||img.alt||'');
                return;
            }
            const enl = e.target.closest('.enlargeable');
            if (enl && !enl.closest('.gallery-item')) {
                e.stopPropagation();
                open(enl.dataset.src||enl.src, enl.alt||'');
            }
        });

        backdrop.addEventListener('click', close);
        closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
        document.addEventListener('keydown', e => {
            if (e.key==='Escape' && box.classList.contains('open')) close();
        });
        box.addEventListener('wheel', e => e.stopPropagation(), { passive:false });
    })();

    /* ── 15. TYPEWRITER ──────────────────────────────────── */
    let typingDone = false;
    function startTypewriter() {
        if (typingDone) return; typingDone=true;
        const lines = [
            { id:'line-1',   text:'Dear Moon,' },
            { id:'line-2',   text:"I made this for you because I wanted you to have something real — not a text, not a voice note. Something you can come back to. Something that just says: I see you, and I think you're incredible." },
            { id:'line-3',   text:"You make things feel lighter just by being around. That's not nothing. That's actually everything." },
            { id:'line-sig', text:'— Water ❤️' },
        ];
        let li=0, ci=0;
        function tick() {
            if (li>=lines.length) return;
            const el=document.getElementById(lines[li].id), text=lines[li].text;
            if (!el.classList.contains('typing-cursor')) el.classList.add('typing-cursor');
            if (ci<text.length) {
                el.textContent+=text[ci++]; setTimeout(tick, 33);
            } else {
                el.classList.remove('typing-cursor'); li++; ci=0;
                setTimeout(tick, li<lines.length ? 520 : 0);
            }
        }
        tick();
    }

    /* ── 16. CLICK SPARKS ────────────────────────────────── */
    (function initSparks() {
        const syms = ['✦','✶','·','⋆','˚','🌙','°','*'];
        const cols = ['#e8c96a','#c4d8f5','#a0b8e8','#f0dfa0','#b0cce8'];
        document.addEventListener('click', e => {
            if (e.target.closest('button')||e.target.closest('.gallery-item')) return;
            const f = document.createDocumentFragment();
            for (let i=0;i<8;i++) {
                const el = document.createElement('div');
                el.className='click-spark';
                el.textContent=syms[randInt(0,syms.length-1)];
                el.style.color=cols[randInt(0,cols.length-1)];
                el.style.fontSize=rand(.6,1.15)+'rem';
                const angle=rand(0,Math.PI*2), vel=rand(28,72);
                el.style.setProperty('--tx', Math.cos(angle)*vel+'px');
                el.style.setProperty('--ty', Math.sin(angle)*vel-24+'px');
                el.style.setProperty('--rot', rand(-70,70)+'deg');
                el.style.left=e.clientX+'px'; el.style.top=e.clientY+'px';
                f.appendChild(el); setTimeout(()=>el.remove(), 1000);
            }
            document.body.appendChild(f);
        }, { passive:true });
    })();

    /* ── 17. MARRIAGE CERTIFICATE ────────────────────────── */
    (function initMarriageCert() {
        const signBtn     = $('#cert-sign-btn');
        const sigMoonName = $('#sig-moon-name');
        const moonSigLine = $('#moon-sig-line');
        const seal        = $('#cert-seal');
        const prompt      = $('#cert-prompt');
        const signedNote  = $('#cert-signed-note');
        const dlWrap      = $('#cert-download-wrap');
        if (!signBtn) return;

        const msgs = [
            "It's official. Legally binding under moonlight. 🌙",
            "Signed, sealed, and witnessed by every star up there. ✦",
            "You said yes. Water is keeping this forever. 💍",
            "The moon herself has signed. That's final.",
        ];

        signBtn.addEventListener('click', () => {
            if (signBtn.disabled) return; signBtn.disabled=true;
            const name='Moon ♡'; sigMoonName.textContent='';
            sigMoonName.classList.add('signed'); moonSigLine.classList.add('signed');
            let i=0;
            function typeSig() {
                if (i<name.length) { sigMoonName.textContent+=name[i++]; setTimeout(typeSig, 82); }
                else {
                    setTimeout(()=>{ seal.classList.add('stamped'); if (window._shootStar) window._shootStar(); spawnConfettiBurst(50); }, 320);
                    setTimeout(()=>{ signedNote.textContent=msgs[randInt(0,msgs.length-1)]; signedNote.classList.add('visible'); prompt.style.opacity='0'; signBtn.style.display='none'; }, 650);
                    setTimeout(()=>{ dlWrap.style.display='block'; }, 1500);
                }
            }
            typeSig();
        });
    })();

})();
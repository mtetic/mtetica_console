// --- CARTUCCIA 011: SPACCAPIANETI ---

window.UGOConsole.registerCartridge({
    id: 11,
    titolo: "11. Spaccapianeti",
    colore: "#06b6d4",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        // ===================== COMPATIBILITÀ: pezzi di CSS con i prefissi per i browser vecchi =====================
        const FLEX = "display:-webkit-flex;display:flex;";
        const COL = "-webkit-flex-direction:column;flex-direction:column;";
        const ROW = "-webkit-flex-direction:row;flex-direction:row;";
        const REV = "-webkit-flex-direction:row-reverse;flex-direction:row-reverse;";
        const CEN = "-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;";
        const BETW = "-webkit-justify-content:space-between;justify-content:space-between;-webkit-align-items:center;align-items:center;";
        const fl = function(v) { return "-webkit-flex:" + v + ";flex:" + v + ";"; };

        slot.innerHTML = `
            <div id="sp-container">
                <div id="sp-field">
                    <canvas id="sp-canvas"></canvas>
                    <div id="sp-hud">
                        <div id="sp-score">PUNTI: 0</div>
                        <div id="sp-btns">
                            <button type="button" id="sp-snd" aria-label="Suoni">&#128266;</button>
                            <button type="button" id="sp-swap" aria-label="Inverti i comandi">&#8644;</button>
                        </div>
                        <div id="sp-speed">VELOCITÀ: 1.0x</div>
                    </div>
                </div>

                <!-- Comandi: sparo da una parte, frecce dall'altra (si possono scambiare con il tasto in alto) -->
                <div id="sp-bar">
                    <div id="sp-fire" class="sp-btn">SPARA</div>
                    <div id="sp-dir">
                        <div id="sp-left" class="sp-btn sp-red">&#8592;</div>
                        <div id="sp-right" class="sp-btn sp-red">&#8594;</div>
                    </div>
                </div>

                <div id="sp-start" class="sp-overlay">
                    <h2>SPACCAPIANETI</h2>
                    <div class="sp-info">
                        <p><b>Spara</b> ai pianeti per romperli: ogni <b>tocco</b> è un colpo (tenere premuto non spara di continuo).</p>
                        <p><b>Composti:</b> 2 colpi. &nbsp;<b>Primi:</b> 4 colpi. Raccogli le stelle per 2 punti.</p>
                        <p>Fai punti, conquista il pianeta <b>1</b>, la <b>luce</b> e <b>Saturno</b>: vite extra e armi potenziate!</p>
                        <p class="sp-small"><b>Comandi:</b> frecce &larr; &rarr; e <b>X</b> o <b>SPAZIO</b> da tastiera. Sul telefono: i due tasti rossi si possono scorrere con il dito senza sollevarlo. Il tasto in alto &#8644; scambia di lato i comandi.</p>
                    </div>
                    <button type="button" class="btn-start" id="sp-go">GIOCA</button>
                </div>

                <div id="sp-over" class="sp-overlay sp-hide">
                    <h1>PARTITA FINITA</h1>
                    <p id="sp-final">Punti totalizzati: 0</p>
                    <button type="button" class="btn-start" id="sp-again">Gioca ancora</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-11');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-11';
        styleCart.innerHTML = `
            /* Contenitore ancorato ai 4 lati dello slot: altezza sempre definita, anche sui browser vecchi */
            #sp-container { position: absolute; top: 0; right: 0; bottom: 0; left: 0; ${FLEX}${COL} background: #050510; color: #fff; overflow: hidden;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
            .sp-hide { display: none !important; }

            #sp-field { ${fl("1 1 0px")} min-height: 0; position: relative; background: #000005; overflow: hidden; }
            #sp-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; background: #000005; }

            #sp-hud { position: absolute; top: 8px; left: 10px; right: 10px; ${FLEX}${BETW} font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                pointer-events: none; z-index: 5; font-size: 2.6vh; font-size: clamp(0.8rem, 2.8vh, 1.15rem); }
            #sp-score { color: #00ffcc; white-space: nowrap; }
            #sp-speed { color: #ffcc00; white-space: nowrap; }
            #sp-btns { ${FLEX}${CEN} pointer-events: auto; }
            #sp-btns button { background: rgba(51,65,85,0.85); border: 1px solid #64748b; color: #fff; border-radius: 10px; width: 40px; height: 34px;
                margin: 0 3px; font-size: 1.05rem; cursor: pointer; padding: 0; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
            #sp-btns button:active { background: rgba(100,116,139,0.95); }

            /* Barra dei comandi: tasti grandi. L'ordine si inverte con la classe sp-swap */
            #sp-bar { ${fl("0 0 auto")} ${FLEX}${ROW} height: 17vh; min-height: 92px; max-height: 160px; background: #111827; border-top: 2px solid #334466;
                padding: 6px 4px; box-sizing: border-box; padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px)); }
            #sp-bar.sp-swap { ${REV} }
            .sp-btn { ${FLEX}${CEN} border-radius: 16px; color: #fff; font-weight: bold; text-align: center; cursor: pointer;
                -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; touch-action: none; -webkit-tap-highlight-color: transparent;
                box-shadow: 0 3px rgba(0,0,0,0.45); box-sizing: border-box; }
            #sp-fire { ${fl("1 1 0px")} margin: 0 4px; background: #16a34a; border: 2px solid rgba(255,255,255,0.2); font-size: 4.2vh; font-size: clamp(1.2rem, 4.6vh, 2rem); letter-spacing: 2px; }
            #sp-dir { ${fl("1.35 1 0px")} ${FLEX}${ROW} margin: 0 4px; touch-action: none; }
            #sp-left, #sp-right { ${fl("1 1 0px")} margin: 0 4px; font-size: 6vh; font-size: clamp(1.6rem, 7vh, 3rem); }
            #sp-left { margin-left: 0; }
            #sp-right { margin-right: 0; }
            .sp-red { background: #dc2626; }
            .sp-btn.on { background: #fbbf24; color: #1f2937; box-shadow: inset 0 0 22px rgba(255,255,255,0.6); }
            #sp-fire.on { background: #4ade80; color: #052e16; }

            .sp-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 20; ${FLEX}${COL}${CEN}
                padding: 16px; box-sizing: border-box; text-align: center; overflow-y: auto; }
            .sp-overlay > * { margin-top: 6px; margin-bottom: 6px; }
            .sp-overlay h2 { color: #00ffcc; margin: 0; text-shadow: 0 0 10px rgba(0,255,204,0.5); font-size: 5vh; font-size: clamp(1.6rem, 5.5vh, 2.4rem); }
            .sp-overlay h1 { color: #ff3333; margin: 0; text-shadow: 0 0 10px rgba(255,0,0,0.5); font-size: 5.5vh; font-size: clamp(1.8rem, 6vh, 2.8rem); }
            .sp-overlay p { color: #e2e8f0; line-height: 1.45; margin-top: 4px; margin-bottom: 4px; font-size: 2.5vh; font-size: clamp(0.88rem, 2.6vh, 1.15rem); }
            .sp-info { max-width: 440px; }
            .sp-overlay p.sp-small { color: #94a3b8; font-size: 2.2vh; font-size: clamp(0.78rem, 2.2vh, 1rem); }
            .sp-overlay .btn-start { background: #0891b2; box-shadow: 0 4px #155e75; }

            /* Schermo largo e basso (telefono in orizzontale): barra più bassa */
            @media (orientation: landscape) and (max-height: 520px) {
                #sp-bar { height: 24vh; min-height: 62px; }
                #sp-fire { font-size: 1.1rem; }
                #sp-left, #sp-right { font-size: 1.6rem; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== UTILITÀ =====================
        function el(id) { return document.getElementById(id); }
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

        const canvas = el('sp-canvas');
        const field = el('sp-field');
        const ctx = canvas.getContext('2d');

        // ===================== COSTANTI DI GIOCO =====================
        const PLANET_PALETTES = [
            { fill: '#9a4e32', border: '#66301d', band: '#b56345' }, { fill: '#a66b38', border: '#6e4522', band: '#c2824a' },
            { fill: '#6c7a89', border: '#434d57', band: '#8796a6' }, { fill: '#8c7a5b', border: '#594d38', band: '#a69270' },
            { fill: '#5f7358', border: '#3c4a37', band: '#768c6e' }, { fill: '#7a5c68', border: '#4d3840', band: '#947380' },
            { fill: '#545c6e', border: '#333845', band: '#6c768c' }
        ];
        const RAINBOW = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];

        const HITS_COMPOSTO = [2, 1];   // [arma normale, arma potenziata]
        const HITS_PRIMO = [4, 2];
        const BOSS_HITS = 5;            // colpi per conquistare 1, luce e Saturno
        const FIRE_INTERVAL_MS = 140;   // ritmo dello sparo continuo (solo dopo Saturno)
        const MIN_SHOT_GAP_MS = 55;     // impedisce due colpi "fantasma" nello stesso istante
        const MILESTONES = [
            { score: 250, type: 'one', done: false },
            { score: 800, type: 'light', done: false },
            { score: 1500, type: 'saturn', done: false }
        ];
        const LH_MIN = 380, LH_MAX = 600; // altezza "logica" del campo: i pianeti cadono alla stessa velocità su ogni schermo

        function isPrime(n) { if (n <= 1) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
        const PRIMES = [], COMPOSITES = [];
        for (let n = 2; n <= 100; n++) { if (isPrime(n)) PRIMES.push(n); else COMPOSITES.push(n); }
        function fattori(n) {
            const f = [];
            let d = 2;
            while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; if (d * d > n && n > 1) { f.push(n); break; } }
            return f;
        }

        // ===================== STATO =====================
        let LW = 450, LH = 600, SC = 1, DPR = 1;   // larghezza/altezza logiche, scala, densità pixel
        let score = 0, extraLives = 0, invulnerableUntil = 0;
        let baseSpeed = 2, speedMultiplier = 1, savedSpeed = 1;
        let running = false;                        // partita in corso
        let weaponUpgraded = false;                 // dopo il pianeta 1: colpi più potenti
        let autoFire = false;                       // dopo Saturno: sparo continuo
        let lastShotTime = -9999;
        let asteroidTimer = 0, starTimer = 0, compositesSincePrime = 0;
        let eventQueue = [], centerBoss = null;
        let stars = [], bullets = [], asteroids = [], particles = [], bonusStars = [], textParts = [];
        let banner = null;                          // messaggio temporaneo al centro
        let suoniOn = true;
        let swapped = !!window.__spSwap;            // comandi invertiti (si ricorda finché la pagina è aperta)
        let lastFrame = nowMs(), raf = null, lastSpeedTxt = "";
        const player = { x: 205, y: 538, width: 40, height: 45, speed: 6 };

        // ===================== AUDIO =====================
        let audioCtx = null, musicTimer = null, musicStep = 0;
        const tensionBass = [55, 55, 65.41, 55, 61.74, 55, 51.91, 55];
        const tensionLead = [220, 0, 261.63, 246.94, 220, 0, 196, 207.65];
        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function tono(freq, t0, dur, tipo, vol, freqFine) {
            if (!suoniOn || !audioCtx) return;
            try {
                const t = audioCtx.currentTime + t0;
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = tipo;
                o.frequency.setValueAtTime(freq, t);
                if (freqFine) o.frequency.exponentialRampToValueAtTime(freqFine, t + dur);
                g.gain.setValueAtTime(vol, t);
                g.gain.exponentialRampToValueAtTime(0.004, t + dur);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(t); o.stop(t + dur + 0.02);
            } catch (e) {}
        }
        function sLaser() { tono(weaponUpgraded ? 980 : 760, 0, 0.11, weaponUpgraded ? 'square' : 'sawtooth', 0.08, weaponUpgraded ? 240 : 170); }
        function sColpo() { tono(210, 0, 0.08, 'square', 0.07, 110); }
        function sEsplosione(grande) { tono(grande ? 160 : 190, 0, grande ? 0.5 : 0.32, grande ? 'sawtooth' : 'triangle', grande ? 0.22 : 0.16, 36); }
        function sPotere() { [330, 440, 554.37, 659.25, 880].forEach(function(f, i) { tono(f, i * 0.07, 0.16, 'triangle', 0.11); }); }
        function sVitaPersa() { [440, 330, 220].forEach(function(f, i) { tono(f, i * 0.09, 0.15, 'sawtooth', 0.13); }); }
        function sMoneta() { tono(987.77, 0, 0.1, 'sine', 0.09); tono(1318.51, 0.07, 0.12, 'sine', 0.09); }
        function sFine() { [220, 196, 174.61, 146.83, 110].forEach(function(f, i) { tono(f, i * 0.15, 0.2, 'sawtooth', 0.14); }); }
        function fermaMusica() { if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; } }
        function avviaMusica() {
            fermaMusica();
            const passo = function() {
                if (!alive || !running) return;
                if (audioCtx && audioCtx.state === 'running' && suoniOn) {
                    tono(tensionBass[musicStep % 8], 0, 0.22, 'triangle', 0.065);
                    const lead = tensionLead[musicStep % 8];
                    if (lead > 0) tono(lead, 0, 0.26, 'sine', 0.032);
                    musicStep++;
                }
                musicTimer = setTimeout(passo, Math.max(155, 250 - (speedMultiplier - 1) * 35));
            };
            passo();
        }

        // ===================== DIMENSIONI DEL CAMPO =====================
        function misura() {
            const cw = field.clientWidth, ch = field.clientHeight;
            if (!cw || !ch) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const lh = clamp(ch * 1.25, LH_MIN, LH_MAX);
            const sc = ch / lh;
            const lw = cw / sc;
            const pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
            if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
            const fx = lw / LW, fy = lh / LH;
            if (Math.abs(fx - 1) > 0.0001 || Math.abs(fy - 1) > 0.0001) {
                const adatta = function(a) { a.forEach(function(o) { o.x *= fx; o.y *= fy; }); };
                adatta(stars); adatta(bullets); adatta(asteroids); adatta(particles); adatta(bonusStars); adatta(textParts);
                if (centerBoss) {
                    centerBoss.x *= fx; centerBoss.y *= fy; centerBoss.targetY *= fy;
                }
            }
            LW = lw; LH = lh; SC = sc; DPR = dpr;
            player.x = clamp(player.x * fx, 0, LW - player.width);
            player.y = LH - 62;
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < 60; i++) stars.push({ x: Math.random() * LW, y: Math.random() * LH, size: Math.random() * 2 + 0.5, speed: Math.random() * 0.5 + 0.5 });
        }

        // ===================== PUNTEGGIO ED EVENTI =====================
        function aggiornaHud(forza) {
            el('sp-score').textContent = "PUNTI: " + score;
            const s = speedMultiplier.toFixed(1);
            if (forza || s !== lastSpeedTxt) {
                lastSpeedTxt = s;
                el('sp-speed').textContent = "VELOCITÀ: " + s + "x";
                if (window.UGOConsole && window.UGOConsole.setTimer) window.UGOConsole.setTimer(s + "x");
            }
            if (window.UGOConsole && window.UGOConsole.setScore) window.UGOConsole.setScore(score);
        }
        function addScore(p) {
            score += p;
            for (let i = 0; i < MILESTONES.length; i++) {
                if (!MILESTONES[i].done && score >= MILESTONES[i].score) { MILESTONES[i].done = true; eventQueue.push(MILESTONES[i].type); }
            }
            aggiornaHud(false);
        }
        function mostraBanner(testo) { banner = { text: testo, until: nowMs() + 3200, born: nowMs() }; }

        function creaBoss(tipo) {
            asteroids = [];
            bonusStars = [];          // le stelle spariscono: durante l'evento non si può fare punti con quelle
            savedSpeed = speedMultiplier;
            speedMultiplier = 0.5;
            aggiornaHud(true);
            const size = Math.min(LW * 0.32, tipo === 'one' ? 112 : 124);
            centerBoss = { type: tipo, x: LW / 2 - size / 2, y: -size - 20, size: size, targetY: LH / 2 - size / 2, vy: 1.8, settled: false, hits: 0 };
        }

        function esplosioneArcobaleno(cx, cy, luce) {
            for (let i = 0; i < 48; i++) {
                const a = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.25;
                const v = Math.random() * 6 + 2.5;
                particles.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, radius: Math.random() * 4.5 + 2, alpha: 1.2,
                    color: luce ? (i % 2 === 0 ? '#fef08a' : '#ffffff') : RAINBOW[i % RAINBOW.length], text: null });
            }
        }

        function conquistaBoss() {
            if (!centerBoss) return;
            const tipo = centerBoss.type;
            const cx = centerBoss.x + centerBoss.size / 2, cy = centerBoss.y + centerBoss.size / 2;
            centerBoss = null;
            extraLives += 1;
            speedMultiplier = savedSpeed;
            aggiornaHud(true);
            if (tipo === 'one') {
                weaponUpgraded = true;
                esplosioneArcobaleno(cx, cy, false);
                mostraBanner("VITA EXTRA! SPARO POTENZIATO");
            } else if (tipo === 'light') {
                esplosioneArcobaleno(cx, cy, true);
                mostraBanner("VITA EXTRA!");
            } else {
                autoFire = true;
                esplosioneArcobaleno(cx, cy, false);
                mostraBanner("SATURNO! VITA EXTRA E SPARO CONTINUO");
            }
            sEsplosione(true);
            sPotere();
        }

        // ===================== OGGETTI =====================
        function esplosione(x, y, colore, n, numeri) {
            for (let i = 0; i < n; i++) {
                particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, radius: Math.random() * 3 + 1, alpha: 1,
                    color: colore, text: numeri ? String(rnd(0, 99)) : null });
            }
        }
        function testoFattori(x, y, valore) {
            fattori(valore).forEach(function(f) {
                textParts.push({ x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20, vx: (Math.random() - 0.5) * 4, vy: -(Math.random() * 3 + 1),
                    text: String(f), color: '#00ffcc', alpha: 1, scale: Math.random() * 0.4 + 0.8 });
            });
        }
        function testoPrimo(x, y, valore) {
            textParts.push({ x: x, y: y, vx: 0, vy: -2.2, text: "PRIMO " + valore + "! +10", color: '#fbbf24', alpha: 1, scale: 1.0 });
        }

        function creaAsteroide() {
            const size = Math.random() * 18 + 36;
            const primo = Math.random() < 0.40 || compositesSincePrime >= 3;
            let valore;
            if (primo) { valore = PRIMES[rnd(0, PRIMES.length - 1)]; compositesSincePrime = 0; }
            else { valore = COMPOSITES[rnd(0, COMPOSITES.length - 1)]; compositesSincePrime++; }
            asteroids.push({ x: Math.random() * Math.max(10, LW - size), y: -size, size: size, value: valore, isPrime: isPrime(valore),
                palette: PLANET_PALETTES[rnd(0, PLANET_PALETTES.length - 1)], hits: 0, flash: 0 });
        }
        function creaStella() {
            bonusStars.push({ x: Math.random() * Math.max(20, LW - 24) + 12, y: -20, size: 16, speed: Math.random() * 1 + 1.5 });
        }
        function colpiNecessari(ast) { return (ast.isPrime ? HITS_PRIMO : HITS_COMPOSTO)[weaponUpgraded ? 1 : 0]; }

        // ===================== SPARO =====================
        function spara(t) {
            bullets.push({ x: player.x + player.width / 2 - (weaponUpgraded ? 4 : 3), y: player.y, width: weaponUpgraded ? 8 : 6,
                height: weaponUpgraded ? 18 : 15, speed: weaponUpgraded ? 10.5 : 9 });
            lastShotTime = t;
            sLaser();
        }
        // Un tocco = un colpo. Tenendo premuto non si spara di continuo (a meno di aver conquistato Saturno).
        function provaSparo() {
            if (!running) return;
            const t = nowMs();
            if (t - lastShotTime < MIN_SHOT_GAP_MS) return;
            spara(t);
        }

        // ===================== AGGIORNAMENTO =====================
        let dirTouch = 0;                         // -1 sinistra, 0 fermo, +1 destra (dal tocco o dal mouse)
        const keysHeld = {};
        let fireTouchHeld = false, fireMouseHeld = false;
        function fireHeld() { return !!(keysHeld['x'] || keysHeld[' '] || fireTouchHeld || fireMouseHeld); }

        function update(t, dt) {
            const k = dt / 16.667;                // 1 = un frame a 60 Hz: la velocità è uguale a 30, 60 o 120 Hz
            stars.forEach(function(s) {
                s.y += s.speed * baseSpeed * speedMultiplier * k;
                if (s.y > LH) { s.y = 0; s.x = Math.random() * LW; }
            });

            if (running) {
                if (!centerBoss) { speedMultiplier += 0.03 * dt / 1000; aggiornaHud(false); }

                let dir = dirTouch;
                if (keysHeld['arrowleft'] || keysHeld['a']) dir = -1;
                if (keysHeld['arrowright'] || keysHeld['d']) dir = 1;
                if (dir < 0 && player.x > 0) player.x = Math.max(0, player.x - player.speed * k);
                if (dir > 0 && player.x < LW - player.width) player.x = Math.min(LW - player.width, player.x + player.speed * k);

                // sparo continuo solo dopo aver conquistato Saturno
                if (autoFire && fireHeld() && t - lastShotTime >= FIRE_INTERVAL_MS) spara(t);

                // proiettili
                for (let b = bullets.length - 1; b >= 0; b--) {
                    const bu = bullets[b];
                    bu.y -= bu.speed * k;
                    if (bu.y + bu.height < 0) { bullets.splice(b, 1); continue; }

                    // stelle bonus
                    let usato = false;
                    for (let s = bonusStars.length - 1; s >= 0; s--) {
                        const st = bonusStars[s];
                        if (bu.x < st.x + st.size / 2 && bu.x + bu.width > st.x - st.size / 2 && bu.y < st.y + st.size / 2 && bu.y + bu.height > st.y - st.size / 2) {
                            bullets.splice(b, 1); bonusStars.splice(s, 1);
                            esplosione(st.x, st.y, '#ffee55', 12); sMoneta(); addScore(2);
                            usato = true; break;
                        }
                    }
                    if (usato) continue;

                    // pianeta al centro (1, luce, Saturno)
                    if (centerBoss && centerBoss.settled &&
                        bu.x < centerBoss.x + centerBoss.size && bu.x + bu.width > centerBoss.x &&
                        bu.y < centerBoss.y + centerBoss.size && bu.y + bu.height > centerBoss.y) {
                        bullets.splice(b, 1);
                        centerBoss.hits++;
                        esplosione(bu.x, bu.y, '#ffffff', 5);
                        sColpo();
                        if (centerBoss.hits >= BOSS_HITS) conquistaBoss();
                        continue;
                    }

                    // pianeti: colpisce quello più in basso tra quelli sovrapposti
                    let bersaglio = -1;
                    for (let a = 0; a < asteroids.length; a++) {
                        const as = asteroids[a];
                        if (bu.x < as.x + as.size && bu.x + bu.width > as.x && bu.y < as.y + as.size && bu.y + bu.height > as.y) {
                            if (bersaglio < 0 || as.y > asteroids[bersaglio].y) bersaglio = a;
                        }
                    }
                    if (bersaglio >= 0) {
                        const as = asteroids[bersaglio];
                        bullets.splice(b, 1);
                        as.hits++;
                        as.flash = 110;
                        if (as.hits >= colpiNecessari(as)) {
                            const cx = as.x + as.size / 2, cy = as.y + as.size / 2;
                            if (as.isPrime) {
                                esplosione(cx, cy, '#fbbf24', 28);
                                testoPrimo(cx, cy, as.value);
                                sEsplosione(true);
                                addScore(10);
                            } else {
                                esplosione(cx, cy, as.palette.band, 20);
                                testoFattori(cx, cy, as.value);
                                sEsplosione(false);
                                addScore(5);
                            }
                            asteroids.splice(bersaglio, 1);
                        } else {
                            esplosione(bu.x, bu.y, as.isPrime ? '#e2e8f0' : '#fbbf24', 7);
                            sColpo();
                        }
                    }
                }

                // stelle bonus: nascono solo se non c'è un evento in corso o in arrivo
                if (!centerBoss && eventQueue.length === 0) {
                    starTimer += dt;
                    if (starTimer > 1333) { creaStella(); starTimer = 0; }
                }
                for (let s = bonusStars.length - 1; s >= 0; s--) {
                    const st = bonusStars[s];
                    st.y += st.speed * speedMultiplier * k;
                    if (player.x < st.x + st.size / 2 && player.x + player.width > st.x - st.size / 2 && player.y < st.y + st.size / 2 && player.y + player.height > st.y - st.size / 2) {
                        bonusStars.splice(s, 1); sMoneta(); addScore(2); continue;
                    }
                    if (st.y > LH) bonusStars.splice(s, 1);
                }

                if (centerBoss) {
                    if (!centerBoss.settled) {
                        centerBoss.y += centerBoss.vy * k;
                        if (centerBoss.y >= centerBoss.targetY) { centerBoss.y = centerBoss.targetY; centerBoss.settled = true; }
                    }
                    // toccarlo con l'astronave lo conquista
                    if (centerBoss && player.x < centerBoss.x + centerBoss.size && player.x + player.width > centerBoss.x &&
                        player.y < centerBoss.y + centerBoss.size && player.y + player.height > centerBoss.y) conquistaBoss();
                } else {
                    asteroidTimer += dt;
                    const intervallo = Math.max(22, 68 - Math.floor(speedMultiplier * 12)) * 16.667;
                    if (asteroidTimer > intervallo) { creaAsteroide(); asteroidTimer = 0; }

                    for (let a = asteroids.length - 1; a >= 0; a--) {
                        const as = asteroids[a];
                        as.y += baseSpeed * speedMultiplier * 0.8 * k;
                        if (as.flash > 0) as.flash -= dt;
                        if (as.y > LH) { asteroids.splice(a, 1); continue; }
                        if (player.x < as.x + as.size && player.x + player.width > as.x && player.y < as.y + as.size && player.y + player.height > as.y) {
                            if (t < invulnerableUntil) continue;
                            if (extraLives > 0) {
                                extraLives -= 1;
                                invulnerableUntil = t + 1600;
                                esplosione(as.x + as.size / 2, as.y + as.size / 2, '#38bdf8', 25);
                                asteroids.splice(a, 1);
                                sVitaPersa();
                                continue;
                            }
                            esplosione(player.x + player.width / 2, player.y + player.height / 2, '#ff4400', 35, true);
                            esplosione(as.x + as.size / 2, as.y + as.size / 2, as.palette.fill, 15);
                            fermaMusica();
                            sFine();
                            fineGioco();
                            break;
                        }
                    }
                }

                // evento in coda: parte fuori dai cicli di collisione
                if (running && !centerBoss && eventQueue.length > 0) creaBoss(eventQueue.shift());
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx * k; p.y += p.vy * k; p.alpha -= 0.015 * k;
                if (p.alpha <= 0) particles.splice(i, 1);
            }
            for (let i = textParts.length - 1; i >= 0; i--) {
                const p = textParts[i];
                p.x += p.vx * k; p.y += p.vy * k; p.alpha -= 0.012 * k;
                if (p.alpha <= 0) textParts.splice(i, 1);
            }
        }

        // ===================== DISEGNO =====================
        function disegnaNavicellaVita(x, y) {
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.moveTo(x + 9, y); ctx.lineTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(x + 1, y + 15, 3, 5); ctx.fillRect(x + 14, y + 15, 3, 5);
            ctx.restore();
        }

        // Saturno con l'anello (senza usare ellipse(), per i browser vecchi)
        function disegnaSaturno(cx, cy, r, t) {
            const anello = function(meta) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(-0.32);
                ctx.scale(1, 0.3);
                ctx.lineCap = 'butt';
                ctx.strokeStyle = '#d9b77a'; ctx.lineWidth = r * 0.30;
                ctx.beginPath(); ctx.arc(0, 0, r * 1.75, meta ? Math.PI : 0, meta ? Math.PI * 2 : Math.PI); ctx.stroke();
                ctx.strokeStyle = '#f1d9a0'; ctx.lineWidth = r * 0.16;
                ctx.beginPath(); ctx.arc(0, 0, r * 1.45, meta ? Math.PI : 0, meta ? Math.PI * 2 : Math.PI); ctx.stroke();
                ctx.restore();
            };
            anello(true);                                       // metà posteriore dell'anello
            ctx.save();
            const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
            g.addColorStop(0, '#fff1c1'); g.addColorStop(0.6, '#e3b865'); g.addColorStop(1, '#a8762f');
            ctx.shadowBlur = 22; ctx.shadowColor = '#f5c76b';
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();   // fasce del pianeta
            ctx.fillStyle = 'rgba(140,90,30,0.25)';
            ctx.fillRect(cx - r, cy - r * 0.45, r * 2, r * 0.16);
            ctx.fillRect(cx - r, cy + r * 0.05, r * 2, r * 0.2);
            ctx.fillRect(cx - r, cy + r * 0.5, r * 2, r * 0.12);
            ctx.restore();
            anello(false);                                      // metà anteriore dell'anello
        }

        function disegnaBoss(t) {
            if (!centerBoss) return;
            const cx = centerBoss.x + centerBoss.size / 2, cy = centerBoss.y + centerBoss.size / 2;
            const baseR = centerBoss.size / 2;
            const r = baseR * (1 + Math.sin(t * 0.01) * 0.07);
            ctx.save();
            if (centerBoss.type === 'one') {
                const ci = Math.floor(t / 130) % RAINBOW.length;
                const pulse = RAINBOW[ci], accent = RAINBOW[(ci + 1) % RAINBOW.length];
                ctx.fillStyle = pulse; ctx.strokeStyle = accent; ctx.lineWidth = 5; ctx.shadowBlur = 24; ctx.shadowColor = pulse;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold ' + Math.round(centerBoss.size * 0.52) + 'px Arial';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('1', cx, cy + 2);
                ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 14px Arial';
                ctx.fillText('il padre di tutti i numeri', cx, centerBoss.y - 32);
                ctx.fillText('non è né primo né composto', cx, centerBoss.y - 14);
            } else if (centerBoss.type === 'light') {
                const ga = 0.72 + Math.sin(t * 0.012) * 0.25;
                const gr = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.15);
                gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#fef08a'); gr.addColorStop(0.85, '#f59e0b'); gr.addColorStop(1, 'rgba(254,240,138,0)');
                ctx.globalAlpha = ga; ctx.fillStyle = gr;
                ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#fffbeb'; ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 4; ctx.shadowBlur = 28; ctx.shadowColor = '#fef08a';
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                disegnaSaturno(cx, cy, r * 0.72, t);
                ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('Saturno: vita extra e sparo continuo', cx, centerBoss.y - 24);
            }
            if (centerBoss.settled && centerBoss.hits > 0) {     // anello di avanzamento: un pezzo per ogni colpo
                const ratio = Math.min(1, centerBoss.hits / BOSS_HITS);
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
                ctx.beginPath(); ctx.arc(cx, cy, baseR * (centerBoss.type === 'saturn' ? 1.9 : 1) + 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio); ctx.stroke();
            }
            ctx.restore();
        }

        function disegna() {
            const t = nowMs();
            ctx.setTransform(DPR * SC, 0, 0, DPR * SC, 0, 0);
            ctx.fillStyle = '#01010d';
            ctx.fillRect(0, 0, LW, LH);

            ctx.fillStyle = '#ffffff';
            stars.forEach(function(s) { ctx.globalAlpha = s.size / 2; ctx.fillRect(s.x, s.y, s.size, s.size); });
            ctx.globalAlpha = 1;

            bonusStars.forEach(function(s) {
                ctx.save();
                ctx.fillStyle = '#ffee55'; ctx.shadowBlur = 10; ctx.shadowColor = '#ffcc00';
                ctx.beginPath();
                ctx.moveTo(s.x, s.y - s.size / 2); ctx.lineTo(s.x + s.size / 5, s.y - s.size / 5); ctx.lineTo(s.x + s.size / 2, s.y);
                ctx.lineTo(s.x + s.size / 5, s.y + s.size / 5); ctx.lineTo(s.x, s.y + s.size / 2); ctx.lineTo(s.x - s.size / 5, s.y + s.size / 5);
                ctx.lineTo(s.x - s.size / 2, s.y); ctx.lineTo(s.x - s.size / 5, s.y - s.size / 5);
                ctx.closePath(); ctx.fill();
                ctx.restore();
            });

            bullets.forEach(function(b) {
                ctx.save();
                ctx.fillStyle = weaponUpgraded ? '#38bdf8' : '#00ffff';
                if (weaponUpgraded) { ctx.shadowBlur = 8; ctx.shadowColor = '#38bdf8'; }
                ctx.fillRect(b.x, b.y, b.width, b.height);
                ctx.restore();
            });

            if (running) {
                const lampeggia = t < invulnerableUntil && Math.floor(t / 90) % 2 === 0;
                if (!lampeggia) {
                    ctx.fillStyle = weaponUpgraded ? '#38bdf8' : '#0099ff';
                    ctx.beginPath();
                    ctx.moveTo(player.x + player.width / 2, player.y); ctx.lineTo(player.x, player.y + player.height); ctx.lineTo(player.x + player.width, player.y + player.height);
                    ctx.closePath(); ctx.fill();
                    ctx.fillStyle = '#00ffcc';
                    ctx.fillRect(player.x + 2, player.y + player.height - 10, 6, 10);
                    ctx.fillRect(player.x + player.width - 8, player.y + player.height - 10, 6, 10);
                    ctx.fillStyle = Math.random() > 0.5 ? '#ff3300' : '#ff9900';
                    ctx.fillRect(player.x + player.width / 2 - 4, player.y + player.height, 8, Math.random() * 8 + 4);
                }
            }

            disegnaBoss(t);

            asteroids.forEach(function(as) {
                const cx = as.x + as.size / 2, cy = as.y + as.size / 2, r = as.size / 2;
                const necessari = colpiNecessari(as);
                ctx.save();
                ctx.fillStyle = as.palette.fill; ctx.strokeStyle = as.palette.border; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.strokeStyle = as.palette.band; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(cx, cy, r * 0.68, -0.5, 1.3); ctx.stroke();

                if (as.flash > 0) {                       // lampo quando viene colpito
                    ctx.globalAlpha = Math.min(0.6, as.flash / 110 * 0.6);
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
                    ctx.globalAlpha = 1;
                }
                if (!as.isPrime && as.hits > 0 && necessari > 1) {   // crepa sui composti colpiti
                    ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.moveTo(cx - r * 0.45, cy - r * 0.35); ctx.lineTo(cx - r * 0.05, cy); ctx.lineTo(cx + r * 0.35, cy - r * 0.15); ctx.stroke();
                }
                if (as.isPrime && as.hits > 0) {                      // anello dorato: un pezzo per ogni colpo
                    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.arc(cx, cy, r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, as.hits / necessari)); ctx.stroke();
                }
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold ' + Math.floor(as.size * 0.44) + 'px Arial';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
                ctx.fillText(as.value, cx, cy);
                ctx.restore();
            });

            textParts.forEach(function(p) {
                ctx.save();
                ctx.globalAlpha = Math.min(1, p.alpha);
                ctx.fillStyle = p.color || '#00ffcc';
                ctx.font = 'bold ' + Math.floor(20 * p.scale) + 'px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(p.text, p.x, p.y);
                ctx.restore();
            });
            particles.forEach(function(p) {
                ctx.save();
                ctx.globalAlpha = Math.min(1, p.alpha);
                if (p.text) { ctx.fillStyle = '#ff5533'; ctx.font = 'bold 16px Arial'; ctx.fillText(p.text, p.x, p.y); }
                else { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); }
                ctx.restore();
            });

            if (banner) {
                if (t > banner.until) banner = null;
                else {
                    ctx.save();
                    const rest = banner.until - t, vita = t - banner.born;
                    ctx.globalAlpha = Math.min(1, rest / 600, vita / 250);
                    ctx.fillStyle = '#fef08a';
                    ctx.font = 'bold ' + clamp(Math.round(LW * 0.05), 16, 26) + 'px Arial';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 6;
                    ctx.fillText(banner.text, LW / 2, LH * 0.2);
                    ctx.restore();
                }
            }

            if (running && extraLives > 0) {
                for (let i = 0; i < extraLives; i++) disegnaNavicellaVita(12 + i * 24, LH - 28);
            }
        }

        // ===================== PARTITA =====================
        function azzeraPartita() {
            misura();
            initStars();
            score = 0; extraLives = 0; invulnerableUntil = 0; baseSpeed = 2; speedMultiplier = 1; savedSpeed = 1;
            weaponUpgraded = false; autoFire = false;
            bullets = []; asteroids = []; particles = []; bonusStars = []; textParts = [];
            compositesSincePrime = 0; asteroidTimer = 0; starTimer = 0; lastShotTime = -9999;
            eventQueue = []; centerBoss = null; banner = null;
            MILESTONES.forEach(function(m) { m.done = false; });
            dirTouch = 0; fireTouchHeld = false; fireMouseHeld = false;
            Object.keys(keysHeld).forEach(function(k) { keysHeld[k] = false; });
            evidenziaTasti();
            player.x = LW / 2 - player.width / 2;
            player.y = LH - 62;
            aggiornaHud(true);
        }

        function iniziaPartita() {
            initAudio();
            azzeraPartita();
            nascondi('sp-start'); nascondi('sp-over');
            running = true;
            lastFrame = nowMs();
            musicStep = 0;
            avviaMusica();
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Spaccapianeti");
                if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Velocità");
            }
        }

        function fineGioco() {
            running = false;
            fermaMusica();
            dirTouch = 0; fireTouchHeld = false; fireMouseHeld = false;
            evidenziaTasti();
            el('sp-final').textContent = "Punti totalizzati: " + score;
            mostra('sp-over');
        }
        function mostra(id) { el(id).classList.remove('sp-hide'); }
        function nascondi(id) { el(id).classList.add('sp-hide'); }

        function ciclo(ts) {
            if (!alive) return;
            const t = ts || nowMs();
            const dt = clamp(t - lastFrame, 0, 50);
            lastFrame = t;
            update(t, dt);
            disegna();
            raf = requestAnimationFrame(ciclo);
        }

        // ===================== COMANDI =====================
        function evidenziaTasti() {
            el('sp-left').classList.toggle('on', dirTouch < 0);
            el('sp-right').classList.toggle('on', dirTouch > 0);
            el('sp-fire').classList.toggle('on', fireTouchHeld || fireMouseHeld);
        }
        function setDir(d) {
            if (d === dirTouch) return;
            dirTouch = d;
            evidenziaTasti();
        }
        // La direzione dipende dalla posizione del dito nella zona delle frecce: si può passare da un tasto all'altro senza sollevarlo
        function dirDaX(x) {
            const r = el('sp-dir').getBoundingClientRect();
            return x < r.left + r.width / 2 ? -1 : 1;
        }
        function trovaTocco(lista, id) {
            for (let i = 0; i < lista.length; i++) if (lista[i].identifier === id) return lista[i];
            return null;
        }

        let dirId = null, fireId = null, dirMouse = false;

        const zonaDir = el('sp-dir'), tastoFire = el('sp-fire');
        zonaDir.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (!running || dirId !== null) return;
            const t = e.changedTouches[0];
            dirId = t.identifier;
            setDir(dirDaX(t.clientX));
        }, { passive: false });
        tastoFire.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (!running || fireId !== null) return;
            const t = e.changedTouches[0];
            fireId = t.identifier;
            fireTouchHeld = true;
            evidenziaTasti();
            provaSparo();
        }, { passive: false });
        const onTouchMove = function(e) {
            if (dirId !== null) {
                const t = trovaTocco(e.changedTouches, dirId);
                if (t) { e.preventDefault(); setDir(dirDaX(t.clientX)); }
            }
        };
        const onTouchEnd = function(e) {
            if (dirId !== null && trovaTocco(e.changedTouches, dirId)) { dirId = null; setDir(0); }
            if (fireId !== null && trovaTocco(e.changedTouches, fireId)) { fireId = null; fireTouchHeld = false; evidenziaTasti(); }
        };
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchEnd);

        // mouse (PC)
        zonaDir.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (!running) return;
            dirMouse = true;
            setDir(dirDaX(e.clientX));
        });
        tastoFire.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (!running) return;
            fireMouseHeld = true;
            evidenziaTasti();
            provaSparo();
        });
        const onMouseMove = function(e) { if (dirMouse) setDir(dirDaX(e.clientX)); };
        const onMouseUp = function() {
            if (dirMouse) { dirMouse = false; setDir(0); }
            if (fireMouseHeld) { fireMouseHeld = false; evidenziaTasti(); }
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // tastiera: un tasto premuto = un colpo (la ripetizione automatica del tasto viene ignorata)
        const onKeyDown = function(e) {
            if (!alive || !running) return;
            const k = String(e.key).toLowerCase();
            const spazio = (k === ' ' || k === 'spacebar');
            if (k === 'arrowleft' || k === 'arrowright' || k === 'arrowup' || k === 'arrowdown' || spazio) e.preventDefault();
            if (e.repeat) return;
            const nome = spazio ? ' ' : k;
            keysHeld[nome] = true;
            if (nome === 'x' || nome === ' ') provaSparo();
        };
        const onKeyUp = function(e) {
            const k = String(e.key).toLowerCase();
            keysHeld[(k === 'spacebar') ? ' ' : k] = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        // niente menu contestuale (tocco lungo) sui comandi
        el('sp-bar').addEventListener('contextmenu', function(e) { e.preventDefault(); });

        // scambio dei comandi
        function applicaSwap() {
            const b = el('sp-bar');
            if (swapped) b.classList.add('sp-swap'); else b.classList.remove('sp-swap');
        }
        el('sp-swap').addEventListener('click', function() {
            swapped = !swapped;
            window.__spSwap = swapped;
            applicaSwap();
            misura();
        });
        el('sp-snd').addEventListener('click', function() {
            suoniOn = !suoniOn;
            this.innerHTML = suoniOn ? '&#128266;' : '&#128263;';
            if (suoniOn) initAudio();
        });
        el('sp-go').addEventListener('click', iniziaPartita);
        el('sp-again').addEventListener('click', iniziaPartita);

        const onResize = function() { misura(); };
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        let osservatore = null;
        if (window.ResizeObserver) { osservatore = new ResizeObserver(function() { misura(); }); osservatore.observe(field); }

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                running = false;
                fermaMusica();
                if (raf) cancelAnimationFrame(raf);
                if (osservatore) osservatore.disconnect();
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
                window.removeEventListener('touchcancel', onTouchEnd);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('keyup', onKeyUp);
                window.removeEventListener('resize', onResize);
                window.removeEventListener('orientationchange', onResize);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-11');
                if (st) st.remove();
            });
        }

        applicaSwap();
        misura();
        initStars();
        player.x = LW / 2 - player.width / 2;
        aggiornaHud(true);
        if (window.UGOConsole) {
            window.UGOConsole.setTitle("Spaccapianeti");
            if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Velocità");
        }
        raf = requestAnimationFrame(ciclo);
        // __TEST_HOOK__
    }
});

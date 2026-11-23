// --- CARTUCCIA: SOMME ALGEBRICHE ---

window.UGOConsole.registerCartridge({
    id: 13,
    titolo: "Somme algebriche",
    colore: "#0284c7",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        const DURATA = 60;
        const NOMI_LIVELLO = {
            easy: "Principiante",
            medium: "Intermedio",
            hard: "Esperto"
        };

        // ===================== COMPATIBILITÀ: pezzi di CSS con i prefissi per i browser vecchi =====================
        const FLEX = "display:-webkit-flex;display:flex;";
        const COL = "-webkit-flex-direction:column;flex-direction:column;";
        const ROW = "-webkit-flex-direction:row;flex-direction:row;";
        const CEN = "-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;";
        const BETW = "-webkit-justify-content:space-between;justify-content:space-between;-webkit-align-items:center;align-items:center;";
        const fl = function(v) { return "-webkit-flex:" + v + ";flex:" + v + ";"; };

        slot.innerHTML = `
            <div id="sa-root">
                <div id="sa-container">
                    <div class="sa-hud">
                        <div>Tempo: <span id="sa-timer" class="sa-t">60</span>s</div>
                        <div>Livello: <span id="sa-liv" class="sa-v">--</span></div>
                        <div>Punti: <span id="sa-score" class="sa-s">0</span></div>
                    </div>

                    <div id="sa-main">
                        <div id="sa-exp"><span id="sa-expin"></span></div>

                        <!-- Tastierino a righe flex (compatibile con i browser vecchi, niente grid né gap) -->
                        <div id="sa-keys">
                            <div class="sa-row">
                                <button type="button" class="sa-btn" data-k="7">7</button>
                                <button type="button" class="sa-btn" data-k="8">8</button>
                                <button type="button" class="sa-btn" data-k="9">9</button>
                                <button type="button" class="sa-btn sa-op" data-k="+">+</button>
                            </div>
                            <div class="sa-row">
                                <button type="button" class="sa-btn" data-k="4">4</button>
                                <button type="button" class="sa-btn" data-k="5">5</button>
                                <button type="button" class="sa-btn" data-k="6">6</button>
                                <button type="button" class="sa-btn sa-op" data-k="-">−</button>
                            </div>
                            <div class="sa-row">
                                <button type="button" class="sa-btn" data-k="1">1</button>
                                <button type="button" class="sa-btn" data-k="2">2</button>
                                <button type="button" class="sa-btn" data-k="3">3</button>
                                <button type="button" class="sa-btn sa-del" data-k="C">C</button>
                            </div>
                            <div class="sa-row">
                                <button type="button" class="sa-btn sa-wide" data-k="0">0</button>
                                <button type="button" class="sa-btn sa-act sa-wide" data-k="OK">INVIA ↵</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sa-start" class="sa-overlay">
                    <h2>Somme algebriche</h2>
                    <p>Scegli il livello di difficoltà per iniziare la sfida di <b>60 secondi</b>:</p>
                    <button type="button" class="sa-lv sa-lv-easy" data-lv="easy"><b>Principiante (±20)</b><span>Somme algebriche con numeri fino a 20</span></button>
                    <button type="button" class="sa-lv sa-lv-med" data-lv="medium"><b>Intermedio (±20 + incognita)</b><span>Manca anche il primo o il secondo termine</span></button>
                    <button type="button" class="sa-lv sa-lv-hard" data-lv="hard"><b>Esperto (±100 + errore −1)</b><span>Numeri fino a 100 e penalità di 1 punto sugli errori</span></button>
                </div>

                <div id="sa-end" class="sa-overlay sa-hide">
                    <h1 class="sa-end-title">Tempo Scaduto!</h1>
                    <p>Punteggio Finale: <strong id="sa-final" class="sa-final-num">0</strong></p>

                    <div id="sa-errsec" class="sa-hide">
                        <p class="sa-err-cap">Errori da rivedere:</p>
                        <div class="sa-errors" id="sa-errlist"></div>
                    </div>

                    <button type="button" class="btn-start sa-retry" id="sa-again">Cambia Livello / Rigioca</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-13');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-13';
        styleCart.innerHTML = `
            #sa-root {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                background: #09090b; color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                -webkit-user-select: none; user-select: none; -webkit-touch-callout: none;
            }
            .sa-hide { display: none !important; }

            #sa-container {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                ${FLEX}${COL}
                box-sizing: border-box; overflow: hidden;
                padding: 8px 8px 14px 8px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
            }

            /* Tempo, livello e punti qui dentro servono solo in tutto schermo: in modalità normale li mostra già la console */
            .sa-hud {
                ${fl("0 0 auto")}
                width: 100%; max-width: 900px; margin: 0 auto 8px auto; box-sizing: border-box;
                ${FLEX}${BETW}
                background: #18181b; border: 1px solid #3f3f46;
                border-radius: 10px; padding: 6px 14px; font-weight: bold;
                font-size: 2.8vh;
                font-size: clamp(0.85rem, 3vh, 1.2rem);
            }
            body:not(.is-fullscreen) .sa-hud { display: none; }
            .sa-t { color: #f87171; }
            .sa-v { color: #38bdf8; }
            .sa-s { color: #4ade80; }

            #sa-main {
                ${fl("1 1 0px")}
                min-height: 0; width: 100%; max-width: 900px; margin: 0 auto;
                ${FLEX}${COL}
            }
            #sa-exp {
                ${fl("1 1 0px")}
                min-height: 0; margin-bottom: 8px;
                background: #18181b; border: 2px solid #3f3f46; border-radius: 14px;
                ${FLEX}${CEN}
                font-weight: bold; letter-spacing: 1px;
                white-space: nowrap; overflow: hidden; padding: 0 10px; box-sizing: border-box; color: #f4f4f5;
                font-size: 5.5vh;
                font-size: clamp(1.5rem, 6vh, 2.6rem);
            }
            .sa-hole {
                display: inline-block; min-width: 1.4em;
                border-bottom: 4px solid #38bdf8; color: #38bdf8;
                text-align: center; padding: 0 4px; line-height: 1.15;
            }

            #sa-keys {
                ${fl("1.6 1 0px")}
                min-height: 0; width: 100%; max-width: 520px; margin: 0 auto;
                ${FLEX}${COL}
                font-size: 3.8vh;
                font-size: clamp(1.1rem, 4vh, 1.7rem);
            }
            .sa-row {
                ${fl("1 1 0px")}
                min-height: 0; margin-bottom: 8px;
                ${FLEX}${ROW}
            }
            .sa-row:last-child { margin-bottom: 0; }
            .sa-btn {
                ${fl("1 1 0px")}
                min-width: 0; padding: 0; margin: 0 8px 0 0;
                background: #27272a; color: #ffffff; border: 1px solid #3f3f46; border-radius: 12px;
                font: inherit; font-weight: bold; line-height: 1; cursor: pointer;
                touch-action: manipulation; -webkit-tap-highlight-color: transparent;
                ${FLEX}${CEN}
                overflow: hidden;
            }
            .sa-btn:last-child { margin-right: 0; }
            .sa-btn:active { background: #3f3f46; }
            .sa-wide { ${fl("2 1 0px")} }
            .sa-op { background: #1e3a8a; color: #93c5fd; border-color: #1d4ed8; }
            .sa-op:active { background: #1d4ed8; }
            .sa-act { background: #15803d; color: #bbf7d0; border-color: #16a34a; }
            .sa-act:active { background: #16a34a; }
            .sa-del { background: #991b1b; color: #fecaca; border-color: #dc2626; }
            .sa-del:active { background: #b91c1c; }

            .sa-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(9, 9, 11, 0.96);
                ${FLEX}${COL}${CEN}
                padding: 14px; box-sizing: border-box; text-align: center; z-index: 10; overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            .sa-overlay h2 {
                margin: 5px 0; color: #38bdf8; letter-spacing: 0.5px;
                font-size: 5vh;
                font-size: clamp(1.5rem, 5.5vh, 2.3rem);
            }
            .sa-end-title {
                margin: 5px 0; color: #f87171;
                font-size: 4.6vh;
                font-size: clamp(1.4rem, 5vh, 2rem);
            }
            .sa-overlay p {
                margin: 5px 0; color: #a1a1aa; max-width: 460px; line-height: 1.45;
                font-size: 2.5vh;
                font-size: clamp(0.9rem, 2.7vh, 1.15rem);
            }
            .sa-final-num { font-size: 1.45rem; color: #4ade80; }
            .sa-lv {
                width: 100%; max-width: 420px; margin: 6px 0;
                border: none; border-radius: 12px; padding: 12px 16px; color: #fff; cursor: pointer;
                ${FLEX}${COL}
                box-shadow: 0 4px rgba(0, 0, 0, 0.45);
                touch-action: manipulation; -webkit-tap-highlight-color: transparent;
            }
            .sa-lv b { font-size: 1.15rem; }
            .sa-lv span { margin-top: 2px; font-size: 0.85rem; opacity: 0.92; }
            .sa-lv:active { transform: translateY(2px); box-shadow: none; }
            .sa-lv-easy { background: #16a34a; }
            .sa-lv-med { background: #d97706; }
            .sa-lv-hard { background: #dc2626; }

            #sa-errsec { width: 100%; max-width: 520px; }
            .sa-err-cap { font-size: 0.88rem; color: #a1a1aa; margin: 6px 0 4px 0; text-align: left; }
            .sa-errors {
                width: 100%; max-height: 32vh; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: #18181b; border: 1px solid #3f3f46; border-radius: 10px;
                padding: 6px 12px; box-sizing: border-box; text-align: left;
            }
            .sa-err {
                font-size: 0.95rem; padding: 6px 0; border-bottom: 1px solid #27272a;
                ${FLEX}${BETW}
            }
            .sa-err > span:first-child { margin-right: 10px; }
            .sa-err:last-child { border-bottom: none; }
            .sa-wrong { color: #f87171; font-weight: bold; margin-right: 6px; }
            .sa-lab { color: #a1a1aa; font-size: 0.85rem; margin-right: 4px; }
            .sa-right { color: #4ade80; font-weight: bold; }
            .sa-overlay .btn-start.sa-retry {
                background: #0284c7; box-shadow: 0 4px #075985;
                margin-top: 10px; padding: 12px 26px; font-size: 1.05rem;
            }

            /* Schermo più largo che alto (telefono in orizzontale, PC, lavagna): operazione a sinistra, tastierino a destra */
            @media (orientation: landscape) {
                #sa-main { ${ROW} }
                #sa-exp { ${fl("1 1 0px")} margin-bottom: 0; margin-right: 8px; }
                #sa-keys { ${fl("1 1 0px")} max-width: none; margin: 0; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== UTILITÀ =====================
        function el(id) { return document.getElementById(id); }
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function mostra(id) { el(id).classList.remove('sa-hide'); }
        function nascondi(id) { el(id).classList.add('sa-hide'); }

        // ===================== AUDIO =====================
        let audioCtx = null;
        function initAudio() {
            if (!audioCtx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) audioCtx = new Ctx();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(function() {});
            }
        }
        function playSuccessSound() {
            initAudio();
            if (!audioCtx) return;
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(987.77, now);
                osc.frequency.setValueAtTime(1318.51, now + 0.08);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
            } catch (e) {}
        }
        function playErrorSound() {
            initAudio();
            if (!audioCtx) return;
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(130, now);
                osc.frequency.setValueAtTime(110, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.3);
            } catch (e) {}
        }

        // ===================== STATO =====================
        let score = 0;
        let timeLeft = DURATA;
        let timerInterval = null;
        let currentProblem = null;
        let playerInput = "";
        let mistakes = [];
        let currentLevel = 'easy';
        let giocoAttivo = false;
        const timeouts = [];

        function schedule(fn, ms) {
            timeouts.push(setTimeout(function() { if (alive) fn(); }, ms));
        }

        function aggiornaConsole() {
            if (!window.UGOConsole) return;
            window.UGOConsole.setTitle(giocoAttivo ? "Somme algebriche · " + NOMI_LIVELLO[currentLevel] : "Somme algebriche");
            window.UGOConsole.setScore(score);
            if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Tempo");
            window.UGOConsole.setTimer(Math.max(0, timeLeft) + "s");
        }

        function adattaTasti() {
            const k = el('sa-keys');
            if (!k) return;
            const r = k.getBoundingClientRect();
            if (!r.height || !r.width) return;
            const keyH = (r.height - 24) / 4;
            const keyW = (r.width - 24) / 4;
            const f = Math.max(12, Math.min(34, keyH * 0.5, keyW * 0.5));
            k.style.fontSize = f.toFixed(1) + "px";
        }

        function adattaOperazione() {
            const box = el('sa-exp');
            const inner = el('sa-expin');
            if (!box || !inner) return;
            box.style.fontSize = "";
            const fs = parseFloat(window.getComputedStyle(box).fontSize) || 32;
            const disp = box.clientWidth - 20;
            const w = inner.scrollWidth;
            if (w > disp && disp > 0) {
                box.style.fontSize = Math.max(14, fs * disp / w).toFixed(1) + "px";
            }
        }

        function formatSigned(num) {
            return num >= 0 ? "+" + num : String(num);
        }

        function renderProblem() {
            if (!currentProblem) return;
            const p = currentProblem;
            const displayVal = playerInput !== "" ? playerInput : "?";
            const holeHtml = '<span class="sa-hole">' + displayVal + '</span>';

            const str1 = p.holeType === 1 ? holeHtml : formatSigned(p.num1);
            const str2 = p.holeType === 2 ? holeHtml : formatSigned(p.num2);
            const strRes = p.holeType === 0 ? holeHtml : formatSigned(p.res);

            el('sa-expin').innerHTML = str1 + str2 + " = " + strRes;
            adattaOperazione();
        }

        function nextProblem() {
            playerInput = "";
            const maxRange = (currentLevel === 'hard') ? 100 : 20;
            let num1 = 0, num2 = 0, res = 0;

            do {
                num1 = rnd(-maxRange, maxRange);
                num2 = rnd(-maxRange, maxRange);
                res = num1 + num2;
            } while (res < -maxRange || res > maxRange || num1 === 0 || num2 === 0);

            // 0: Risultato, 1: Primo termine, 2: Secondo termine
            let holeType = 0;
            if (currentLevel === 'medium' || currentLevel === 'hard') {
                if (Math.random() >= 0.5) {
                    holeType = Math.random() < 0.5 ? 1 : 2;
                }
            }

            currentProblem = { num1: num1, num2: num2, res: res, holeType: holeType };
            renderProblem();
        }

        // ===================== FLUSSO =====================
        function startGame() {
            initAudio();
            score = 0;
            timeLeft = DURATA;
            mistakes = [];
            giocoAttivo = true;

            el('sa-liv').textContent = NOMI_LIVELLO[currentLevel];
            el('sa-score').textContent = score;
            el('sa-timer').textContent = timeLeft;
            nascondi('sa-start');
            nascondi('sa-end');
            aggiornaConsole();
            nextProblem();
            adattaTasti();
            schedule(adattaTasti, 80);
            schedule(adattaTasti, 400);

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                if (!alive || !giocoAttivo) return;
                timeLeft--;
                el('sa-timer').textContent = Math.max(0, timeLeft);
                aggiornaConsole();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    endGame();
                }
            }, 1000);
        }

        function selectLevel(lvl) {
            if (!NOMI_LIVELLO[lvl]) return;
            currentLevel = lvl;
            startGame();
        }

        function showStartScreen() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            giocoAttivo = false;
            nascondi('sa-end');
            mostra('sa-start');
            aggiornaConsole();
        }

        function endGame() {
            giocoAttivo = false;
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            aggiornaConsole();
            el('sa-final').textContent = score;

            const errorsList = el('sa-errlist');
            errorsList.innerHTML = '';
            if (mistakes.length > 0) {
                mostra('sa-errsec');
                mistakes.forEach(function(item) {
                    const div = document.createElement('div');
                    div.className = 'sa-err';
                    div.innerHTML = '<span>' + item.text + '</span>' +
                        '<span><span class="sa-wrong">' + item.userAns + '</span>' +
                        '<span class="sa-lab">giusto:</span>' +
                        '<span class="sa-right">' + item.correctAns + '</span></span>';
                    errorsList.appendChild(div);
                });
            } else {
                nascondi('sa-errsec');
            }
            mostra('sa-end');
        }

        // ===================== INPUT =====================
        function inputChar(char) {
            if (!giocoAttivo || !currentProblem || playerInput.length >= 5) return;
            initAudio();
            if (char === '+' || char === '-') {
                if (playerInput === "" || playerInput === "+" || playerInput === "-") {
                    playerInput = char;
                }
            } else if (/^[0-9]$/.test(char)) {
                playerInput += char;
            }
            renderProblem();
        }

        function clearInput() {
            if (!giocoAttivo) return;
            playerInput = "";
            renderProblem();
        }

        function submitAnswer() {
            if (!giocoAttivo || !currentProblem) return;
            if (playerInput === "" || playerInput === "+" || playerInput === "-") return;

            const p = currentProblem;
            let expectedVal = 0;
            if (p.holeType === 0) expectedVal = p.res;
            if (p.holeType === 1) expectedVal = p.num1;
            if (p.holeType === 2) expectedVal = p.num2;

            const userNum = parseInt(playerInput, 10);
            let isCorrect = false;

            if (userNum === expectedVal) {
                if (p.holeType === 2) {
                    // SECONDO TERMINE: il segno (+ o -) è sempre obbligatorio
                    if (playerInput.charAt(0) === '+' || playerInput.charAt(0) === '-') {
                        isCorrect = true;
                    }
                } else {
                    // PRIMO TERMINE O RISULTATO: meno obbligatorio se negativo, più opzionale se positivo
                    if (expectedVal < 0) {
                        if (playerInput.charAt(0) === '-') isCorrect = true;
                    } else {
                        isCorrect = true;
                    }
                }
            }

            if (isCorrect) {
                score += 1;
                playSuccessSound();
            } else {
                if (currentLevel === 'hard') {
                    score -= 1;
                }
                playErrorSound();

                const str1 = (p.holeType === 1) ? '...' : formatSigned(p.num1);
                const str2 = (p.holeType === 2) ? '...' : formatSigned(p.num2);
                const strRes = (p.holeType === 0) ? '...' : formatSigned(p.res);
                const correctFormatted = (p.holeType === 2 || expectedVal > 0) ? formatSigned(expectedVal) : String(expectedVal);

                mistakes.push({
                    text: str1 + str2 + "=" + strRes,
                    userAns: playerInput,
                    correctAns: correctFormatted
                });
            }

            el('sa-score').textContent = score;
            aggiornaConsole();
            nextProblem();
        }

        function trovaBottone(target) {
            let n = target;
            while (n && n !== slot) {
                if (n.tagName && n.tagName.toLowerCase() === 'button') return n;
                n = n.parentNode;
            }
            return null;
        }

        el('sa-keys').addEventListener('click', function(e) {
            const b = trovaBottone(e.target);
            if (!b) return;
            const k = b.getAttribute('data-k');
            if (k === 'OK') submitAnswer();
            else if (k === 'C') clearInput();
            else if (k !== null) inputChar(k);
        });

        el('sa-start').addEventListener('click', function(e) {
            const b = trovaBottone(e.target);
            if (!b) return;
            const lv = b.getAttribute('data-lv');
            if (lv) selectLevel(lv);
        });

        el('sa-again').addEventListener('click', showStartScreen);

        const aggiusta = function() {
            if (!alive) return;
            adattaTasti();
            adattaOperazione();
        };
        window.addEventListener('resize', aggiusta);
        window.addEventListener('orientationchange', aggiusta);

        if (window.__saKeyHandler) window.removeEventListener('keydown', window.__saKeyHandler);
        window.__saKeyHandler = function(e) {
            if (!alive || !giocoAttivo || !el('sa-container')) return;
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            const k = e.key;
            if (k >= '0' && k <= '9' && k.length === 1) { inputChar(k); e.preventDefault(); }
            else if (k === '+' || k === '-') { inputChar(k); e.preventDefault(); }
            else if (k === 'Enter') { submitAnswer(); e.preventDefault(); }
            else if (k === 'Backspace' || k === 'Delete' || k === 'c' || k === 'C') { clearInput(); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__saKeyHandler);

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole && window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoAttivo = false;
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                timeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('keydown', window.__saKeyHandler);
                window.removeEventListener('resize', aggiusta);
                window.removeEventListener('orientationchange', aggiusta);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-13');
                if (st) st.remove();
            });
        }

        aggiornaConsole();
        // __TEST_HOOK__
    }
});
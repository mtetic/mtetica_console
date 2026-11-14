// --- CARTUCCIA 002: CIRCA-CERCHIO ---

window.UGOConsole.registerCartridge({
    id: 2,
    titolo: "2. Circa-Cerchio",
    colore: "#d97706",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');

        slot.innerHTML = `
            <div id="game-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 15px; position: relative; transition: background-color 0.3s ease, border-color 0.3s ease; border: 8px solid transparent; box-sizing: border-box;">
                <!-- Header STATS -->
                <div class="header" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 10px 15px; border-radius: 12px;">
                    <div class="stat-box" style="text-align: center;">
                        <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #aaa;">Tempo</div>
                        <div class="stat-value" id="timer" style="font-size: 1.6rem; font-weight: 800;">90</div>
                    </div>
                    <div class="pi-banner" style="text-align: center; background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.5px;">π ≈ 3</div>
                    <div class="stat-box" style="text-align: center;">
                        <div class="stat-label" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #aaa;">Punti</div>
                        <div class="stat-value" id="score" style="font-size: 1.6rem; font-weight: 800;">0</div>
                    </div>
                </div>

                <!-- Domanda e Input -->
                <div class="question-container" style="text-align: center; margin: 10px 0; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div id="badge-type" class="badge">--</div>
                    <div id="question-text" class="question-text">Premi Inizia!</div>
                    <div id="answer-display" class="answer-display">_</div>
                </div>

                <!-- Tastierino Virtuale -->
                <div class="keypad">
                    <button class="key" onclick="pressKey('1')">1</button>
                    <button class="key" onclick="pressKey('2')">2</button>
                    <button class="key" onclick="pressKey('3')">3</button>
                    <button class="key" onclick="pressKey('4')">4</button>
                    <button class="key" onclick="pressKey('5')">5</button>
                    <button class="key" onclick="pressKey('6')">6</button>
                    <button class="key" onclick="pressKey('7')">7</button>
                    <button class="key" onclick="pressKey('8')">8</button>
                    <button class="key" onclick="pressKey('9')">9</button>
                    <button class="key key-del" onclick="pressKey('DEL')">←</button>
                    <button class="key" onclick="pressKey('0')">0</button>
                    <button class="key key-enter" onclick="pressKey('ENTER')">INVIO</button>
                </div>
            </div>

            <!-- Schermata Iniziale -->
            <div id="start-overlay" class="overlay">
                <h1>Circa-Cerchio</h1>
                <p>Calcola le misure del cerchio usando <b>π ≈ 3</b>.<br><br>
                🟢 Diretta: +1 pt<br>
                🟠 Inversa: +2 pt<br>
                🔴 MOSTRO: +4 pt<br><br>
                Hai <b>90 secondi</b>!</p>
                <button class="btn-start" id="btn-start-game">INIZIA GIOCO</button>
            </div>

            <!-- Schermata Finale -->
            <div id="end-overlay" class="overlay hidden">
                <h1>Tempo Scaduto!</h1>
                <p>Punteggio Finale:</p>
                <div id="final-score" style="font-size: 4rem; font-weight: 800; color: #2ea44f; margin-bottom: 20px;">0</div>
                <button class="btn-start" id="btn-restart-game">GIOCA ANCORA</button>
            </div>
        `;

        if (!document.getElementById('style-cartuccia-2')) {
            const styleCart = document.createElement('style');
            styleCart.id = 'style-cartuccia-2';
            styleCart.innerHTML = `
                .state-diretta {
                    background-color: #0d2b1a !important;
                    border-color: #2ea44f !important;
                }
                .state-inversa {
                    background-color: #3b2005 !important;
                    border-color: #d97706 !important;
                }
                .state-mostro {
                    background-color: #3a080c !important;
                    border-color: #dc2626 !important;
                    animation: pulse-red 0.8s infinite alternate;
                }
                @keyframes pulse-red {
                    0% { border-color: #dc2626; box-shadow: inset 0 0 15px #dc2626; }
                    100% { border-color: #991b1b; box-shadow: inset 0 0 35px #991b1b; }
                }

                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: bold;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                }
                .badge-diretta { background: #2ea44f; color: #fff; }
                .badge-inversa { background: #d97706; color: #fff; }
                .badge-mostro { background: #dc2626; color: #fff; }

                .question-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.3;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .answer-display {
                    background: rgba(0,0,0,0.6);
                    border: 2px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    height: 60px;
                    width: 100%;
                    max-width: 280px;
                    margin: 15px auto 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.2rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #00ffcc;
                }

                .keypad {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    width: 100%;
                    max-width: 360px;
                    margin: 0 auto;
                }

                .key {
                    background: rgba(255,255,255,0.12);
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1.8rem;
                    font-weight: 700;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.1s;
                    -webkit-tap-highlight-color: transparent;
                }
                .key:active { background: rgba(255,255,255,0.3); }
                .key-del { background: rgba(220, 38, 38, 0.4); }
                .key-enter { background: rgba(46, 164, 79, 0.6); grid-column: span 2; }

                .overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #121212;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 25px;
                    text-align: center;
                    z-index: 10;
                }
                .overlay h1 { font-size: 2.4rem; margin-bottom: 10px; color: #2ea44f; }
                .overlay p { font-size: 1rem; color: #ccc; margin-bottom: 25px; max-width: 320px; line-height: 1.4; }

                .btn-start {
                    background: #2ea44f;
                    color: white;
                    border: none;
                    padding: 16px 36px;
                    font-size: 1.3rem;
                    font-weight: 800;
                    border-radius: 30px;
                    cursor: pointer;
                    text-transform: uppercase;
                    box-shadow: 0 4px 15px rgba(46, 164, 79, 0.4);
                }

                .hidden { display: none !important; }
            `;
            document.head.appendChild(styleCart);
        }

        let score = 0;
        let timeLeft = 90;
        let timerInterval = null;
        let currentAnswer = 0;
        let currentPoints = 1;
        let userInputValue = "";

        let audioCtx = null;
        let musicOsc = null;
        let musicGain = null;
        let sirenOsc = null;
        let sirenGain = null;
        let audioTimer = null;

        function initAudio() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        function playMusicState(type) {
            if (!audioCtx) return;
            stopAudio();

            if (type === 'diretta' || type === 'inversa') {
                musicOsc = audioCtx.createOscillator();
                musicGain = audioCtx.createGain();
                
                musicOsc.type = 'triangle';
                let speed = type === 'diretta' ? 400 : 200;
                let baseFreq = type === 'diretta' ? 220 : 330;

                musicGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                musicOsc.connect(musicGain);
                musicGain.connect(audioCtx.destination);
                musicOsc.start();

                let step = 0;
                const notes = [0, 4, 7, 12, 7, 4];
                audioTimer = setInterval(() => {
                    if (musicOsc) {
                        let freq = baseFreq * Math.pow(2, notes[step % notes.length] / 12);
                        musicOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                        step++;
                    }
                }, speed);

            } else if (type === 'mostro') {
                sirenOsc = audioCtx.createOscillator();
                sirenGain = audioCtx.createGain();

                sirenOsc.type = 'sawtooth';
                sirenGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

                sirenOsc.connect(sirenGain);
                sirenGain.connect(audioCtx.destination);
                sirenOsc.start();

                let high = false;
                audioTimer = setInterval(() => {
                    if (sirenOsc) {
                        let targetFreq = high ? 800 : 400;
                        sirenOsc.frequency.exponentialRampToValueAtTime(targetFreq, audioCtx.currentTime + 0.25);
                        high = !high;
                    }
                }, 300);
            }
        }

        function stopAudio() {
            if (audioTimer) clearInterval(audioTimer);
            if (musicOsc) { try { musicOsc.stop(); } catch(e){} musicOsc = null; }
            if (sirenOsc) { try { sirenOsc.stop(); } catch(e){} sirenOsc = null; }
        }

        function updateConsoleStats() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Circa-Cerchio");
                window.UGOConsole.setScore(score);
                window.UGOConsole.setTimer(timeLeft + "s");
            }
        }

        function startGame() {
            initAudio();
            score = 0;
            timeLeft = 90;
            userInputValue = "";
            
            document.getElementById('score').textContent = score;
            document.getElementById('timer').textContent = timeLeft;
            updateConsoleStats();

            document.getElementById('start-overlay').classList.add('hidden');
            document.getElementById('end-overlay').classList.add('hidden');

            generateQuestion();

            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                updateConsoleStats();
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }

        function generateQuestion() {
            userInputValue = "";
            updateDisplay();

            const rand = Math.random() * 100;
            let category = "";

            if (rand < 50) {
                category = "diretta";
            } else if (rand < 85) {
                category = "inversa";
            } else {
                category = "mostro";
            }

            let r = Math.floor(Math.random() * 10) + 1;
            let d = r * 2;
            let c = 3 * d;
            let a = 3 * r * r;

            let qText = "";
            let ans = 0;

            if (category === "diretta") {
                currentPoints = 1;
                const sub = Math.floor(Math.random() * 4);
                if (sub === 0) { qText = `Raggio = ${r}<br>Circonferenza ≈ ?`; ans = c; }
                else if (sub === 1) { qText = `Raggio = ${r}<br>Area ≈ ?`; ans = a; }
                else if (sub === 2) { qText = `Diametro = ${d}<br>Circonferenza ≈ ?`; ans = c; }
                else { qText = `Diametro = ${d}<br>Area ≈ ?`; ans = a; }

            } else if (category === "inversa") {
                currentPoints = 2;
                const sub = Math.floor(Math.random() * 4);
                if (sub === 0) { qText = `Circonferenza = ${c}<br>Raggio ≈ ?`; ans = r; }
                else if (sub === 1) { qText = `Circonferenza = ${c}<br>Diametro ≈ ?`; ans = d; }
                else if (sub === 2) { qText = `Area = ${a}<br>Raggio ≈ ?`; ans = r; }
                else { qText = `Area = ${a}<br>Diametro ≈ ?`; ans = d; }

            } else if (category === "mostro") {
                currentPoints = 4;
                const sub = Math.floor(Math.random() * 2);
                if (sub === 0) { qText = `👹 MOSTRO!<br>Area = ${a}<br>Circonferenza ≈ ?`; ans = c; }
                else { qText = `👹 MOSTRO!<br>Circonferenza = ${c}<br>Area ≈ ?`; ans = a; }
            }

            currentAnswer = ans;
            applyStyleAndAudio(category);

            document.getElementById('question-text').innerHTML = qText;
        }

        function applyStyleAndAudio(category) {
            const container = document.getElementById('game-container');
            const badge = document.getElementById('badge-type');

            if (container) container.className = "";
            if (badge) badge.className = "badge";

            if (category === "diretta") {
                if (container) container.classList.add('state-diretta');
                if (badge) { badge.classList.add('badge-diretta'); badge.textContent = "Diretta (+1 pt)"; }
            } else if (category === "inversa") {
                if (container) container.classList.add('state-inversa');
                if (badge) { badge.classList.add('badge-inversa'); badge.textContent = "Inversa (+2 pt)"; }
            } else if (category === "mostro") {
                if (container) container.classList.add('state-mostro');
                if (badge) { badge.classList.add('badge-mostro'); badge.textContent = "👹 MOSTRO (+4 pt)"; }
            }

            playMusicState(category);
        }

        function pressKey(val) {
            if (val === 'DEL') {
                userInputValue = userInputValue.slice(0, -1);
            } else if (val === 'ENTER') {
                checkAnswer();
                return;
            } else {
                if (userInputValue.length < 5) {
                    userInputValue += val;
                }
            }
            updateDisplay();
        }

        window.pressKey = pressKey;

        function updateDisplay() {
            const disp = document.getElementById('answer-display');
            if (disp) disp.textContent = userInputValue === "" ? "_" : userInputValue;
        }

        function checkAnswer() {
            if (userInputValue === "") return;

            let userNum = parseInt(userInputValue);
            if (userNum === currentAnswer) {
                score += currentPoints;
                const scoreEl = document.getElementById('score');
                if (scoreEl) scoreEl.textContent = score;
                updateConsoleStats();
            }
            generateQuestion();
        }

        window.addEventListener('keydown', function(e) {
            const startOverlay = document.getElementById('start-overlay');
            const endOverlay = document.getElementById('end-overlay');
            if (startOverlay && endOverlay && startOverlay.classList.contains('hidden') && endOverlay.classList.contains('hidden')) {
                if (e.key >= '0' && e.key <= '9') {
                    pressKey(e.key);
                } else if (e.key === 'Backspace') {
                    pressKey('DEL');
                } else if (e.key === 'Enter') {
                    pressKey('ENTER');
                }
            }
        });

        function endGame() {
            clearInterval(timerInterval);
            stopAudio();
            const finalScoreEl = document.getElementById('final-score');
            if (finalScoreEl) finalScoreEl.textContent = score;
            const endOverlayEl = document.getElementById('end-overlay');
            if (endOverlayEl) endOverlayEl.classList.remove('hidden');
        }

        const btnStart = document.getElementById('btn-start-game');
        const btnRestart = document.getElementById('btn-restart-game');
        if (btnStart) btnStart.addEventListener('click', startGame);
        if (btnRestart) btnRestart.addEventListener('click', startGame);
    }
});
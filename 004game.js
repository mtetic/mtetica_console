// --- CARTUCCIA 004: CIRCA-CERCHIO ---

window.UGOConsole.registerCartridge({
    id: 4,
    titolo: "4. Circa-Cerchio",
    colore: "#d97706",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        slot.innerHTML = `
            <div id="cc-root">
                <div id="cc-container">
                    <!-- Header STATS -->
                    <div class="cc-header">
                        <div class="cc-stat">
                            <div class="cc-stat-label">Tempo</div>
                            <div class="cc-stat-value" id="cc-timer">90</div>
                        </div>
                        <div class="cc-pi">π ≈ 3</div>
                        <div class="cc-stat">
                            <div class="cc-stat-label">Punti</div>
                            <div class="cc-stat-value" id="cc-score">0</div>
                        </div>
                    </div>

                    <div id="cc-main">
                        <!-- Domanda e Input -->
                        <div class="cc-question-container">
                            <div id="cc-badge" class="cc-badge">--</div>
                            <div id="cc-question" class="cc-question-text">Premi Inizia!</div>
                            <div id="cc-answer" class="cc-answer">_</div>
                        </div>

                        <!-- Tastierino: 3 colonne x 4 righe, occupa lo spazio che resta -->
                        <div id="cc-keypad">
                            <button type="button" class="cc-key" data-k="1">1</button>
                            <button type="button" class="cc-key" data-k="2">2</button>
                            <button type="button" class="cc-key" data-k="3">3</button>
                            <button type="button" class="cc-key" data-k="4">4</button>
                            <button type="button" class="cc-key" data-k="5">5</button>
                            <button type="button" class="cc-key" data-k="6">6</button>
                            <button type="button" class="cc-key" data-k="7">7</button>
                            <button type="button" class="cc-key" data-k="8">8</button>
                            <button type="button" class="cc-key" data-k="9">9</button>
                            <button type="button" class="cc-key cc-del" data-k="DEL">←</button>
                            <button type="button" class="cc-key" data-k="0">0</button>
                            <button type="button" class="cc-key cc-enter" data-k="ENTER">INVIO</button>
                        </div>
                    </div>
                </div>

                <!-- Schermata Iniziale -->
                <div id="cc-start" class="cc-overlay">
                    <h1>Circa-Cerchio</h1>
                    <p>Calcola le misure del cerchio usando <b>π ≈ 3</b>.<br><br>
                    🟢 Diretta: +1 pt<br>
                    🟠 Inversa: +2 pt<br>
                    🔴 MOSTRO: +4 pt<br><br>
                    Hai <b>90 secondi</b>!</p>
                    <button type="button" class="btn-start" id="cc-btn-start">INIZIA GIOCO</button>
                </div>

                <!-- Schermata Finale -->
                <div id="cc-end" class="cc-overlay cc-hidden">
                    <h1>Tempo Scaduto!</h1>
                    <p>Punteggio Finale:</p>
                    <div id="cc-final" style="font-size: 4rem; font-weight: 800; color: #2ea44f; margin-bottom: 14px;">0</div>
                    <div id="cc-report"></div>
                    <button type="button" class="btn-start" id="cc-btn-restart">GIOCA ANCORA</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-4');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-4';
        styleCart.innerHTML = `
            #cc-root { position: relative; width: 100%; height: 100%; background: #0f172a; color: #f8fafc; }
            #cc-container {
                width: 100%; height: 100%; display: flex; flex-direction: column; gap: 8px;
                padding: 10px; position: relative; box-sizing: border-box; overflow: hidden;
                border: 8px solid transparent;
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }
            .cc-state-diretta { background-color: #0d2b1a !important; border-color: #2ea44f !important; }
            .cc-state-inversa { background-color: #3b2005 !important; border-color: #d97706 !important; }
            .cc-state-mostro {
                background-color: #3a080c !important; border-color: #dc2626 !important;
                animation: cc-pulse-red 0.8s infinite alternate;
            }
            @keyframes cc-pulse-red {
                0% { border-color: #dc2626; box-shadow: inset 0 0 15px #dc2626; }
                100% { border-color: #991b1b; box-shadow: inset 0 0 35px #991b1b; }
            }

            .cc-header {
                flex: 0 0 auto; width: 100%; max-width: 560px; margin: 0 auto;
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(0,0,0,0.4); padding: 6px 14px; border-radius: 12px; box-sizing: border-box;
            }
            .cc-stat { text-align: center; }
            .cc-stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #aaa; }
            .cc-stat-value { font-size: clamp(1.2rem, 4.5vh, 1.6rem); font-weight: 800; }
            .cc-pi {
                text-align: center; background: rgba(255,255,255,0.1); padding: 6px 12px;
                border-radius: 20px; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.5px;
            }

            #cc-main {
                flex: 1 1 0; min-height: 0; width: 100%; max-width: 560px; margin: 0 auto;
                display: flex; flex-direction: column; gap: 8px;
            }
            .cc-question-container {
                flex: 1 1 0; min-height: 0; text-align: center;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
            }
            .cc-badge {
                display: inline-block; padding: 4px 12px; border-radius: 12px;
                font-size: 0.85rem; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;
            }
            .cc-badge-diretta { background: #2ea44f; color: #fff; }
            .cc-badge-inversa { background: #d97706; color: #fff; }
            .cc-badge-mostro { background: #dc2626; color: #fff; }

            .cc-question-text {
                font-size: clamp(1.1rem, 4.5vh, 1.7rem); font-weight: 700; line-height: 1.3;
                display: flex; align-items: center; justify-content: center; text-align: center;
            }
            .cc-answer {
                background: rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.2); border-radius: 12px;
                height: clamp(42px, 9vh, 60px); width: 100%; max-width: 280px; margin: 10px auto 0 auto;
                display: flex; align-items: center; justify-content: center;
                font-size: clamp(1.5rem, 6vh, 2.2rem); font-weight: 800; letter-spacing: 2px; color: #00ffcc;
            }

            #cc-keypad {
                flex: 1.7 1 0; min-height: 0; width: 100%; max-width: 360px; margin: 0 auto;
                display: grid; grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 8px;
            }
            .cc-key {
                width: 100%; height: 100%; padding: 0;
                background: rgba(255,255,255,0.12); border: none; border-radius: 12px; color: #fff;
                font-size: clamp(1.1rem, 5vh, 1.9rem); font-weight: 700; cursor: pointer;
                touch-action: manipulation; -webkit-tap-highlight-color: transparent;
            }
            .cc-key:active { background: rgba(255,255,255,0.3); }
            .cc-del { background: rgba(220, 38, 38, 0.4); }
            .cc-enter { background: rgba(46, 164, 79, 0.6); font-size: clamp(0.85rem, 3.4vh, 1.3rem); }

            .cc-overlay {
                position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #121212;
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                padding: 20px; text-align: center; z-index: 10; overflow-y: auto; box-sizing: border-box;
            }
            .cc-overlay h1 { font-size: clamp(1.8rem, 6vh, 2.4rem); margin: 0 0 10px 0; color: #2ea44f; }
            .cc-overlay p { font-size: clamp(0.9rem, 2.8vh, 1rem); color: #ccc; margin: 0 0 20px 0; max-width: 320px; line-height: 1.4; }
            .cc-overlay .btn-start { background: #2ea44f; border-radius: 30px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(46,164,79,0.4); }
            .cc-hidden { display: none !important; }

            #cc-report {
                width: 100%; max-width: 520px; max-height: 38%; margin-bottom: 16px;
                overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(255,255,255,0.07); border-radius: 10px; padding: 8px 12px;
                box-sizing: border-box; text-align: left; color: #d4d4d8;
                font-size: clamp(0.8rem, 2.4vh, 0.95rem); line-height: 1.45;
            }
            .cc-rep-head { margin-bottom: 6px; }
            .cc-rep-title { color: #fbbf24; font-weight: bold; margin-bottom: 4px; }
            .cc-rep-item { margin-bottom: 10px; }
            .cc-rep-q { font-weight: bold; color: #fff; }
            .cc-rep-sp { color: #a1a1aa; }

            /* Telefono in orizzontale: domanda a sinistra, tastierino a destra */
            @media (orientation: landscape) and (max-height: 520px) {
                #cc-main { flex-direction: row; max-width: 900px; }
                .cc-question-container { flex: 1 1 0; }
                #cc-keypad { flex: 1 1 0; max-width: none; margin: 0; }
            }
        `;
        document.head.appendChild(styleCart);

        // --- STATO ---
        let score = 0;
        let timeLeft = 90;
        let timerInterval = null;
        let currentAnswer = 0;
        let currentPoints = 1;
        let userInputValue = "";
        let giocoAttivo = false;

        // Report finale
        let corrente = null;     // dettagli della domanda in corso
        let errori = {};
        let nGiuste = 0;
        let nSbagliate = 0;

        // --- AUDIO ---
        let audioCtx = null;
        let musicOsc = null;
        let musicGain = null;
        let sirenOsc = null;
        let sirenGain = null;
        let audioTimer = null;

        function initAudio() {
            if (!audioCtx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AC();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function playMusicState(type) {
            if (!audioCtx) return;
            stopAudio();

            if (type === 'diretta' || type === 'inversa') {
                musicOsc = audioCtx.createOscillator();
                musicGain = audioCtx.createGain();

                musicOsc.type = 'triangle';
                const speed = type === 'diretta' ? 400 : 200;
                const baseFreq = type === 'diretta' ? 220 : 330;

                musicGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                musicOsc.connect(musicGain);
                musicGain.connect(audioCtx.destination);
                musicOsc.start();

                let step = 0;
                const notes = [0, 4, 7, 12, 7, 4];
                audioTimer = setInterval(function() {
                    if (musicOsc && audioCtx) {
                        const freq = baseFreq * Math.pow(2, notes[step % notes.length] / 12);
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
                audioTimer = setInterval(function() {
                    if (sirenOsc && audioCtx) {
                        const targetFreq = high ? 800 : 400;
                        sirenOsc.frequency.exponentialRampToValueAtTime(targetFreq, audioCtx.currentTime + 0.25);
                        high = !high;
                    }
                }, 300);
            }
        }

        function stopAudio() {
            if (audioTimer) { clearInterval(audioTimer); audioTimer = null; }
            if (musicOsc) { try { musicOsc.stop(); } catch (e) {} musicOsc = null; }
            if (sirenOsc) { try { sirenOsc.stop(); } catch (e) {} sirenOsc = null; }
        }

        // Segnale sonoro dopo ogni risposta: due note in salita se giusta, buzz grave se sbagliata
        function tono(freq, inizio, durata, tipo, volume) {
            if (!audioCtx) return;
            const t = audioCtx.currentTime + inizio;
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = tipo;
            osc.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(volume, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + durata);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + durata + 0.02);
        }

        function suonaEsito(giusta) {
            if (giusta) {
                tono(987.77, 0, 0.12, 'square', 0.14);
                tono(1318.51, 0.08, 0.3, 'square', 0.14);
            } else {
                tono(150, 0, 0.35, 'sawtooth', 0.2);
                tono(100, 0.1, 0.3, 'sawtooth', 0.18);
            }
        }

        // --- FLUSSO ---
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
            giocoAttivo = true;
            errori = {};
            nGiuste = 0;
            nSbagliate = 0;

            document.getElementById('cc-score').textContent = score;
            document.getElementById('cc-timer').textContent = timeLeft;
            updateConsoleStats();

            document.getElementById('cc-start').classList.add('cc-hidden');
            document.getElementById('cc-end').classList.add('cc-hidden');

            generateQuestion();

            clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                timeLeft--;
                document.getElementById('cc-timer').textContent = Math.max(0, timeLeft);
                updateConsoleStats();
                if (timeLeft <= 0) endGame();
            }, 1000);
        }

        function generateQuestion() {
            userInputValue = "";
            updateDisplay();

            const rand = Math.random() * 100;
            let category = "";

            if (rand < 50) category = "diretta";
            else if (rand < 85) category = "inversa";
            else category = "mostro";

            const r = Math.floor(Math.random() * 10) + 1;
            const d = r * 2;
            const c = 3 * d;
            const a = 3 * r * r;
            const r2 = r * r;

            let qText = "";
            let ans = 0;
            let sp = "";

            if (category === "diretta") {
                currentPoints = 1;
                const sub = Math.floor(Math.random() * 4);
                if (sub === 0) {
                    qText = `Raggio = ${r}<br>Circonferenza ≈ ?`; ans = c;
                    sp = `C = 2 × π × r = 2 × 3 × ${r} = ${c}`;
                } else if (sub === 1) {
                    qText = `Raggio = ${r}<br>Area ≈ ?`; ans = a;
                    sp = `A = π × r² = 3 × ${r}² = 3 × ${r2} = ${a}`;
                } else if (sub === 2) {
                    qText = `Diametro = ${d}<br>Circonferenza ≈ ?`; ans = c;
                    sp = `C = π × d = 3 × ${d} = ${c}`;
                } else {
                    qText = `Diametro = ${d}<br>Area ≈ ?`; ans = a;
                    sp = `Prima il raggio: r = d : 2 = ${d} : 2 = ${r}. Poi A = π × r² = 3 × ${r}² = 3 × ${r2} = ${a}`;
                }

            } else if (category === "inversa") {
                currentPoints = 2;
                const sub = Math.floor(Math.random() * 4);
                if (sub === 0) {
                    qText = `Circonferenza = ${c}<br>Raggio ≈ ?`; ans = r;
                    sp = `C = 2 × π × r, quindi r = C : (2 × 3) = ${c} : 6 = ${r}`;
                } else if (sub === 1) {
                    qText = `Circonferenza = ${c}<br>Diametro ≈ ?`; ans = d;
                    sp = `C = π × d, quindi d = C : π = ${c} : 3 = ${d}`;
                } else if (sub === 2) {
                    qText = `Area = ${a}<br>Raggio ≈ ?`; ans = r;
                    sp = `A = π × r², quindi r² = A : 3 = ${a} : 3 = ${r2}. Il numero che moltiplicato per sé stesso fa ${r2} è ${r}.`;
                } else {
                    qText = `Area = ${a}<br>Diametro ≈ ?`; ans = d;
                    sp = `r² = A : 3 = ${a} : 3 = ${r2}, quindi r = ${r}. Il diametro è il doppio: d = 2 × ${r} = ${d}`;
                }

            } else {
                currentPoints = 4;
                const sub = Math.floor(Math.random() * 2);
                if (sub === 0) {
                    qText = `👹 MOSTRO!<br>Area = ${a}<br>Circonferenza ≈ ?`; ans = c;
                    sp = `Dall'area trovi il raggio: r² = ${a} : 3 = ${r2}, quindi r = ${r}. Poi C = 2 × 3 × ${r} = ${c}`;
                } else {
                    qText = `👹 MOSTRO!<br>Circonferenza = ${c}<br>Area ≈ ?`; ans = a;
                    sp = `Dalla circonferenza trovi il raggio: r = C : 6 = ${c} : 6 = ${r}. Poi A = 3 × ${r}² = 3 × ${r2} = ${a}`;
                }
            }

            currentAnswer = ans;
            corrente = { q: qText.replace(/<br>/g, " — "), giusta: ans, spieg: sp };
            applyStyleAndAudio(category);
            document.getElementById('cc-question').innerHTML = qText;
        }

        function applyStyleAndAudio(category) {
            const container = document.getElementById('cc-container');
            const badge = document.getElementById('cc-badge');

            container.classList.remove('cc-state-diretta', 'cc-state-inversa', 'cc-state-mostro');
            badge.className = "cc-badge";

            if (category === "diretta") {
                container.classList.add('cc-state-diretta');
                badge.classList.add('cc-badge-diretta');
                badge.textContent = "Diretta (+1 pt)";
            } else if (category === "inversa") {
                container.classList.add('cc-state-inversa');
                badge.classList.add('cc-badge-inversa');
                badge.textContent = "Inversa (+2 pt)";
            } else {
                container.classList.add('cc-state-mostro');
                badge.classList.add('cc-badge-mostro');
                badge.textContent = "👹 MOSTRO (+4 pt)";
            }

            playMusicState(category);
        }

        function pressKey(val) {
            if (!giocoAttivo) return;
            if (val === 'DEL') {
                userInputValue = userInputValue.slice(0, -1);
            } else if (val === 'ENTER') {
                checkAnswer();
                return;
            } else if (userInputValue.length < 5) {
                userInputValue += val;
            }
            updateDisplay();
        }

        function updateDisplay() {
            const disp = document.getElementById('cc-answer');
            if (disp) disp.textContent = userInputValue === "" ? "_" : userInputValue;
        }

        function checkAnswer() {
            if (userInputValue === "") return;
            if (parseInt(userInputValue, 10) === currentAnswer) {
                score += currentPoints;
                nGiuste++;
                document.getElementById('cc-score').textContent = score;
                updateConsoleStats();
                suonaEsito(true);
            } else {
                nSbagliate++;
                suonaEsito(false);
                if (corrente) {
                    const k = corrente.q;
                    if (!errori[k]) errori[k] = { q: corrente.q, dato: userInputValue, giusta: corrente.giusta, spieg: corrente.spieg, pt: currentPoints, n: 0 };
                    errori[k].n++;
                    errori[k].dato = userInputValue;
                }
            }
            generateQuestion();
        }

        function endGame() {
            giocoAttivo = false;
            clearInterval(timerInterval);
            stopAudio();
            document.getElementById('cc-final').textContent = score;
            costruisciReport();
            document.getElementById('cc-end').classList.remove('cc-hidden');
        }

        function costruisciReport() {
            const box = document.getElementById('cc-report');
            if (!box) return;
            let h = '<div class="cc-rep-head">Giuste: <b>' + nGiuste + '</b> · Sbagliate: <b>' + nSbagliate + '</b></div>';
            const chiavi = Object.keys(errori);
            if (chiavi.length === 0) {
                h += '<div><b>Nessun errore: perfetto!</b></div>';
            } else {
                h += '<div class="cc-rep-title">Da ripassare:</div>';
                chiavi.forEach(function(k) {
                    const x = errori[k];
                    h += '<div class="cc-rep-item"><div class="cc-rep-q">' + x.q + '</div>' +
                         '<div>Hai scritto: <b>' + x.dato + '</b> · Giusto: <b>' + x.giusta + '</b>' + (x.n > 1 ? ' (×' + x.n + ')' : '') + '</div>' +
                         '<div class="cc-rep-sp">' + x.spieg + '</div></div>';
                });
            }
            box.innerHTML = h;
        }

        // --- INPUT: tastierino a schermo ---
        document.getElementById('cc-keypad').addEventListener('click', function(e) {
            const b = e.target.closest ? e.target.closest('button') : null;
            if (b) pressKey(b.getAttribute('data-k'));
        });

        document.getElementById('cc-btn-start').addEventListener('click', startGame);
        document.getElementById('cc-btn-restart').addEventListener('click', startGame);

        // --- INPUT: tastiera fisica ---
        if (window.__ccKeyHandler) window.removeEventListener('keydown', window.__ccKeyHandler);
        window.__ccKeyHandler = function(e) {
            if (!alive || !giocoAttivo || !document.getElementById('cc-container')) return;
            if (e.key >= '0' && e.key <= '9') { pressKey(e.key); e.preventDefault(); }
            else if (e.key === 'Backspace') { pressKey('DEL'); e.preventDefault(); }
            else if (e.key === 'Enter') { pressKey('ENTER'); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__ccKeyHandler);

        // --- PULIZIA quando si esce dal gioco (tasto Menu della console) ---
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoAttivo = false;
                if (timerInterval) clearInterval(timerInterval);
                stopAudio();
                window.removeEventListener('keydown', window.__ccKeyHandler);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-4');
                if (st) st.remove();
            });
        }
    }
});

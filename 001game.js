// --- CARTUCCIA 001: PRIMI PALLONCINI ---

window.UGOConsole.registerCartridge({
    id: 1,
    titolo: "1. Primi palloncini",
    colore: "#22c55e",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        slot.innerHTML = `
            <div class="game-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 8px; box-sizing: border-box;">
                <div class="header" style="flex: 0 0 auto; padding-bottom: 6px;">
                    <h1 style="font-size: min(2.5vh, 1.4rem); margin: 0 0 4px 0; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">Primi palloncini</h1>
                </div>

                <div class="canvas-container" id="containerRef" style="flex: 1 1 auto; width: 100%; height: 100%; background: #1e293b; border-radius: 12px; border: 2px solid #334155; position: relative; overflow: hidden; min-height: 0;">
                    <canvas id="gameCanvas" style="display: block; width: 100%; height: 100%; background: #090d16; border-radius: 10px; touch-action: none;"></canvas>

                    <div id="schermata-start" class="overlay">
                        <h2>Pronti alla Sfida?</h2>
                        <p>Scoppia i <b>numeri composti</b> (+1 pt). Fai un <b>cerchio intorno ai primi</b> senza toccarli per catturarli (+3 pt alla fine se sono primi)! Se scoppi un primo perdi 1 punto, e se circondi un composto per sbaglio ne perdi 1 alla fine.</p>
                        <button class="btn-start" id="btn-start-game">Inizia la Sfida</button>
                    </div>

                    <div id="schermata-fine" class="overlay" style="display: none;">
                        <h2 id="titolo-fine">Tempo Scaduto!</h2>
                        <p>Punteggio finale: <span id="punti-finali" style="color:#22c55e; font-weight:bold;">0</span></p>
                        <div id="riepilogo"></div>
                        <button class="btn-start" id="btn-restart-game">Gioca Ancora</button>
                    </div>
                </div>
            </div>
        `;

        // Lo stile viene ricreato ogni volta (e tolto all'uscita)
        const oldStyle = document.getElementById('style-cartuccia-1');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-1';
        styleCart.innerHTML = `
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.95);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            .overlay h2 {
                font-size: min(5vh, 2.2rem);
                color: #38bdf8;
                margin: 0 0 10px 0;
            }
            .overlay p {
                font-size: min(2.8vh, 1.1rem);
                margin: 5px 0 20px 0;
                color: #94a3b8;
                max-width: 90%;
                line-height: 1.4;
            }
            .btn-start {
                background: #22c55e;
                color: white;
                border: none;
                padding: 12px 35px;
                font-size: min(3.2vh, 1.3rem);
                font-weight: bold;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px #16a34a;
            }
            .btn-start:active {
                transform: translateY(4px);
                box-shadow: 0 0 #16a34a;
            }
            #riepilogo {
                width: 90%;
                max-width: 520px;
                max-height: 38%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                margin: 0 0 14px 0;
                padding: 8px 14px;
                background: rgba(30, 41, 59, 0.85);
                border-radius: 10px;
                color: #cbd5e1;
                font-size: min(2.6vh, 1rem);
                text-align: left;
                line-height: 1.5;
                box-sizing: border-box;
            }
            #riepilogo b { color: #fbbf24; }
        `;
        document.head.appendChild(styleCart);

        const canvas = document.getElementById("gameCanvas");
        const containerRef = document.getElementById("containerRef");
        const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

        // Dimensioni "logiche" (in pixel CSS). Il canvas reale è più grande sugli schermi
        // ad alta densità (iPhone, iPad, lavagne 4K) così testi e cerchi restano nitidi.
        let W = 300, H = 150, DPR = 1;

        function ridimensionaCanvas() {
            if (!containerRef) return;
            const rect = containerRef.getBoundingClientRect();
            const w = Math.max(1, Math.floor(rect.width));
            const h = Math.max(1, Math.floor(rect.height));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
            if (canvas.width !== pw || canvas.height !== ph) {
                canvas.width = pw;
                canvas.height = ph;
            }
            W = w; H = h; DPR = dpr;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        window.addEventListener('resize', ridimensionaCanvas);
        ridimensionaCanvas();
        setTimeout(function() { if (alive) ridimensionaCanvas(); }, 100);

        // --- SISTEMA AUDIO ---
        let audioCtx = null;
        let bgMusicInterval = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        function playSoundCoin() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        }

        function playSoundBuzz() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.4);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        }

        function playSoundSuspense() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(440, now + 0.8);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.8);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.8);
        }

        function playSoundFanfare() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                gain.gain.setValueAtTime(0.2, now + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + idx * 0.1);
                osc.stop(now + idx * 0.1 + 0.3);
            });
        }

        function playSoundQuaQua() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const notes = [311.13, 293.66, 277.18, 261.63];
            const times = [0, 0.2, 0.4, 0.6];
            notes.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + times[idx]);
                gain.gain.setValueAtTime(0.2, now + times[idx]);
                gain.gain.linearRampToValueAtTime(0.01, now + times[idx] + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + times[idx]);
                osc.stop(now + times[idx] + 0.2);
            });
        }

        function startBgMusic() {
            stopBgMusic();
            if (!audioCtx) return;
            let noteIdx = 0;
            const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
            bgMusicInterval = setInterval(() => {
                if (!giocoInCorso || !audioCtx) return;
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(scale[noteIdx % scale.length], now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
                noteIdx = (noteIdx + 1) % scale.length;
            }, 400);
        }

        function stopBgMusic() {
            if (bgMusicInterval) clearInterval(bgMusicInterval);
            bgMusicInterval = null;
        }

        let punti = 0;
        let tempoResiduo = 60;
        let timerInterval = null;
        let giocoInCorso = false;
        let palloncini = [];
        let particelle = [];
        let pallonciniCatturati = [];
        let animFrame = null;
        let spawnTimer = 0;
        let lastFrameTs = 0;

        // Feedback sugli errori e riepilogo
        let primiSpiegati = new Set();   // primi già spiegati in questa partita
        let erroriPrimi = {};            // numero -> quante volte scoppiato per sbaglio
        let erroriComposti = {};         // numero -> quante volte catturato per sbaglio
        let messaggioTesto = "";
        let messaggioFino = 0;

        let faseVerificaFinale = false;
        let indiceVerifica = 0;
        let subFaseVerifica = 0;
        let timerSubFase = 0;

        let activeStrokes = {};

        const numeriPrimiSet = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
        const listaPrimi = Array.from(numeriPrimiSet);
        const listaComposti = [];
        for (let i = 2; i <= 100; i++) {
            if (!numeriPrimiSet.has(i)) listaComposti.push(i);
        }

        const paletteColori = [
            "#38bdf8", "#f43f5e", "#22c55e", "#eab308",
            "#a855f7", "#fb923c", "#ec4899", "#14b8a6", "#818cf8"
        ];

        function isPrimo(n) { return numeriPrimiSet.has(n); }

        function scomponiFattori(n) {
            let fattori = [];
            let d = 2;
            let temp = n;
            while (temp > 1) {
                if (temp % d === 0) {
                    fattori.push(d);
                    temp /= d;
                } else { d++; }
            }
            return fattori;
        }

        function aggiornaConsoleStats() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Primi palloncini");
                window.UGOConsole.setScore(punti);
                window.UGOConsole.setTimer(tempoResiduo + "s");
            }
        }

        function iniziaGioco() {
            ridimensionaCanvas();
            initAudio();
            punti = 0;
            tempoResiduo = 60;
            giocoInCorso = true;
            faseVerificaFinale = false;
            palloncini = [];
            particelle = [];
            pallonciniCatturati = [];
            activeStrokes = {};
            mouseStroke = null;
            isMouseDown = false;
            primiSpiegati = new Set();
            erroriPrimi = {};
            erroriComposti = {};
            messaggioTesto = "";
            messaggioFino = 0;
            spawnTimer = 0;
            lastFrameTs = 0;
            aggiornaConsoleStats();

            document.getElementById("schermata-start").style.display = "none";
            document.getElementById("schermata-fine").style.display = "none";

            setTimeout(() => { if (alive && giocoInCorso) startBgMusic(); }, 100);

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                tempoResiduo--;
                aggiornaConsoleStats();
                if (tempoResiduo <= 0) { avviaVerificaFinale(); }
            }, 1000);

            if (animFrame) cancelAnimationFrame(animFrame);
            cicloGioco();
        }

        function avviaVerificaFinale() {
            giocoInCorso = false;
            stopBgMusic();
            clearInterval(timerInterval);

            if (pallonciniCatturati.length === 0) {
                terminaGioco();
                return;
            }

            faseVerificaFinale = true;
            indiceVerifica = 0;
            subFaseVerifica = 0;
            timerSubFase = 0;
            lastFrameTs = 0;
            playSoundSuspense();
            document.getElementById("titolo-fine").innerText = "Gran Sfilata dei Primi...";
        }

        function terminaGioco() {
            faseVerificaFinale = false;
            stopBgMusic();
            if (animFrame) cancelAnimationFrame(animFrame);
            document.getElementById("titolo-fine").innerText = "Tempo Scaduto!";
            const finale = Math.max(0, punti); // il punteggio finale non scende sotto zero
            document.getElementById("punti-finali").innerText = finale;
            if (window.UGOConsole) window.UGOConsole.setScore(finale);
            costruisciRiepilogo();
            document.getElementById("schermata-fine").style.display = "flex";
        }

        function costruisciRiepilogo() {
            const box = document.getElementById("riepilogo");
            if (!box) return;
            const chiavi = o => Object.keys(o).map(Number).sort((a, b) => a - b);
            const primi = chiavi(erroriPrimi);
            const composti = chiavi(erroriComposti);

            if (primi.length === 0 && composti.length === 0) {
                box.innerHTML = "<b>Nessun errore: perfetto!</b>";
                return;
            }

            let h = "";
            if (primi.length > 0) {
                h += "<b>Primi scoppiati per sbaglio:</b><br>";
                primi.forEach(n => {
                    h += n + " è primo" + (erroriPrimi[n] > 1 ? " (×" + erroriPrimi[n] + ")" : "") + "<br>";
                });
            }
            if (composti.length > 0) {
                if (h) h += "<br>";
                h += "<b>Composti catturati per sbaglio:</b><br>";
                composti.forEach(n => {
                    h += n + " = " + scomponiFattori(n).join(" × ") + (erroriComposti[n] > 1 ? " (×" + erroriComposti[n] + ")" : "") + "<br>";
                });
            }
            box.innerHTML = h;
        }

        function creaPalloncino() {
            let numero = (Math.random() < 0.35)
                ? listaPrimi[Math.floor(Math.random() * listaPrimi.length)]
                : listaComposti[Math.floor(Math.random() * listaComposti.length)];

            const raggio = 30;
            const x = Math.random() * (W - 2 * raggio) + raggio;
            const y = H + raggio;
            const velocita = 1.2 + Math.random() * 1.5; // pixel per "frame a 60 Hz"

            palloncini.push({
                x: x, y: y, r: raggio,
                numero: numero,
                primo: isPrimo(numero),
                vy: velocita,
                colore: paletteColori[Math.floor(Math.random() * paletteColori.length)]
            });
        }

        canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
        canvas.addEventListener("touchcancel", handleTouchCancel, { passive: false });
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        function handleTouchStart(e) {
            e.preventDefault();
            if (!giocoInCorso) return;
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                activeStrokes[t.identifier] = [{ x: t.clientX - rect.left, y: t.clientY - rect.top }];
            }
        }

        function handleTouchMove(e) {
            e.preventDefault();
            if (!giocoInCorso) return;
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (activeStrokes[t.identifier]) {
                    activeStrokes[t.identifier].push({ x: t.clientX - rect.left, y: t.clientY - rect.top });
                }
            }
        }

        function handleTouchEnd(e) {
            e.preventDefault();
            if (!giocoInCorso) return;
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                const stroke = activeStrokes[t.identifier];
                if (stroke) {
                    valutaGesto(stroke, t.clientX - rect.left, t.clientY - rect.top);
                    delete activeStrokes[t.identifier];
                }
            }
        }

        // Tocco interrotto dal sistema (gesto di iOS, notifica, ecc.): il tratto va buttato
        function handleTouchCancel(e) {
            for (let i = 0; i < e.changedTouches.length; i++) {
                delete activeStrokes[e.changedTouches[i].identifier];
            }
        }

        let mouseStroke = null;
        let isMouseDown = false;

        function handleMouseDown(e) {
            if (!giocoInCorso) return;
            const rect = canvas.getBoundingClientRect();
            isMouseDown = true;
            mouseStroke = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
        }

        function handleMouseMove(e) {
            if (!giocoInCorso || !isMouseDown) return;
            const rect = canvas.getBoundingClientRect();
            if (mouseStroke) {
                mouseStroke.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        }

        function handleMouseUp(e) {
            if (!giocoInCorso || !isMouseDown) return;
            isMouseDown = false;
            const rect = canvas.getBoundingClientRect();
            if (mouseStroke) {
                valutaGesto(mouseStroke, e.clientX - rect.left, e.clientY - rect.top);
                mouseStroke = null;
            }
        }

        // Il mouse esce dal riquadro mentre è premuto: si annulla il tratto
        function handleMouseLeave() {
            isMouseDown = false;
            mouseStroke = null;
        }

        function isPointInPolygon(pt, polygon) {
            let x = pt.x, y = pt.y, inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                let xi = polygon[i].x, yi = polygon[i].y;
                let xj = polygon[j].x, yj = polygon[j].y;
                let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        function valutaGesto(stroke, lastX, lastY) {
            if (stroke.length < 5) {
                verificaImpatto(lastX, lastY);
                return;
            }

            let lunghezza = 0;
            for (let i = 1; i < stroke.length; i++) {
                lunghezza += Math.hypot(stroke[i].x - stroke[i-1].x, stroke[i].y - stroke[i-1].y);
            }

            if (lunghezza < 70) {
                verificaImpatto(lastX, lastY);
                return;
            }

            let catturato = false;
            for (let i = palloncini.length - 1; i >= 0; i--) {
                let p = palloncini[i];
                let centro = { x: p.x, y: p.y };
                let dentro = isPointInPolygon(centro, stroke);

                let haToccato = false;
                for (let pt of stroke) {
                    if (Math.hypot(pt.x - p.x, pt.y - p.y) <= p.r) {
                        haToccato = true;
                        break;
                    }
                }

                if (dentro && !haToccato) {
                    pallonciniCatturati.push(p);
                    palloncini.splice(i, 1);
                    catturato = true;
                    break;
                }
            }

            if (!catturato) {
                verificaImpatto(lastX, lastY);
            }
        }

        function verificaImpatto(px, py) {
            for (let i = palloncini.length - 1; i >= 0; i--) {
                let p = palloncini[i];
                let dist = Math.hypot(p.x - px, p.y - py);
                if (dist < p.r + 12) {
                    if (!p.primo) {
                        punti++;
                        playSoundCoin();
                        creaFrammenti(p.x, p.y, p.numero);
                    } else {
                        punti--;
                        erroriPrimi[p.numero] = (erroriPrimi[p.numero] || 0) + 1;
                        if (!primiSpiegati.has(p.numero)) {
                            primiSpiegati.add(p.numero);
                            messaggioTesto = p.numero + " è primo: si divide solo per 1 e per " + p.numero;
                            messaggioFino = performance.now() + 3000;
                        }
                        playSoundBuzz();
                    }
                    aggiornaConsoleStats();
                    palloncini.splice(i, 1);
                    break;
                }
            }
        }

        function creaFrammenti(x, y, numero) {
            const fattori = scomponiFattori(numero);
            fattori.forEach((f, index) => {
                let angolo = (Math.PI * 2 / fattori.length) * index;
                particelle.push({
                    x: x, y: y,
                    vx: Math.cos(angolo) * 3.5,
                    vy: Math.sin(angolo) * 3.5 - 2,
                    testo: f, alpha: 1.0
                });
            });
        }

        function cicloGioco(ts) {
            if (!alive) return;
            if (!giocoInCorso && !faseVerificaFinale) return;

            // Tempo trascorso dall'ultimo frame, in "frame a 60 Hz".
            // Così il gioco ha la stessa velocità su schermi a 30, 60 o 120 Hz.
            const nowTs = ts || performance.now();
            let dt = lastFrameTs ? (nowTs - lastFrameTs) / 16.667 : 1;
            lastFrameTs = nowTs;
            if (dt > 3) dt = 3;
            if (dt < 0.1) dt = 0.1;

            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, W, H);

            if (giocoInCorso) {
                spawnTimer += dt;
                if (spawnTimer > 40) {
                    creaPalloncino();
                    spawnTimer = 0;
                }

                for (let i = palloncini.length - 1; i >= 0; i--) {
                    let p = palloncini[i];
                    p.y -= p.vy * dt;
                    if (p.y + p.r < 0) {
                        palloncini.splice(i, 1);
                    }
                }
            }

            if (faseVerificaFinale) {
                timerSubFase += dt;
                if (subFaseVerifica === 0) {
                    if (timerSubFase > 55) {
                        subFaseVerifica = 1;
                        timerSubFase = 0;
                        let pc = pallonciniCatturati[indiceVerifica];
                        if (pc.primo) {
                            punti += 3;
                            playSoundFanfare();
                        } else {
                            playSoundQuaQua();
                            creaFrammenti(W / 2, H / 2 + 30, pc.numero);
                            punti -= 1;
                            erroriComposti[pc.numero] = (erroriComposti[pc.numero] || 0) + 1;
                        }
                        aggiornaConsoleStats();
                    }
                } else if (subFaseVerifica === 1) {
                    if (timerSubFase > 75) {
                        indiceVerifica++;
                        subFaseVerifica = 0;
                        timerSubFase = 0;
                        if (indiceVerifica >= pallonciniCatturati.length) {
                            terminaGioco();
                            return;
                        } else {
                            playSoundSuspense();
                        }
                    }
                }
            }

            ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
            ctx.fillRect(10, 10, W - 20, 50);

            ctx.fillStyle = "#94a3b8";
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("CATTURATI:", 20, 38);

            let startXAcc = 110;
            pallonciniCatturati.forEach((pc, idx) => {
                let posX = startXAcc + (idx * 36);
                let posY = 35;
                if (posX < W - 30) {
                    if (faseVerificaFinale && idx === indiceVerifica) {
                        ctx.beginPath();
                        ctx.arc(posX, posY, 18, 0, Math.PI * 2);
                        ctx.fillStyle = "#fbbf24";
                        ctx.fill();
                    }

                    ctx.beginPath();
                    ctx.arc(posX, posY, 14, 0, Math.PI * 2);
                    ctx.fillStyle = pc.colore;
                    ctx.fill();

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 11px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(pc.numero, posX, posY);
                }
            });

            if (faseVerificaFinale && indiceVerifica < pallonciniCatturati.length) {
                let pc = pallonciniCatturati[indiceVerifica];
                let gX = W / 2;
                let gY = H / 2 + 20;
                let gRaggio = 80;

                if (subFaseVerifica === 0 || pc.primo) {
                    ctx.beginPath();
                    ctx.arc(gX, gY, gRaggio, 0, Math.PI * 2);
                    ctx.fillStyle = pc.colore;
                    ctx.fill();

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 52px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(pc.numero, gX, gY);
                }

                if (subFaseVerifica === 1) {
                    ctx.font = "bold 28px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = pc.primo ? "#22c55e" : "#f43f5e";
                    ctx.fillText(pc.primo ? "NUMERO PRIMO! (+3)" : "COMPOSTO! (-1)", gX, gY + gRaggio + 50);
                }
            }

            for (let p of palloncini) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.colore;
                ctx.fill();

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 18px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(p.numero, p.x, p.y);
            }

            ctx.lineWidth = 4;
            ctx.strokeStyle = "#38bdf8";
            ctx.lineCap = "round";

            for (let id in activeStrokes) {
                let stroke = activeStrokes[id];
                if (stroke.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(stroke[0].x, stroke[0].y);
                    for (let pt of stroke) ctx.lineTo(pt.x, pt.y);
                    ctx.stroke();
                }
            }

            if (mouseStroke && mouseStroke.length > 1) {
                ctx.beginPath();
                ctx.moveTo(mouseStroke[0].x, mouseStroke[0].y);
                for (let pt of mouseStroke) ctx.lineTo(pt.x, pt.y);
                ctx.stroke();
            }

            for (let i = particelle.length - 1; i >= 0; i--) {
                let pt = particelle[i];
                pt.x += pt.vx * dt;
                pt.y += pt.vy * dt;
                pt.alpha -= 0.02 * dt;

                if (pt.alpha <= 0) {
                    particelle.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = pt.alpha;
                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 22px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(pt.testo, pt.x, pt.y);
                ctx.globalAlpha = 1.0;
            }

            // Messaggio di spiegazione (in basso, per qualche secondo)
            if (messaggioTesto && performance.now() < messaggioFino) {
                let fs = 18;
                ctx.font = "bold " + fs + "px sans-serif";
                while (fs > 11 && ctx.measureText(messaggioTesto).width > W - 50) {
                    fs--;
                    ctx.font = "bold " + fs + "px sans-serif";
                }
                const tw = ctx.measureText(messaggioTesto).width;
                ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
                ctx.fillRect(W / 2 - tw / 2 - 12, H - 54, tw + 24, 36);
                ctx.fillStyle = "#fbbf24";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(messaggioTesto, W / 2, H - 36);
            }

            animFrame = requestAnimationFrame(cicloGioco);
        }

        // Pulizia quando si esce dal gioco (tasto Menu della console)
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoInCorso = false;
                faseVerificaFinale = false;
                if (timerInterval) clearInterval(timerInterval);
                stopBgMusic();
                if (animFrame) cancelAnimationFrame(animFrame);
                window.removeEventListener('resize', ridimensionaCanvas);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-1');
                if (st) st.remove();
            });
        }

        document.getElementById('btn-start-game').addEventListener('click', iniziaGioco);
        document.getElementById('btn-restart-game').addEventListener('click', iniziaGioco);
    }
});

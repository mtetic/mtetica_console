// --- CARTUCCIA 007: OPERIAMO! ---

window.UGOConsole.registerCartridge({
    id: 7,
    titolo: "7. Operiamo!",
    colore: "#0284c7",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco
        const DURATA = 90;
        const NOMI_LIVELLO = ["Principiante", "Esperto"];
        const OPS = ['+', '-', '×', ':'];

        slot.innerHTML = `
            <div id="op-root">
                <div id="op-container">
                    <div class="op-hud">
                        <div>Livello: <span id="op-liv" class="op-v">-</span></div>
                        <div>Tempo: <span id="op-timer" class="op-t">90</span>s</div>
                        <div>Punti: <span id="op-score" class="op-s">0</span></div>
                    </div>

                    <div id="op-main">
                        <div id="op-exp"><span id="op-expin"></span></div>

                        <div id="op-keys">
                            <button type="button" class="op-btn" data-k="7">7</button>
                            <button type="button" class="op-btn" data-k="8">8</button>
                            <button type="button" class="op-btn" data-k="9">9</button>
                            <button type="button" class="op-btn op-op" data-k="+">+</button>

                            <button type="button" class="op-btn" data-k="4">4</button>
                            <button type="button" class="op-btn" data-k="5">5</button>
                            <button type="button" class="op-btn" data-k="6">6</button>
                            <button type="button" class="op-btn op-op" data-k="-">−</button>

                            <button type="button" class="op-btn" data-k="1">1</button>
                            <button type="button" class="op-btn" data-k="2">2</button>
                            <button type="button" class="op-btn" data-k="3">3</button>
                            <button type="button" class="op-btn op-op" data-k="×">×</button>

                            <button type="button" class="op-btn op-del" data-k="C">C</button>
                            <button type="button" class="op-btn" data-k="0">0</button>
                            <button type="button" class="op-btn op-act" data-k="OK">↵</button>
                            <button type="button" class="op-btn op-op" data-k=":">:</button>
                        </div>
                    </div>
                </div>

                <div id="op-start" class="op-overlay">
                    <h2>Operiamo!</h2>
                    <p>Hai <b>90 secondi</b> per risolvere più operazioni possibile, trovando l'elemento mancante.</p>
                    <button type="button" class="op-lv op-lv0" data-lv="0"><b>Principiante</b><span>Numeri piccoli: somme e sottrazioni fino a 20, tabelline fino a 5.</span></button>
                    <button type="button" class="op-lv op-lv1" data-lv="1"><b>Esperto</b><span>Numeri fino a 40 e tabelline fino a 10.</span></button>
                </div>

                <div id="op-end" class="op-overlay" style="display:none;">
                    <h2>Tempo Scaduto!</h2>
                    <p>Punteggio: <strong id="op-final" style="font-size:1.4rem; color:#4ade80;">0</strong></p>
                    <div id="op-endmsg"></div>
                    <div id="op-errsec" style="width:100%; display:none;">
                        <p style="font-size:0.9rem; text-align:left;">Rivedi gli errori commessi:</p>
                        <div class="op-errors" id="op-errlist"></div>
                    </div>
                    <div class="op-endbtns">
                        <button type="button" class="btn-start" id="op-again">Gioca ancora</button>
                        <button type="button" class="btn-start op-alt" id="op-change">Scegli livello</button>
                    </div>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-7');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-7';
        styleCart.innerHTML = `
            #op-root { position: relative; width: 100%; height: 100%; background: #000; color: #fff; font-family: Arial, sans-serif; }
            #op-container { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 6px; box-sizing: border-box; overflow: hidden;
                /* l'ultimo valore in basso è la "barra invisibile" che tiene la tastiera lontana dal bordo */
                padding: 6px 8px 14px 8px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }

            /* Tempo e punti qui dentro servono solo in tutto schermo: altrimenti li mostra già la console */
            .op-hud { flex: 0 0 auto; width: 100%; max-width: 900px; margin: 0 auto; box-sizing: border-box;
                display: flex; justify-content: space-between; gap: 8px; background: #1e1e1e; border: 1px solid #2a2a2a;
                border-radius: 10px; padding: 6px 14px; font-weight: bold; font-size: 1.05rem; font-size: clamp(0.85rem, 3vh, 1.2rem); }
            body:not(.is-fullscreen) .op-hud { display: none; }
            .op-v { color: #38bdf8; }
            .op-t { color: #f87171; }
            .op-s { color: #4ade80; }

            #op-main { flex: 1 1 0; min-height: 0; width: 100%; max-width: 900px; margin: 0 auto;
                display: flex; flex-direction: column; gap: 6px; }
            #op-exp { flex: 1 1 0; min-height: 0; background: #18181b; border: 2px solid #3f3f46; border-radius: 12px;
                display: flex; align-items: center; justify-content: center; font-weight: bold; letter-spacing: 2px;
                white-space: nowrap; overflow: hidden; padding: 0 8px; box-sizing: border-box;
                font-size: 2rem; font-size: clamp(1.6rem, 6.5vh, 2.8rem); }
            .op-hole { display: inline-block; min-width: 1.3em; border-bottom: 0.12em solid #38bdf8; color: #38bdf8; text-align: center; line-height: 1.1; }

            /* La dimensione dei numeri sui tasti viene regolata dal codice (adattaTasti) in base all'altezza dei tasti */
            #op-keys { flex: 1.6 1 0; min-height: 0; width: 100%; max-width: 520px; margin: 0 auto;
                display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 8px;
                font-size: 1.4rem; font-size: clamp(1.1rem, 4vh, 1.7rem); }
            .op-btn { width: 100%; height: 100%; padding: 0; margin: 0; background: #27272a; color: #fff; border: none; border-radius: 10px;
                font: inherit; font-weight: bold; line-height: 1; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent;
                display: flex; align-items: center; justify-content: center; overflow: hidden; transition: background 0.1s; }
            .op-btn:active { background: #52525b; }
            .op-op { background: #1e3a8a; color: #93c5fd; }
            .op-op:active { background: #1d4ed8; }
            .op-act { background: #15803d; color: #bbf7d0; }
            .op-act:active { background: #16a34a; }
            .op-del { background: #7f1d1d; color: #fecaca; }
            .op-del:active { background: #991b1b; }

            .op-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.96);
                display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
                padding: 14px; box-sizing: border-box; text-align: center; z-index: 10; overflow-y: auto; }
            .op-overlay h2 { margin: 0; color: #38bdf8; font-size: 2rem; font-size: clamp(1.6rem, 6vh, 2.4rem); letter-spacing: 1px; }
            .op-overlay p { margin: 0; color: #a1a1aa; max-width: 460px; line-height: 1.5; font-size: 1.1rem; font-size: clamp(0.95rem, 2.8vh, 1.2rem); }
            .op-lv { width: 100%; max-width: 420px; border: none; border-radius: 12px; padding: 12px 16px; color: #fff; cursor: pointer;
                display: flex; flex-direction: column; gap: 2px; box-shadow: 0 4px rgba(0,0,0,0.5); touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
            .op-lv b { font-size: 1.3rem; }
            .op-lv span { font-size: 0.88rem; opacity: 0.92; }
            .op-lv:active { transform: translateY(3px); box-shadow: none; }
            .op-lv0 { background: #15803d; }
            .op-lv1 { background: #1d4ed8; }
            #op-endmsg { color: #fde68a; font-weight: bold; max-width: 460px; }
            .op-errors { width: 100%; max-width: 520px; max-height: 38vh; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 6px 12px; box-sizing: border-box; text-align: left; }
            .op-err { font-size: 1rem; padding: 5px 0; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
            .op-err:last-child { border-bottom: none; }
            .op-wrong { color: #f87171; font-weight: bold; margin-right: 8px; }
            .op-lab { color: #a1a1aa; font-size: 0.85rem; margin-right: 4px; }
            .op-right { color: #4ade80; font-weight: bold; }
            .op-endbtns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
            .op-overlay .btn-start { background: #0284c7; box-shadow: 0 4px #075985; }
            .op-overlay .btn-start.op-alt { background: #52525b; box-shadow: 0 4px #3f3f46; }

            /* Schermo più largo che alto (telefono in orizzontale, PC, lavagna): operazione a sinistra, tastierino a destra */
            @media (orientation: landscape) {
                #op-main { flex-direction: row; gap: 8px; }
                #op-exp { flex: 1 1 0; }
                #op-keys { flex: 1 1 0; max-width: none; margin: 0; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== GENERATORI DI OPERAZIONI =====================
        const rnd = function(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };

        // ESPERTO: numeri fino a 40, tabelline fino a 10 (come nel gioco originale)
        function genEsperto() {
            const op = OPS[rnd(0, 3)];
            let a, b, res;
            if (op === '+') {
                res = rnd(0, 40);
                a = rnd(0, res);
                b = res - a;
            } else if (op === '-') {
                const somma = rnd(0, 40);
                const x = rnd(0, somma);
                a = somma;
                b = x;
                res = somma - x;
            } else if (op === '×') {
                a = rnd(0, 10);
                b = rnd(0, 10);
                res = a * b;
            } else {
                b = rnd(1, 10);
                const m = rnd(0, 10);
                a = b * m;
                res = m;
            }
            return { a: a, op: op, b: b, res: res, holeType: rnd(0, 3) };
        }

        // PRINCIPIANTE: somme e sottrazioni fino a 20, tabelline fino a 5, niente zeri
        function genPrincipiante() {
            const r = Math.random();
            const op = r < 0.30 ? '+' : r < 0.60 ? '-' : r < 0.80 ? '×' : ':';
            let a, b, res;
            if (op === '+') {
                res = rnd(2, 20);
                a = rnd(1, res - 1);
                b = res - a;
            } else if (op === '-') {
                a = rnd(2, 20);
                b = rnd(1, a - 1);
                res = a - b;
            } else if (op === '×') {
                a = rnd(2, 5);
                b = rnd(2, 5);
                res = a * b;
            } else {
                b = rnd(2, 5);
                const q = rnd(2, 5);
                a = b * q;
                res = q;
            }
            // l'elemento mancante è più spesso il risultato; l'operatore è il caso più raro
            const h = Math.random();
            const holeType = h < 0.40 ? 3 : h < 0.62 ? 0 : h < 0.85 ? 2 : 1;
            return { a: a, op: op, b: b, res: res, holeType: holeType };
        }

        // Controlla la risposta. Restituisce { ok, corretta } (per l'operatore si accettano tutti quelli validi)
        function controlla(p, inputStr) {
            const a = p.a, b = p.b, res = p.res, op = p.op, h = p.holeType;
            const u = parseInt(inputStr, 10);
            let ok = false;
            let corretta = "";
            if (h === 0) {
                corretta = a;
                if (op === '+' && u + b === res) ok = true;
                if (op === '-' && u - b === res) ok = true;
                if (op === '×' && u * b === res) ok = true;
                if (op === ':' && b !== 0 && u / b === res) ok = true;
            } else if (h === 2) {
                corretta = b;
                if (op === '+' && a + u === res) ok = true;
                if (op === '-' && a - u === res) ok = true;
                if (op === '×' && a * u === res) ok = true;
                if (op === ':' && u !== 0 && a / u === res) ok = true;
            } else if (h === 3) {
                corretta = res;
                if (op === '+' && a + b === u) ok = true;
                if (op === '-' && a - b === u) ok = true;
                if (op === '×' && a * b === u) ok = true;
                if (op === ':' && b !== 0 && a / b === u) ok = true;
            } else {
                const valide = [];
                if (a + b === res) valide.push('+');
                if (a - b === res) valide.push('-');
                if (a * b === res) valide.push('×');
                if (b !== 0 && a / b === res) valide.push(':');
                corretta = valide.join(" oppure ");
                if (valide.indexOf(inputStr) !== -1) ok = true;
            }
            return { ok: ok, corretta: corretta };
        }

        // ===================== AUDIO =====================
        let audioCtx = null;
        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function nota(freq, inizio, durata, tipo, volume) {
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
        function suonoGiusto() {
            nota(523.25, 0, 0.12, 'sine', 0.1);
            nota(659.25, 0.1, 0.12, 'sine', 0.1);
            nota(783.99, 0.2, 0.2, 'sine', 0.1);
        }
        function suonoErrore() {
            nota(150, 0, 0.15, 'sawtooth', 0.15);
            nota(100, 0.15, 0.15, 'sawtooth', 0.15);
        }
        function suonoFinale() {
            [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach(function(f, i) {
                nota(f, [0, 0.12, 0.24, 0.36, 0.48, 0.60, 0.75][i], i === 6 ? 0.6 : 0.1, 'triangle', 0.15);
            });
        }

        // ===================== STATO =====================
        let livello = 0;
        let punti = 0;
        let tempo = DURATA;
        let timerInterval = null;
        let problema = null;
        let ultimo = null;
        let input = "";
        let errori = [];
        let giocoAttivo = false;
        let totale = 0;
        const timeouts = [];

        function schedule(fn, ms) {
            timeouts.push(setTimeout(function() { if (alive) fn(); }, ms));
        }

        function aggiornaConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle(giocoAttivo ? "Operiamo! · " + NOMI_LIVELLO[livello] : "Operiamo!");
                window.UGOConsole.setScore(punti);
                if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Tempo");
                window.UGOConsole.setTimer(Math.max(0, tempo) + "s");
            }
        }

        // I numeri sui tasti si adattano all'altezza reale dei tasti
        function adattaTasti() {
            const k = document.getElementById("op-keys");
            if (!k) return;
            const r = k.getBoundingClientRect();
            if (!r.height || !r.width) return;
            const keyH = (r.height - 24) / 4;
            const keyW = (r.width - 24) / 4;
            const f = Math.max(11, Math.min(32, keyH * 0.5, keyW * 0.5));
            k.style.fontSize = f.toFixed(1) + "px";
        }

        // L'operazione si rimpicciolisce se non entra nella larghezza
        function adattaOperazione() {
            const box = document.getElementById("op-exp");
            const inner = document.getElementById("op-expin");
            if (!box || !inner) return;
            box.style.fontSize = "";
            const fs = parseFloat(window.getComputedStyle(box).fontSize) || 32;
            const disp = box.clientWidth - 20;
            const w = inner.scrollWidth;
            if (w > disp && disp > 0) box.style.fontSize = Math.max(14, fs * disp / w).toFixed(1) + "px";
        }

        function mostraProblema() {
            const p = problema;
            const val = input !== "" ? input : "?";
            const buco = '<span class="op-hole">' + val + '</span>';
            const fmt = function(x) { return x === '-' ? '−' : x; };
            const parti = [
                p.holeType === 0 ? buco : p.a,
                p.holeType === 1 ? buco : fmt(p.op),
                p.holeType === 2 ? buco : p.b,
                '=',
                p.holeType === 3 ? buco : p.res
            ];
            document.getElementById("op-expin").innerHTML = parti.join(" ");
            adattaOperazione();
        }

        function prossimoProblema() {
            input = "";
            let p = null;
            for (let i = 0; i < 50; i++) {
                p = livello === 0 ? genPrincipiante() : genEsperto();
                if (!ultimo || p.a !== ultimo.a || p.b !== ultimo.b || p.op !== ultimo.op || p.holeType !== ultimo.holeType) break;
            }
            problema = p;
            ultimo = p;
            mostraProblema();
        }

        // ===================== FLUSSO =====================
        function avviaPartita(lv) {
            initAudio();
            livello = lv;
            punti = 0;
            tempo = DURATA;
            totale = 0;
            errori = [];
            ultimo = null;
            giocoAttivo = true;
            document.getElementById("op-liv").textContent = NOMI_LIVELLO[lv];
            document.getElementById("op-score").textContent = 0;
            document.getElementById("op-timer").textContent = tempo;
            document.getElementById("op-start").style.display = "none";
            document.getElementById("op-end").style.display = "none";
            aggiornaConsole();
            prossimoProblema();
            adattaTasti();
            schedule(adattaTasti, 80);
            schedule(adattaTasti, 500);

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                tempo--;
                document.getElementById("op-timer").textContent = Math.max(0, tempo);
                aggiornaConsole();
                if (tempo <= 0) finePartita();
            }, 1000);
        }

        function finePartita() {
            giocoAttivo = false;
            clearInterval(timerInterval);
            aggiornaConsole();
            document.getElementById("op-final").textContent = punti;
            suonoFinale();

            let msg = "";
            if (livello === 0 && punti >= 20 && errori.length <= 2) {
                msg = "Bel lavoro! Vuoi provare il livello Esperto?";
            } else if (livello === 1 && punti <= 8) {
                msg = "Se ti va, puoi provare il livello Principiante: ha numeri più piccoli.";
            }
            document.getElementById("op-endmsg").textContent = msg;

            const sec = document.getElementById("op-errsec");
            const lista = document.getElementById("op-errlist");
            lista.innerHTML = "";
            if (errori.length > 0) {
                sec.style.display = "block";
                errori.forEach(function(e) {
                    const d = document.createElement("div");
                    d.className = "op-err";
                    d.innerHTML = '<span>' + e.testo + '</span><span><span class="op-wrong">' + e.data + '</span>' +
                                  '<span class="op-lab">risultato corretto:</span><span class="op-right">' + e.corretta + '</span></span>';
                    lista.appendChild(d);
                });
            } else {
                sec.style.display = "none";
            }
            document.getElementById("op-end").style.display = "flex";
        }

        // ===================== INPUT =====================
        function premi(ch) {
            if (!giocoAttivo || !problema) return;
            initAudio();
            if (ch === "OK") { conferma(); return; }
            if (ch === "C") { input = ""; mostraProblema(); return; }
            if (ch === "BACK") { input = input.slice(0, -1); mostraProblema(); return; }
            if (problema.holeType === 1) {
                if (OPS.indexOf(ch) !== -1) { input = ch; mostraProblema(); }
            } else if (ch >= '0' && ch <= '9' && ch.length === 1) {
                if (input.length < 3) { input += ch; mostraProblema(); }
            }
        }

        function conferma() {
            if (!giocoAttivo || input === "") return;
            const r = controlla(problema, input);
            totale++;
            if (r.ok) {
                punti++;
                document.getElementById("op-score").textContent = punti;
                aggiornaConsole();
                suonoGiusto();
            } else {
                suonoErrore();
                const p = problema, h = p.holeType;
                const fmt = function(x) { return x === '-' ? '−' : x; };
                errori.push({
                    testo: (h === 0 ? '?' : p.a) + ' ' + (h === 1 ? '?' : fmt(p.op)) + ' ' + (h === 2 ? '?' : p.b) + ' = ' + (h === 3 ? '?' : p.res),
                    data: input === '-' ? '−' : input,
                    corretta: String(r.corretta).replace(/-/g, '−')
                });
            }
            prossimoProblema();
        }

        document.getElementById("op-keys").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (b) premi(b.getAttribute("data-k"));
        });
        document.getElementById("op-start").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (b && b.getAttribute("data-lv") !== null) avviaPartita(parseInt(b.getAttribute("data-lv"), 10));
        });
        document.getElementById("op-again").addEventListener("click", function() { avviaPartita(livello); });
        document.getElementById("op-change").addEventListener("click", function() {
            document.getElementById("op-end").style.display = "none";
            document.getElementById("op-start").style.display = "flex";
        });

        const aggiusta = function() { adattaTasti(); adattaOperazione(); };
        window.addEventListener('resize', aggiusta);
        window.addEventListener('orientationchange', aggiusta);

        // Tastiera fisica
        if (window.__opKeyHandler) window.removeEventListener('keydown', window.__opKeyHandler);
        window.__opKeyHandler = function(e) {
            if (!alive || !giocoAttivo || !document.getElementById('op-container')) return;
            const k = e.key;
            if (k >= '0' && k <= '9' && k.length === 1) premi(k);
            else if (k === '+' || k === '-') premi(k);
            else if (k === '*' || k === 'x' || k === 'X') premi('×');
            else if (k === '/' || k === ':') premi(':');
            else if (k === 'Enter') premi('OK');
            else if (k === 'Backspace') premi('BACK');
            else if (k === 'Delete' || k === 'c' || k === 'C') premi('C');
            else return;
            e.preventDefault();
        };
        window.addEventListener('keydown', window.__opKeyHandler);

        // Pulizia quando si esce dal gioco (tasto Menu della console)
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoAttivo = false;
                if (timerInterval) clearInterval(timerInterval);
                timeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('keydown', window.__opKeyHandler);
                window.removeEventListener('resize', aggiusta);
                window.removeEventListener('orientationchange', aggiusta);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-7');
                if (st) st.remove();
            });
        }

        aggiornaConsole();
        // __TEST_HOOK__
    }
});

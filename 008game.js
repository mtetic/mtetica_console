// --- CARTUCCIA 008: DIVISIBILITÀ EXTREMA ---

window.UGOConsole.registerCartridge({
    id: 8,
    titolo: "8. Divisibilità Extrema",
    colore: "#0284c7",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        const TOTAL_SETS = 2;      // due gruppi di numeri
        const PER_SET = 8;         // numeri per gruppo
        const BAND = 38;           // spessore delle fasce colorate sui bordi (px)
        const DIVS = [2, 3, 4, 5, 7, 11];
        const POINTS = { 2: 1, 3: 3, 4: 2, 5: 1, 7: 5, 11: 5 };
        const COME = {
            2: "trascinandolo a destra (÷2)", 3: "trascinandolo in basso (÷3)", 4: "trascinandolo a sinistra (÷4)",
            5: "trascinandolo in alto (÷5)", 7: "con il doppio tap (÷7)", 11: "con il tap prolungato (÷11)"
        };

        slot.innerHTML = `
            <div id="d08-root">
                <div id="d08-container">
                    <!-- Tempo/punti: si vedono solo in tutto schermo (altrimenti li mostra la console) -->
                    <div class="d08-hud">
                        <div>Gruppo: <span id="d08-set" class="d08-v">1/${TOTAL_SETS}</span></div>
                        <div>Punti: <span id="d08-pt" class="d08-g">0</span></div>
                    </div>

                    <!-- Promemoria in alto -->
                    <div id="d08-prompts">
                        <span>Per il 7: doppio tap</span>
                        <span>Per l'11: tap prolungato</span>
                        <button type="button" id="d08-snd" aria-label="Musica">&#128266;</button>
                    </div>

                    <!-- Area di gioco con le quattro fasce colorate sui bordi -->
                    <div id="d08-playfield">
                        <div class="d08-zone d08-top" data-div="5"><span>÷ 5 &nbsp;·&nbsp; 1 pt</span></div>
                        <div class="d08-zone d08-bottom" data-div="3"><span>÷ 3 &nbsp;·&nbsp; 3 pt</span></div>
                        <div class="d08-zone d08-left" data-div="4"><span>÷ 4 &nbsp;·&nbsp; 2 pt</span></div>
                        <div class="d08-zone d08-right" data-div="2"><span>÷ 2 &nbsp;·&nbsp; 1 pt</span></div>
                    </div>
                </div>

                <!-- Istruzioni iniziali -->
                <div id="d08-start-overlay" class="d08-overlay">
                    <h2>Divisibilità Extrema</h2>
                    <p>Ogni numero è divisibile per <b>almeno uno</b> tra 2, 3, 4, 5, 7 e 11. Scopri per quale e smistalo!</p>
                    <ul class="d08-rules">
                        <li><span class="d08-dot" style="background:#22c55e;"></span><b>÷ 2</b> &nbsp;trascinalo <b>a destra</b> &nbsp;➔ <b>1 punto</b></li>
                        <li><span class="d08-dot" style="background:#eab308;"></span><b>÷ 3</b> &nbsp;trascinalo <b>in basso</b> &nbsp;➔ <b>3 punti</b></li>
                        <li><span class="d08-dot" style="background:#a855f7;"></span><b>÷ 4</b> &nbsp;trascinalo <b>a sinistra</b> &nbsp;➔ <b>2 punti</b></li>
                        <li><span class="d08-dot" style="background:#dc2626;"></span><b>÷ 5</b> &nbsp;trascinalo <b>in alto</b> &nbsp;➔ <b>1 punto</b></li>
                        <li><span class="d08-dot" style="background:#38bdf8;"></span><b>÷ 7</b> &nbsp;<b>doppio tap</b> sul numero (doppio clic col mouse) &nbsp;➔ <b>5 punti</b></li>
                        <li><span class="d08-dot" style="background:#f472b6;"></span><b>÷ 11</b> &nbsp;<b>tap prolungato</b>: tieni premuto un attimo &nbsp;➔ <b>5 punti</b></li>
                    </ul>
                    <p class="d08-small">Trascina il numero fino a farlo entrare nella fascia colorata. Se un numero ha <b>più divisori</b>, conta quello che scegli: punta al più redditizio!
                    Se sbagli non perdi punti: ne fai 0. Ci sono <b>${TOTAL_SETS} gruppi da ${PER_SET} numeri</b>. Alla fine trovi il report con tutti i divisori.</p>
                    <button type="button" class="btn-start" id="d08-btn-start">INIZIA LA SFIDA</button>
                </div>

                <!-- Fine partita e report -->
                <div id="d08-end-overlay" class="d08-overlay" style="display:none;">
                    <h2>Sfida conclusa!</h2>
                    <p>Punteggio totale: <span id="d08-final-score" style="color:#22c55e; font-weight:bold; font-size:1.3em;">0</span></p>
                    <div id="d08-report-container"></div>
                    <button type="button" class="btn-start" id="d08-btn-again">GIOCA ANCORA</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-8');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-8';
        styleCart.innerHTML = `
            #d08-root { position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: #0f172a; color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow: hidden; box-sizing: border-box; }
            #d08-container { position: absolute; top: 0; right: 0; bottom: 0; left: 0; display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column; box-sizing: border-box;
                /* l'ultimo valore in basso è la fascia di respiro: tiene il campo lontano dal bordo */
                padding: 6px 6px 14px 6px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }

            .d08-hud { flex: 0 0 auto; display: flex; justify-content: space-between; background: #1e293b; border: 1px solid #334155;
                border-radius: 8px; padding: 5px 12px; margin-bottom: 6px; font-weight: bold; }
            body:not(.is-fullscreen) .d08-hud { display: none; }
            .d08-v { color: #38bdf8; }
            .d08-g { color: #22c55e; }

            #d08-prompts { flex: 0 0 auto; display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
                background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 4px 6px;
                font-size: 0.9rem; font-size: clamp(0.75rem, 2.4vh, 1rem); font-weight: bold; color: #fbbf24; }
            #d08-prompts span { margin: 2px 8px; }
            #d08-snd { background: #334155; border: none; border-radius: 8px; color: #fff; font-size: 1rem; padding: 3px 10px;
                cursor: pointer; margin: 2px 4px; touch-action: manipulation; }

            #d08-playfield { position: relative; -webkit-flex: 1 1 0px; flex: 1 1 0px; min-height: 0; margin-top: 6px; background: #111827;
                border: 2px solid #334155; border-radius: 12px; overflow: hidden; touch-action: none; }

            .d08-zone { position: absolute; display: flex; align-items: center; justify-content: center; font-weight: bold;
                font-size: 0.85rem; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.9); z-index: 1; pointer-events: none;
                opacity: 0.9; box-sizing: border-box; transition: opacity 0.1s, box-shadow 0.1s; white-space: nowrap; }
            .d08-zone.hot { opacity: 1; box-shadow: inset 0 0 26px rgba(255,255,255,0.85); }
            .d08-top { top: 0; left: 0; right: 0; height: ${BAND}px; background: rgba(220, 38, 38, 0.55); border-bottom: 3px solid #dc2626; }
            .d08-bottom { bottom: 0; left: 0; right: 0; height: ${BAND}px; background: rgba(234, 179, 8, 0.55); border-top: 3px solid #eab308; }
            .d08-left { top: ${BAND}px; bottom: ${BAND}px; left: 0; width: ${BAND}px; background: rgba(168, 85, 247, 0.55); border-right: 3px solid #a855f7; }
            .d08-right { top: ${BAND}px; bottom: ${BAND}px; right: 0; width: ${BAND}px; background: rgba(34, 197, 94, 0.55); border-left: 3px solid #22c55e; }
            .d08-left span, .d08-right span { -webkit-writing-mode: vertical-rl; writing-mode: vertical-rl; }
            .d08-left span { -webkit-transform: rotate(180deg); transform: rotate(180deg); }

            .d08-num { position: absolute; background: #334155; border: 2px solid #64748b; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; cursor: grab;
                -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; touch-action: none; z-index: 5;
                box-shadow: 0 4px 6px rgba(0,0,0,0.35); box-sizing: border-box; line-height: 1; }
            .d08-num.dragging { z-index: 10; background: #0284c7; border-color: #38bdf8; cursor: grabbing; }
            .d08-num.charging { border-color: #f472b6; -webkit-animation: d08-charge 0.45s linear forwards; animation: d08-charge 0.45s linear forwards; }
            .d08-num.ok { -webkit-animation: d08-pop 0.45s ease-out forwards; animation: d08-pop 0.45s ease-out forwards; background: #16a34a; border-color: #4ade80; }
            .d08-num.ko { -webkit-animation: d08-shake 0.45s ease-out forwards; animation: d08-shake 0.45s ease-out forwards; background: #b91c1c; border-color: #f87171; }
            @-webkit-keyframes d08-charge { from { box-shadow: 0 0 0 0 rgba(244,114,182,0); } to { box-shadow: 0 0 0 12px rgba(244,114,182,0.9); } }
            @keyframes d08-charge { from { box-shadow: 0 0 0 0 rgba(244,114,182,0); } to { box-shadow: 0 0 0 12px rgba(244,114,182,0.9); } }
            @-webkit-keyframes d08-pop { 0% { opacity: 1; -webkit-transform: scale(1); } 100% { opacity: 0; -webkit-transform: scale(1.6); } }
            @keyframes d08-pop { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
            @-webkit-keyframes d08-shake { 0% { -webkit-transform: translateX(0); } 20% { -webkit-transform: translateX(-8px); } 40% { -webkit-transform: translateX(8px); } 60% { -webkit-transform: translateX(-6px); } 100% { opacity: 0; -webkit-transform: translateX(0); } }
            @keyframes d08-shake { 0% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-6px); } 100% { opacity: 0; transform: translateX(0); } }

            .d08-float { position: absolute; z-index: 12; font-weight: 800; font-size: 1.5rem; pointer-events: none;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8); -webkit-animation: d08-up 0.9s ease-out forwards; animation: d08-up 0.9s ease-out forwards; }
            @-webkit-keyframes d08-up { from { opacity: 1; -webkit-transform: translateY(0); } to { opacity: 0; -webkit-transform: translateY(-46px); } }
            @keyframes d08-up { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-46px); } }

            .d08-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.97);
                display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 20;
                padding: 14px; text-align: center; box-sizing: border-box; overflow-y: auto; }
            .d08-overlay h2 { color: #38bdf8; font-size: 1.9rem; font-size: clamp(1.5rem, 5vh, 2.2rem); margin: 0 0 8px 0; }
            .d08-overlay p { color: #94a3b8; font-size: 1rem; font-size: clamp(0.9rem, 2.6vh, 1.1rem); margin: 0 0 8px 0; max-width: 520px; line-height: 1.4; }
            .d08-overlay p.d08-small { font-size: 0.85rem; color: #cbd5e1; }
            .d08-rules { list-style: none; margin: 0 0 8px 0; text-align: left; background: rgba(30,41,59,0.85);
                padding: 10px 14px; border-radius: 8px; font-size: 0.95rem; font-size: clamp(0.82rem, 2.4vh, 1rem); color: #e2e8f0; max-width: 520px; }
            .d08-rules li { margin-bottom: 6px; line-height: 1.3; }
            .d08-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
            .d08-overlay .btn-start { background: #0284c7; box-shadow: 0 4px #075985; margin-top: 6px; }

            #d08-report-container { width: 100%; max-width: 560px; max-height: 50%; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(30,41,59,0.85); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; text-align: left;
                font-size: 0.88rem; color: #cbd5e1; line-height: 1.4; box-sizing: border-box; }
            .d08-rep-head { font-size: 1rem; margin-bottom: 6px; color: #f8fafc; }
            .d08-rep-title { font-weight: bold; margin: 8px 0 4px 0; }
            .d08-rep-title.err { color: #f87171; }
            .d08-rep-title.meglio { color: #fbbf24; }
            .d08-rep-title.pari { color: #38bdf8; }
            .d08-rep-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 6px; }
            .d08-rep-item b.n { font-size: 1.15em; color: #fff; }
            .d08-okmsg { color: #4ade80; font-weight: bold; }
        `;
        document.head.appendChild(styleCart);

        const pf = document.getElementById('d08-playfield');

        // ===================== UTILITÀ =====================
        const rnd = function(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
        function shuffle(a) {
            const r = a.slice();
            for (let i = r.length - 1; i > 0; i--) { const j = rnd(0, i); const t = r[i]; r[i] = r[j]; r[j] = t; }
            return r;
        }
        function getDivisors(n) {
            const d = [];
            for (let i = 0; i < DIVS.length; i++) if (n % DIVS[i] === 0) d.push(DIVS[i]);
            return d;
        }
        function puntiTxt(n) { return n + (n === 1 ? " punto" : " punti"); }
        function divTxt(list) { return list.map(function(d) { return "÷" + d; }).join(" o "); }

        // Un gruppo di 8 numeri: tutti tra 6 e 1000, ciascuno divisibile per almeno un divisore.
        // Ci sono sempre multipli di 11, di 7, di 3, di 4, di 5, di 2, un numero con più divisori e uno qualsiasi.
        function multiploDi(d, usati) {
            const lo = Math.ceil(6 / d), hi = Math.floor(1000 / d);
            for (let t = 0; t < 300; t++) {
                const n = d * rnd(lo, hi);
                if (!usati[n]) return n;
            }
            return d * rnd(lo, hi);
        }
        function generaGruppo(usati) {
            const slot = [11, 7, 3, 4, 5, 2, 'multi', 'qualsiasi'];
            const out = [];
            slot.forEach(function(s) {
                let n = 0;
                if (s === 'multi') {
                    for (let t = 0; t < 300; t++) {
                        n = multiploDi(DIVS[rnd(0, DIVS.length - 1)], usati);
                        if (getDivisors(n).length >= 2 && !usati[n]) break;
                    }
                } else if (s === 'qualsiasi') {
                    for (let t = 0; t < 300; t++) {
                        n = rnd(6, 1000);
                        if (getDivisors(n).length > 0 && !usati[n]) break;
                    }
                } else {
                    n = multiploDi(s, usati);
                }
                usati[n] = true;
                out.push(n);
            });
            return shuffle(out);
        }

        // ===================== AUDIO =====================
        let audioCtx = null;
        let musicOn = true;
        let musicTimer = null;
        let musicStep = 0;

        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
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
        // Quattro suoni di successo diversi: 1, 2, 3 e 5 punti
        function suonoPunti(p) {
            if (!audioCtx) return;
            const t = audioCtx.currentTime;
            if (p === 1) {            // un "blip" dolce che sale
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.setValueAtTime(440, t);
                o.frequency.exponentialRampToValueAtTime(660, t + 0.15);
                g.gain.setValueAtTime(0.16, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(t); o.stop(t + 0.24);
            } else if (p === 2) {     // due note brillanti
                tono(523.25, 0, 0.15, 'triangle', 0.16);
                tono(659.25, 0.1, 0.22, 'triangle', 0.16);
            } else if (p === 3) {     // tre note in salita, tono "da gioco"
                tono(587.33, 0, 0.12, 'square', 0.09);
                tono(739.99, 0.09, 0.12, 'square', 0.09);
                tono(880.00, 0.18, 0.25, 'square', 0.09);
            } else {                  // 5 punti: piccola fanfara a quattro note
                [523.25, 659.25, 783.99, 1046.50].forEach(function(f, i) { tono(f, i * 0.07, 0.22, 'square', 0.11); });
                tono(1318.51, 0.3, 0.35, 'triangle', 0.12);
            }
        }
        function suonoBuzz() {
            tono(130, 0, 0.28, 'sawtooth', 0.2);
            tono(98, 0.1, 0.22, 'sawtooth', 0.16);
        }

        // Musichetta rilassante: arpeggi dolci su quattro accordi (Do, La minore, Fa, Sol)
        const ACCORDI = [[261.63, 329.63, 392.00, 523.25], [220.00, 261.63, 329.63, 440.00], [174.61, 220.00, 261.63, 349.23], [196.00, 246.94, 293.66, 392.00]];
        const BASSI = [130.81, 110.00, 87.31, 98.00];
        const SCHEMA = [0, 1, 2, 3, 2, 1, 2, 1];
        function notaMorbida(freq, durata, tipo, vol) {
            if (!audioCtx) return;
            const t = audioCtx.currentTime;
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = tipo;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(vol, t + 0.06);
            g.gain.exponentialRampToValueAtTime(0.0008, t + durata);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(t); o.stop(t + durata + 0.05);
        }
        function fermaMusica() {
            if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
        }
        function avviaMusica() {
            fermaMusica();
            if (!audioCtx) return;
            musicStep = 0;
            musicTimer = setInterval(function() {
                if (!alive || !gameActive || !musicOn || !audioCtx) return;
                const ci = Math.floor(musicStep / 8) % ACCORDI.length;
                notaMorbida(ACCORDI[ci][SCHEMA[musicStep % 8]], 1.6, 'sine', 0.03);
                if (musicStep % 8 === 0) notaMorbida(BASSI[ci], 3.4, 'triangle', 0.035);
                musicStep++;
            }, 550);
        }

        // ===================== STATO =====================
        let gameActive = false;
        let score = 0;
        let currentSet = 1;
        let usati = {};
        let items = [];          // i numeri sullo schermo
        let remaining = 0;       // quanti ne restano da smistare in questo gruppo
        let records = [];        // tutte le scelte fatte (per il report)
        let numSize = 60;
        let active = null;       // il numero che si sta toccando/trascinando
        let lastTap = null;
        const timeouts = [];

        function schedule(fn, ms) {
            timeouts.push(setTimeout(function() { if (alive) fn(); }, ms));
        }

        function updateConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Divisibilità Extrema");
                window.UGOConsole.setScore(score);
                if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Gruppo");
                window.UGOConsole.setTimer(currentSet + "/" + TOTAL_SETS);
            }
            document.getElementById('d08-set').textContent = currentSet + "/" + TOTAL_SETS;
            document.getElementById('d08-pt').textContent = score;
        }

        // ===================== NUMERI SULLO SCHERMO =====================
        function posiziona(item) {
            item.el.style.left = (item.cx - numSize / 2) + 'px';
            item.el.style.top = (item.cy - numSize / 2) + 'px';
        }

        function creaGruppo() {
            const nums = generaGruppo(usati);
            const W = pf.clientWidth, H = pf.clientHeight;
            const innerW = Math.max(60, W - 2 * BAND), innerH = Math.max(60, H - 2 * BAND);
            numSize = Math.max(40, Math.min(66, Math.floor(Math.sqrt((innerW * innerH) / (PER_SET * 2.6)))));
            const m = numSize / 2 + 6;
            const x0 = BAND + m, x1 = Math.max(x0 + 1, W - BAND - m);
            const y0 = BAND + m, y1 = Math.max(y0 + 1, H - BAND - m);

            items = [];
            nums.forEach(function(v) {
                let cx = 0, cy = 0, minD = numSize + 12, ok = false;
                for (let giro = 0; giro < 6 && !ok; giro++) {
                    for (let t = 0; t < 60 && !ok; t++) {
                        cx = rnd(Math.round(x0), Math.round(x1));
                        cy = rnd(Math.round(y0), Math.round(y1));
                        ok = true;
                        for (let i = 0; i < items.length; i++) {
                            if (Math.sqrt(Math.pow(items[i].cx - cx, 2) + Math.pow(items[i].cy - cy, 2)) < minD) { ok = false; break; }
                        }
                    }
                    minD *= 0.85;
                }
                const el = document.createElement('div');
                el.className = 'd08-num';
                el.textContent = v;
                el.style.width = numSize + 'px';
                el.style.height = numSize + 'px';
                el.style.fontSize = Math.round(numSize * 0.36) + 'px';
                const item = { val: v, el: el, cx: cx, cy: cy, done: false };
                el._item = item;
                posiziona(item);
                pf.appendChild(el);
                items.push(item);
            });
            remaining = items.length;
            updateConsole();
        }

        // ===================== SCELTA E PUNTEGGIO =====================
        function risolvi(item, scelta) {
            if (item.done || !gameActive) return;
            item.done = true;
            const divs = getDivisors(item.val);
            const ok = divs.indexOf(scelta) !== -1;
            const pts = ok ? POINTS[scelta] : 0;
            let best = 0;
            divs.forEach(function(d) { if (POINTS[d] > best) best = POINTS[d]; });
            const bestDivs = divs.filter(function(d) { return POINTS[d] === best; });
            records.push({ val: item.val, scelta: scelta, pts: pts, divs: divs, best: best, bestDivs: bestDivs });

            score += pts;
            if (ok) suonoPunti(pts); else suonoBuzz();

            item.el.classList.remove('dragging', 'charging');
            item.el.classList.add(ok ? 'ok' : 'ko');
            const fl = document.createElement('div');
            fl.className = 'd08-float';
            fl.textContent = ok ? "+" + pts : "0";
            fl.style.color = ok ? "#4ade80" : "#f87171";
            fl.style.left = (item.cx - 10) + 'px';
            fl.style.top = (item.cy - numSize / 2 - 6) + 'px';
            pf.appendChild(fl);
            schedule(function() { if (item.el.parentNode) item.el.parentNode.removeChild(item.el); }, 460);
            schedule(function() { if (fl.parentNode) fl.parentNode.removeChild(fl); }, 950);

            remaining--;
            updateConsole();
            if (remaining <= 0) {
                schedule(function() {
                    if (currentSet >= TOTAL_SETS) { fineGioco(); }
                    else { currentSet++; creaGruppo(); }
                }, 900);
            }
        }

        // ===================== GESTI: trascinamento, doppio tap, tap prolungato =====================
        function trovaNumero(target) {
            let n = target;
            while (n && n !== pf) {
                if (n.classList && n.classList.contains('d08-num')) return n;
                n = n.parentNode;
            }
            return null;
        }

        function zonaSotto(cx, cy) {
            const W = pf.clientWidth, H = pf.clientHeight;
            const cand = [[5, BAND - cy], [3, cy - (H - BAND)], [4, BAND - cx], [2, cx - (W - BAND)]];
            let best = null, bd = 6; // il centro deve entrare nella fascia di almeno qualche pixel
            cand.forEach(function(c) { if (c[1] > bd) { bd = c[1]; best = c[0]; } });
            return best;
        }

        function evidenziaZona(d) {
            const zs = pf.querySelectorAll ? pf.querySelectorAll('.d08-zone') : [];
            for (let i = 0; i < zs.length; i++) {
                const on = String(d) === zs[i].getAttribute('data-div');
                if (on) zs[i].classList.add('hot'); else zs[i].classList.remove('hot');
            }
        }

        function pulisciTimer(a) {
            if (a.chargeT) { clearTimeout(a.chargeT); a.chargeT = null; }
            if (a.pressT) { clearTimeout(a.pressT); a.pressT = null; }
        }

        function inizia(el, x, y, tid) {
            if (!gameActive || active) return;
            const item = el._item;
            if (!item || item.done) return;
            initAudio();
            const a = { item: item, el: el, sx: x, sy: y, cx0: item.cx, cy0: item.cy, moved: false, fired: false, tid: tid, chargeT: null, pressT: null };
            a.chargeT = setTimeout(function() { if (alive && active === a && !a.moved) el.classList.add('charging'); }, 250);
            a.pressT = setTimeout(function() {
                if (alive && active === a && !a.moved && !a.fired) {
                    a.fired = true;
                    risolvi(item, 11); // tap prolungato
                }
            }, 700);
            active = a;
        }

        function muovi(x, y) {
            const a = active;
            if (!a || a.fired) return;
            const dx = x - a.sx, dy = y - a.sy;
            if (!a.moved && Math.sqrt(dx * dx + dy * dy) > 10) {
                a.moved = true;
                pulisciTimer(a);
                a.el.classList.remove('charging');
                a.el.classList.add('dragging');
            }
            if (a.moved) {
                const W = pf.clientWidth, H = pf.clientHeight;
                a.item.cx = Math.max(0, Math.min(W, a.cx0 + dx));
                a.item.cy = Math.max(0, Math.min(H, a.cy0 + dy));
                posiziona(a.item);
                evidenziaZona(zonaSotto(a.item.cx, a.item.cy));
            }
        }

        function termina() {
            const a = active;
            if (!a) return;
            active = null;
            pulisciTimer(a);
            a.el.classList.remove('charging', 'dragging');
            evidenziaZona(null);
            if (a.fired) return;
            if (a.moved) {
                const z = zonaSotto(a.item.cx, a.item.cy);
                if (z !== null) risolvi(a.item, z);
                return;
            }
            // tocco breve: due tocchi ravvicinati sullo stesso numero = doppio tap (÷7)
            const t = Date.now();
            if (lastTap && lastTap.item === a.item && t - lastTap.t < 400) {
                lastTap = null;
                risolvi(a.item, 7);
            } else {
                lastTap = { item: a.item, t: t };
            }
        }

        function annulla() {
            const a = active;
            if (!a) return;
            active = null;
            pulisciTimer(a);
            a.el.classList.remove('charging', 'dragging');
            evidenziaZona(null);
        }

        function trovaTocco(lista, id) {
            for (let i = 0; i < lista.length; i++) if (lista[i].identifier === id) return lista[i];
            return null;
        }

        function onTouchStart(e) {
            if (!gameActive || active) return;
            const el = trovaNumero(e.target);
            if (!el) return;
            e.preventDefault();
            const t = e.changedTouches[0];
            inizia(el, t.clientX, t.clientY, t.identifier);
        }
        function onTouchMove(e) {
            if (!active || active.tid === null) return;
            const t = trovaTocco(e.changedTouches, active.tid);
            if (!t) return;
            e.preventDefault();
            muovi(t.clientX, t.clientY);
        }
        function onTouchEnd(e) {
            if (!active || active.tid === null) return;
            const t = trovaTocco(e.changedTouches, active.tid);
            if (!t) return;
            termina();
        }
        function onTouchCancel(e) {
            if (!active || active.tid === null) return;
            if (trovaTocco(e.changedTouches, active.tid)) annulla();
        }
        function onMouseDown(e) {
            if (e.button !== undefined && e.button !== 0) return;
            const el = trovaNumero(e.target);
            if (!el) return;
            e.preventDefault();
            inizia(el, e.clientX, e.clientY, null);
        }
        function onMouseMove(e) {
            if (!active || active.tid !== null) return;
            muovi(e.clientX, e.clientY);
        }
        function onMouseUp() {
            if (!active || active.tid !== null) return;
            termina();
        }

        pf.addEventListener('touchstart', onTouchStart, { passive: false });
        pf.addEventListener('mousedown', onMouseDown);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchCancel);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        function onResize() {
            if (!gameActive) return;
            const W = pf.clientWidth, H = pf.clientHeight;
            items.forEach(function(it) {
                if (it.done) return;
                it.cx = Math.max(0, Math.min(W, it.cx));
                it.cy = Math.max(0, Math.min(H, it.cy));
                posiziona(it);
            });
        }
        window.addEventListener('resize', onResize);

        // ===================== FLUSSO E REPORT =====================
        function iniziaGioco() {
            initAudio();
            gameActive = true;
            score = 0;
            currentSet = 1;
            usati = {};
            records = [];
            active = null;
            lastTap = null;
            while (pf.querySelector && pf.querySelector('.d08-num, .d08-float')) {
                const x = pf.querySelector('.d08-num, .d08-float');
                x.parentNode.removeChild(x);
            }
            document.getElementById('d08-start-overlay').style.display = 'none';
            document.getElementById('d08-end-overlay').style.display = 'none';
            creaGruppo();
            avviaMusica();
        }

        function fineGioco() {
            gameActive = false;
            fermaMusica();
            document.getElementById('d08-final-score').textContent = score;
            costruisciReport();
            document.getElementById('d08-end-overlay').style.display = 'flex';
            updateConsole();
        }

        function elencoDivisori(divs) {
            return divs.map(function(d) { return d + " (" + POINTS[d] + " pt)"; }).join(", ");
        }

        function costruisciReport() {
            const box = document.getElementById('d08-report-container');
            let max = 0, tot = 0;
            records.forEach(function(r) { max += r.best; tot += r.pts; });
            let h = '<div class="d08-rep-head">Hai fatto <b>' + tot + '</b> punti su <b>' + max + '</b> possibili.</div>';

            const errori = [], meglio = [], pari = [];
            records.forEach(function(r) {
                if (r.pts === 0) errori.push(r);
                else if (r.pts < r.best) meglio.push(r);
                else if (r.bestDivs.length > 1) pari.push(r);
            });

            if (!errori.length && !meglio.length && !pari.length) {
                h += '<div class="d08-okmsg">Perfetto: ogni numero è stato smistato nel modo migliore!</div>';
            }
            const voce = function(r, testo) {
                return '<div class="d08-rep-item"><b class="n">' + r.val + '</b> — ' + testo +
                       '<br>Divisori di ' + r.val + ' tra 2, 3, 4, 5, 7 e 11: <b>' + elencoDivisori(r.divs) + '</b></div>';
            };
            if (errori.length) {
                h += '<div class="d08-rep-title err">Errori (0 punti)</div>';
                errori.forEach(function(r) {
                    h += voce(r, 'lo hai smistato ' + COME[r.scelta] + ', ma ' + r.val + ' non è divisibile per ' + r.scelta +
                              '. Il massimo era ' + puntiTxt(r.best) + ' (' + divTxt(r.bestDivs) + ').');
                });
            }
            if (meglio.length) {
                h += '<div class="d08-rep-title meglio">Si poteva fare di più</div>';
                meglio.forEach(function(r) {
                    h += voce(r, 'lo hai smistato ' + COME[r.scelta] + ' e hai fatto ' + puntiTxt(r.pts) + ', ma con ' + divTxt(r.bestDivs) +
                              ' ne avresti fatti ' + r.best + '.');
                });
            }
            if (pari.length) {
                h += '<div class="d08-rep-title pari">Stesso punteggio anche con un altro divisore</div>';
                pari.forEach(function(r) {
                    const altri = r.bestDivs.filter(function(d) { return d !== r.scelta; });
                    h += voce(r, 'lo hai smistato ' + COME[r.scelta] + ' e hai fatto ' + puntiTxt(r.pts) +
                              '; avresti fatto lo stesso anche con ' + divTxt(altri) + '.');
                });
            }
            box.innerHTML = h;
        }

        // ===================== EVENTI DEI PULSANTI =====================
        document.getElementById('d08-btn-start').addEventListener('click', iniziaGioco);
        document.getElementById('d08-btn-again').addEventListener('click', iniziaGioco);
        document.getElementById('d08-snd').addEventListener('click', function() {
            musicOn = !musicOn;
            this.innerHTML = musicOn ? '&#128266;' : '&#128263;';
        });

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                gameActive = false;
                fermaMusica();
                if (active) pulisciTimer(active);
                active = null;
                timeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
                window.removeEventListener('touchcancel', onTouchCancel);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('resize', onResize);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-8');
                if (st) st.remove();
            });
        }

        updateConsole();
        // __TEST_HOOK__
    }
});

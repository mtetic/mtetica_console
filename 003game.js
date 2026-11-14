// --- CARTUCCIA 003: FRAZIONIAMO??? ---

window.UGOConsole.registerCartridge({
    id: 3,
    titolo: "3. Frazioniamo???",
    colore: "#8b5cf6",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        const TOTAL_EXERCISES = 5;
        let alive = true; // diventa false quando si esce dal gioco

        slot.innerHTML = `
            <div id="fraz-container" style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:15px; position:relative; box-sizing:border-box; background:#0f172a; color:#f8fafc; overflow:hidden; user-select:none; -webkit-user-select:none;">
                <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 20px; border-radius:12px; border:1px solid #334155; flex-shrink:0;">
                    <div>Esercizio: <span id="fraz-num-es" style="color:#38bdf8; font-weight:bold;">1</span></div>
                    <div>Punti Totali: <span id="fraz-score" style="color:#22c55e; font-weight:bold;">0</span></div>
                    <div>Errori (Buzz): <span id="fraz-buzz-count" style="color:#ef4444; font-weight:bold;">0</span></div>
                </div>

                <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:12px; text-align:center; min-height:0;">
                    <div id="fraz-instruction" style="font-size:1.1rem; color:#fbbf24; font-weight:600; min-height:26px; flex-shrink:0;"></div>
                    <div id="fraz-workspace">
                        <div id="fraz-ws-inner"></div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; width:100%; max-width:360px; margin:0 auto; flex-shrink:0;">
                    <button class="fraz-key" onclick="frazPressKey('1')">1</button>
                    <button class="fraz-key" onclick="frazPressKey('2')">2</button>
                    <button class="fraz-key" onclick="frazPressKey('3')">3</button>
                    <button class="fraz-key" style="background:rgba(56,189,248,0.3);" onclick="frazPressKey('+')">+</button>

                    <button class="fraz-key" onclick="frazPressKey('4')">4</button>
                    <button class="fraz-key" onclick="frazPressKey('5')">5</button>
                    <button class="fraz-key" onclick="frazPressKey('6')">6</button>
                    <button class="fraz-key" style="background:rgba(239,68,68,0.3);" onclick="frazPressKey('-')">−</button>

                    <button class="fraz-key" onclick="frazPressKey('7')">7</button>
                    <button class="fraz-key" onclick="frazPressKey('8')">8</button>
                    <button class="fraz-key" onclick="frazPressKey('9')">9</button>
                    <button class="fraz-key" style="background:rgba(220,38,38,0.4);" onclick="frazPressKey('DEL')">←</button>

                    <button class="fraz-key" onclick="frazPressKey('0')" style="grid-column:span 2;">0</button>
                    <button class="fraz-key" style="background:rgba(46,164,79,0.6); grid-column:span 2;" onclick="frazPressKey('ENTER')">INVIO</button>
                </div>
            </div>

            <div id="fraz-start-overlay" class="overlay">
                <h1 style="color:#8b5cf6; font-size:2.8rem; margin-bottom:15px;">Frazioniamo???</h1>
                <p style="color:#94a3b8; font-size:1.1rem; max-width:500px; line-height:1.5; margin-bottom:25px;">
                    Affronta somme algebriche, moltiplicazioni e divisioni tra frazioni passo dopo passo.<br>
                    Meno errori fai, più punti guadagni!
                </p>
                <button class="btn-start" id="fraz-btn-start">INIZIA LA SFIDA</button>
            </div>

            <div id="fraz-end-overlay" class="overlay" style="display:none;">
                <h2 style="color:#38bdf8; font-size:2.5rem; margin-bottom:10px;">Sessione Conclusa!</h2>
                <p style="font-size:1.2rem; color:#94a3b8; margin-bottom:15px;">Punteggio Finale:</p>
                <div id="fraz-final-score" style="font-size:4rem; font-weight:800; color:#22c55e; margin-bottom:25px;">0</div>
                <button class="btn-start" id="fraz-btn-restart">GIOCA ANCORA</button>
            </div>
        `;

        // Stile: lo ricreo ogni volta, così le modifiche si vedono sempre
        const oldStyle = document.getElementById('style-cartuccia-3');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-3';
        styleCart.innerHTML = `
            .overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.95);
                display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:10; padding:20px; text-align:center; }
            .fraz-key { background:rgba(255,255,255,0.12); border:none; border-radius:10px; color:#fff; font-size:1.3rem; font-weight:bold;
                height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.1s; touch-action:manipulation; }
            .fraz-key:active { background:rgba(255,255,255,0.3); }

            #fraz-workspace { width:100%; min-height:150px; display:flex; align-items:center; justify-content:center; overflow:hidden;
                background:rgba(0,0,0,0.3); border:2px solid #334155; border-radius:16px; padding:14px 10px; box-sizing:border-box; }
            #fraz-ws-inner { display:inline-flex; align-items:center; gap:.35em; font-size:1.7rem; font-weight:bold; white-space:nowrap; transform-origin:center; }
            #fraz-workspace.shake { animation: fz-shake .25s; }
            @keyframes fz-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

            .fr { display:inline-flex; flex-direction:column; align-items:center; margin:0 .1em; }
            .fr-n, .fr-d { display:flex; align-items:center; justify-content:center; gap:.45em; padding:.05em .25em; min-height:1.45em; line-height:1.3; }
            .fline { align-self:stretch; height:3px; background:#f8fafc; border-radius:2px; transform-origin:left; }
            .fline.draw { animation: fz-scx .28s ease-out backwards; }
            .sg { margin-right:.05em; }
            .op { margin:0 .15em; }

            .fld { display:inline-flex; align-items:center; justify-content:center; min-width:1.5em; height:1.3em; padding:0 .25em; margin:0 .05em;
                border:2px dashed #475569; border-radius:6px; color:#4ade80; box-sizing:border-box; }
            .fld.ok { border-color:transparent; color:#4ade80; }
            .fld.act { border-color:#fbbf24; color:#fbbf24; animation: blink-glow .8s infinite alternate; }
            @keyframes blink-glow {
                0% { box-shadow:0 0 5px #38bdf8; background:rgba(56,189,248,0.1); }
                100% { box-shadow:0 0 15px #fbbf24; background:rgba(251,191,36,0.3); }
            }

            .par { position:relative; width:.6em; align-self:stretch; margin:0 .05em; }
            .par svg { position:absolute; left:0; top:0; width:100%; height:100%; overflow:visible; }
            .par path, .eq path { fill:none; stroke-linecap:round; stroke-width:2.5; }
            .par path { stroke:#38bdf8; }
            .eq path { stroke:#f8fafc; }
            .eq { width:1em; height:.9em; margin:0 .15em; flex-shrink:0; }
            .stroke { stroke-dasharray:1; stroke-dashoffset:0; }
            .stroke.draw { animation: fz-dr .3s linear backwards; }
            .eq path:nth-child(2).draw { animation-delay:.14s; }
            @keyframes fz-dr { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
            @keyframes fz-scx { from { transform:scaleX(0); } to { transform:scaleX(1); } }

            .old { position:relative; display:inline-block; padding:0 .1em; }
            .old::after { content:""; position:absolute; left:-.1em; right:-.1em; top:50%; height:3px; background:#ef4444; border-radius:2px; transform-origin:left; }
            .old.draw::after { animation: fz-scx .25s ease-out backwards; }
        `;
        document.head.appendChild(styleCart);

        // --- AUDIO ---
        let audioCtx = null;
        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function playCoin() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.35);
        }
        function playBuzz() {
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        }

        // Esultazione da stadio (rumore filtrato + squilli), tutto generato dal codice.
        // Più forte e più lunga con 10/10, più discreta con meno punti.
        function playCheer(earned) {
            if (!audioCtx) return;
            const t0 = audioCtx.currentTime + 0.3; // dopo la monetina
            const full = earned >= 10;
            const dur = full ? 2.0 : 1.2;
            const peak = full ? 0.16 : 0.08;

            const len = Math.floor(audioCtx.sampleRate * dur);
            const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

            const src = audioCtx.createBufferSource();
            src.buffer = buf;

            const bp = audioCtx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.Q.value = 0.8;
            bp.frequency.setValueAtTime(600, t0);
            bp.frequency.linearRampToValueAtTime(1400, t0 + dur * 0.4);
            bp.frequency.linearRampToValueAtTime(900, t0 + dur);

            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(peak, t0 + 0.25);
            g.gain.setValueAtTime(peak, t0 + dur * 0.55);
            g.gain.linearRampToValueAtTime(0.0001, t0 + dur);

            // leggero "ondeggiare" della folla
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.value = 6;
            lfoGain.gain.value = peak * 0.3;
            lfo.connect(lfoGain);
            lfoGain.connect(g.gain);

            src.connect(bp); bp.connect(g); g.connect(audioCtx.destination);
            src.start(t0); src.stop(t0 + dur);
            lfo.start(t0); lfo.stop(t0 + dur);

            // Squillo di tromba solo con il massimo dei punti
            if (full) {
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const o = audioCtx.createOscillator();
                    const og = audioCtx.createGain();
                    const ts = t0 + 0.05 + i * 0.13;
                    o.type = 'square';
                    o.frequency.setValueAtTime(freq, ts);
                    og.gain.setValueAtTime(0.05, ts);
                    og.gain.exponentialRampToValueAtTime(0.001, ts + 0.3);
                    o.connect(og); og.connect(audioCtx.destination);
                    o.start(ts); o.stop(ts + 0.3);
                });
            }
        }

        // --- UTILITÀ ---
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const lcm = (a, b) => (a * b) / gcd(a, b);
        const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
        const rndSign = () => Math.random() < 0.5 ? '+' : '-';
        const disp = s => String(s).replace(/-/g, '−');
        const signedStr = n => (n < 0 ? '−' : '+') + Math.abs(n);

        // --- STATO ---
        let totalScore = 0, exerciseCount = 0, buzzes = 0;
        let input = "", step = 0, ex = null, vals = {}, shown = new Set(), busy = false;

        function updateConsoleHeader() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Frazioniamo???");
                window.UGOConsole.setScore(totalScore);
                if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Esercizio");
                window.UGOConsole.setTimer(Math.min(exerciseCount + 1, TOTAL_EXERCISES) + "/" + TOTAL_EXERCISES);
            }
        }

        // --- GENERATORI ---
        function genSum() {
            for (;;) {
                const d1 = rnd(2, 10), d2 = rnd(2, 10);
                if (d1 === d2) continue;
                const s1 = rndSign(), s2 = rndSign();
                const n1 = rnd(1, 9), n2 = rnd(1, 9);
                const m = lcm(d1, d2);
                const a1 = (s1 === '+' ? 1 : -1) * n1 * (m / d1);
                const a2 = (s2 === '+' ? 1 : -1) * n2 * (m / d2);
                const tot = a1 + a2;
                if (tot === 0) continue;
                const g = gcd(Math.abs(tot), m); // se > 1 il risultato non è ridotto ai minimi termini
                return {
                    type: 'sum',
                    f1: { s: s1, n: n1, d: d1 },
                    f2: { s: s2, n: n2, d: d2 },
                    steps: [
                        { id: 'm',  kind: 'num',  target: m,            label: "Scrivi il mcm dei denominatori" },
                        { id: 'n1', kind: 'int',  target: a1,           label: "Scrivi il primo numeratore (con il segno)" },
                        { id: 'n2', kind: 'int',  target: a2,           label: "Scrivi il secondo numeratore (con il segno)" },
                        { id: 'fs', kind: 'sign', target: tot > 0 ? '+' : '-', label: "Risultato: scrivi il segno" },
                        { id: 'fd', kind: 'num',  target: m,            label: "Risultato: scrivi il denominatore" },
                        { id: 'fn', kind: 'num',  target: Math.abs(tot), label: "Risultato: scrivi il numeratore" },
                        ...(g > 1 ? [
                            { id: 'gs', kind: 'sign', target: tot > 0 ? '+' : '-', label: "Riduci ai minimi termini: scrivi il segno" },
                            { id: 'gd', kind: 'num',  target: m / g,              label: "Riduci ai minimi termini: scrivi il denominatore" },
                            { id: 'gn', kind: 'num',  target: Math.abs(tot) / g,  label: "Riduci ai minimi termini: scrivi il numeratore" }
                        ] : [])
                    ]
                };
            }
        }

        // Frazioni "effettive" (a/b)x(c/d). Per la divisione la seconda è già invertita.
        function genMulDiv(isDiv, simplifiable) {
            const P = [2, 3, 5, 7];
            let E = null, sm = null;
            for (let t = 0; t < 5000 && !E; t++) {
                const c = { n1: rnd(1, 15), d1: rnd(1, 15), n2: rnd(1, 15), d2: rnd(1, 15) };
                // coppie in ordine di lettura
                const pairs = [['n1', 'd1'], ['n2', 'd2'], ['n1', 'd2'], ['d1', 'n2']];
                const big = pairs.map(p => ({ a: p[0], b: p[1], g: gcd(c[p[0]], c[p[1]]) })).filter(x => x.g > 1);
                if (!simplifiable && big.length === 0) { E = c; }
                else if (simplifiable && big.length === 1 && P.includes(big[0].g)) { E = c; sm = { a: big[0].a, b: big[0].b, p: big[0].g }; }
            }
            if (!E) return genMulDiv(isDiv, false);

            const s1 = rndSign(), s2 = rndSign();
            const F = Object.assign({}, E);
            if (sm) { F[sm.a] /= sm.p; F[sm.b] /= sm.p; }
            const rs = s1 === s2 ? '+' : '-';
            const rn = F.n1 * F.n2, rd = F.d1 * F.d2;

            const steps = [];
            if (isDiv) {
                steps.push({ id: 'id', kind: 'num', target: E.d2, label: "Inverti la seconda frazione: scrivi il denominatore" });
                steps.push({ id: 'in', kind: 'num', target: E.n2, label: "Inverti la seconda frazione: scrivi il numeratore" });
            }
            if (sm) {
                steps.push({ id: 'sa', kind: 'num', target: F[sm.a], label: `Semplifica ${E[sm.a]}: scrivi il nuovo numero` });
                steps.push({ id: 'sb', kind: 'num', target: F[sm.b], label: `Semplifica ${E[sm.b]}: scrivi il nuovo numero` });
            }
            steps.push({ id: 'rs', kind: 'sign', target: rs, label: "Risultato: scrivi il segno" });
            steps.push({ id: 'rn', kind: 'num', target: rn, label: "Risultato: scrivi il numeratore" });
            steps.push({ id: 'rd', kind: 'num', target: rd, label: "Risultato: scrivi il denominatore" });

            return { type: isDiv ? 'div' : 'mul', s1, s2, eff: E, simp: sm, steps };
        }

        // Piano della sessione: tipi mescolati ma bilanciati (prima 0,1,2 a rotazione, poi casuali)
        let plan = [];
        function buildPlan() {
            plan = [];
            while (plan.length < TOTAL_EXERCISES) {
                const bag = [0, 1, 2];
                for (let i = bag.length - 1; i > 0; i--) {
                    const j = rnd(0, i);
                    [bag[i], bag[j]] = [bag[j], bag[i]];
                }
                plan.push(...bag);
            }
            plan = plan.slice(0, TOTAL_EXERCISES);
        }

        function generateExercise() {
            const t = plan.length > exerciseCount ? plan[exerciseCount] : rnd(0, 2);
            if (t === 0) return genSum();
            return genMulDiv(t === 2, Math.random() < 0.5);
        }

        // --- RENDER ---
        const idx = id => ex.steps.findIndex(s => s.id === id);
        function a(key) { if (shown.has(key)) return ''; shown.add(key); return ' draw'; }

        function fld(id) {
            if (vals[id] !== undefined) return `<span class="fld ok">${vals[id]}</span>`;
            const i = idx(id);
            if (i === step) return `<span class="fld act">${disp(input) || '&nbsp;'}</span>`;
            return `<span class="fld">&nbsp;</span>`;
        }
        const sg = s => `<span class="sg">${s === '-' ? '−' : '+'}</span>`;
        const frac = (n, d, key) => `<span class="fr"><span class="fr-n">${n}</span><span class="fline${a(key)}"></span><span class="fr-d">${d}</span></span>`;
        const par = (side, key) => {
            const d = side === 'L' ? 'M9 1 Q1 50 9 99' : 'M1 1 Q9 50 1 99';
            return `<span class="par"><svg viewBox="0 0 10 100" preserveAspectRatio="none"><path class="stroke${a(key)}" pathLength="1" d="${d}"/></svg></span>`;
        };
        const eq = key => {
            const c = a(key);
            return `<svg class="eq" viewBox="0 0 26 22"><path class="stroke${c}" pathLength="1" d="M2 6H24"/><path class="stroke${c}" pathLength="1" d="M2 16H24"/></svg>`;
        };
        const pfrac = (s, n, d, key) => par('L', key + 'pl') + sg(s) + frac(n, d, key) + par('R', key + 'pr');

        function buildE() {
            const E = ex.eff, sm = ex.simp;
            const barsOn = sm && step >= idx('sa');
            const cell = pos => {
                if (ex.type === 'div' && (pos === 'n2' || pos === 'd2')) {
                    const id = pos === 'n2' ? 'in' : 'id';
                    if (vals[id] === undefined) return fld(id);
                }
                const v = E[pos];
                if (barsOn && (pos === sm.a || pos === sm.b)) {
                    return `<span class="old${a('bar' + pos)}">${v}</span>` + fld(pos === sm.a ? 'sa' : 'sb');
                }
                return String(v);
            };
            return pfrac(ex.s1, cell('n1'), cell('d1'), 'E1') + `<span class="op">×</span>` + pfrac(ex.s2, cell('n2'), cell('d2'), 'E2');
        }

        function renderWorkspace() {
            const inner = document.getElementById('fraz-ws-inner');
            const inst = document.getElementById('fraz-instruction');
            inst.textContent = step < ex.steps.length ? ex.steps[step].label : "Esatto!";
            let h = '';

            if (ex.type === 'sum') {
                const f1 = ex.f1, f2 = ex.f2;
                h += sg(f1.s) + frac(f1.n, f1.d, 'f1') + sg(f2.s) + frac(f2.n, f2.d, 'f2');
                h += eq('eq1') + frac(fld('n1') + fld('n2'), fld('m'), 'l1');
                if (step >= idx('fs')) h += eq('eq2') + fld('fs') + frac(fld('fn'), fld('fd'), 'l2');
                if (idx('gs') >= 0 && step >= idx('gs')) h += eq('eq3') + fld('gs') + frac(fld('gn'), fld('gd'), 'l3');
            } else if (ex.type === 'mul') {
                h += buildE();
                if (step >= idx('rs')) h += eq('eqR') + fld('rs') + frac(fld('rn'), fld('rd'), 'lR');
            } else {
                const E = ex.eff;
                h += pfrac(ex.s1, E.n1, E.d1, 'O1') + `<span class="op">:</span>` + pfrac(ex.s2, E.d2, E.n2, 'O2');
                h += eq('eq1') + buildE();
                if (step >= idx('rs')) h += eq('eqR') + fld('rs') + frac(fld('rn'), fld('rd'), 'lR');
            }

            inner.innerHTML = h;
            fit();
        }

        function fit() {
            const ws = document.getElementById('fraz-workspace');
            const inner = document.getElementById('fraz-ws-inner');
            if (!ws || !inner) return;
            inner.style.transform = 'none';
            const avail = ws.clientWidth - 24;
            const w = inner.scrollWidth;
            const s = w > avail && w > 0 ? avail / w : 1;
            inner.style.transform = `scale(${s})`;
        }
        if (window.__frazResize) window.removeEventListener('resize', window.__frazResize);
        window.__frazResize = fit;
        window.addEventListener('resize', fit);

        function updateInput() {
            const act = document.querySelector('#fraz-ws-inner .fld.act');
            if (act) act.innerHTML = disp(input) || '&nbsp;';
        }

        // --- INPUT ---
        function expLen(s) {
            if (s.kind === 'sign') return 1;
            if (s.kind === 'num') return String(s.target).length;
            return 1 + String(Math.abs(s.target)).length;
        }

        function frazPressKey(k) {
            if (!ex || busy || step >= ex.steps.length) return;
            initAudio();
            const s = ex.steps[step];
            if (k === 'ENTER') { checkAnswer(); return; }
            if (k === 'DEL') {
                input = input.slice(0, -1);
                updateInput();
                return;
            }
            if (k === '+' || k === '-') {
                if (s.kind === 'num') return;
                input = (s.kind === 'sign') ? k : k + input.replace(/^[+-]/, '');
            } else {
                if (s.kind === 'sign') return;
                if (s.kind === 'int' && !/^[+-]/.test(input)) return;
                if (input.length >= expLen(s)) return;
                input += k;
            }
            updateInput();
            if (input.length >= expLen(s)) checkAnswer(); // controllo automatico alla lunghezza attesa
        }
        window.frazPressKey = frazPressKey;

        function checkAnswer() {
            if (input === "") return;
            const s = ex.steps[step];
            let ok = false;
            if (s.kind === 'sign') ok = input === s.target;
            else if (s.kind === 'num') ok = /^\d+$/.test(input) && parseInt(input, 10) === s.target;
            else ok = /^[+-]\d+$/.test(input) && parseInt(input, 10) === s.target;

            if (ok) {
                playCoin();
                vals[s.id] = s.kind === 'sign' ? disp(s.target) : s.kind === 'int' ? signedStr(s.target) : String(s.target);
                input = "";
                step++;
                renderWorkspace();
                if (step >= ex.steps.length) finishExercise();
            } else {
                playBuzz();
                buzzes++;
                document.getElementById('fraz-buzz-count').textContent = buzzes;
                input = "";
                updateInput();
                const ws = document.getElementById('fraz-workspace');
                ws.classList.remove('shake'); void ws.offsetWidth; ws.classList.add('shake');
            }
        }

        function finishExercise() {
            busy = true;
            const earned = Math.max(0, 10 - buzzes);
            totalScore += earned;
            if (earned >= 1) playCheer(earned); // esultanza solo se non hai azzerato i 10 punti
            exerciseCount++;
            document.getElementById('fraz-score').textContent = totalScore;
            updateConsoleHeader();
            setTimeout(() => {
                if (!alive) return;
                busy = false;
                if (exerciseCount >= TOTAL_EXERCISES) endSession();
                else nextExercise();
            }, 900);
        }

        // Tastiera fisica (un solo listener, anche se la cartuccia viene riavviata)
        if (window.__frazKeyHandler) window.removeEventListener('keydown', window.__frazKeyHandler);
        window.__frazKeyHandler = function(e) {
            if (!document.getElementById('fraz-container')) return;
            const so = document.getElementById('fraz-start-overlay');
            const eo = document.getElementById('fraz-end-overlay');
            if (!so || !eo || so.style.display !== 'none' || eo.style.display !== 'none') return;
            if ((e.key >= '0' && e.key <= '9') || e.key === '+' || e.key === '-') { frazPressKey(e.key); e.preventDefault(); }
            else if (e.key === 'Backspace') { frazPressKey('DEL'); e.preventDefault(); }
            else if (e.key === 'Enter') { frazPressKey('ENTER'); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__frazKeyHandler);

        // Pulizia quando si esce dal gioco (tasto Menu della console)
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                window.removeEventListener('keydown', window.__frazKeyHandler);
                window.removeEventListener('resize', fit);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-3');
                if (st) st.remove();
            });
        }

        // --- FLUSSO ---
        function nextExercise() {
            buzzes = 0; input = ""; step = 0; vals = {}; shown = new Set();
            document.getElementById('fraz-buzz-count').textContent = 0;
            document.getElementById('fraz-num-es').textContent = exerciseCount + 1;
            updateConsoleHeader();
            ex = generateExercise();
            renderWorkspace();
        }

        function startSession() {
            initAudio();
            totalScore = 0; exerciseCount = 0; busy = false;
            buildPlan();
            document.getElementById('fraz-score').textContent = 0;
            document.getElementById('fraz-start-overlay').style.display = 'none';
            document.getElementById('fraz-end-overlay').style.display = 'none';
            nextExercise();
        }

        function endSession() {
            document.getElementById('fraz-final-score').textContent = totalScore;
            document.getElementById('fraz-end-overlay').style.display = 'flex';
        }

        document.getElementById('fraz-btn-start').addEventListener('click', startSession);
        document.getElementById('fraz-btn-restart').addEventListener('click', startSession);
    }
});

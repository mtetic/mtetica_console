// --- CARTUCCIA 012: Enti geometrici ---

window.UGOConsole.registerCartridge({
    id: 12,
    titolo: "12. Enti geometrici",
    colore: "#0ea5e9",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        const NS = 'http://www.w3.org/2000/svg';
        const DURATA = 90;
        let alive = true;

        slot.innerHTML = `
            <div id="geo-container">
                <div id="geo-top">
                    <div id="geo-hud">
                        <span class="geo-t">Tempo: <b id="geo-timer">${DURATA}</b>s</span>
                        <span class="geo-s">Punti: <b id="geo-score">0</b></span>
                        <button id="geo-audio" type="button">Audio: sì</button>
                    </div>
                    <div id="geo-istr"></div>
                </div>
                <div id="geo-stage">
                    <svg id="geo-svg" viewBox="0 0 400 490" xmlns="${NS}">
                        <defs>
                            <pattern id="geo-g1" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
                            </pattern>
                            <pattern id="geo-g2" width="100" height="100" patternUnits="userSpaceOnUse">
                                <rect width="100" height="100" fill="url(#geo-g1)"/>
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#93c5fd" stroke-width="1.2"/>
                            </pattern>
                        </defs>
                        <rect width="400" height="400" fill="#ffffff"/>
                        <rect width="400" height="400" fill="url(#geo-g2)"/>
                        <line x1="0" y1="400" x2="400" y2="400" stroke="#475569" stroke-width="4"/>
                        <rect x="0" y="402" width="400" height="88" fill="#f1f5f9"/>
                        <text x="200" y="423" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="1">ZONA DI PARTENZA</text>
                        <g id="geo-fixed"></g>
                        <g id="geo-drag"></g>
                    </svg>
                </div>
                <div id="geo-ctrl">
                    <button id="geo-rot" class="geo-btn" type="button" disabled>Ruota di 45° antiorario</button>
                    <button id="geo-skip" class="geo-btn geo-sec" type="button" disabled>Salta</button>
                </div>

                <div id="geo-start" class="geo-overlay">
                    <div class="geo-title">Enti <span>geometrici</span></div>
                    <p>Trascina l'oggetto dalla zona di partenza fino alla posizione richiesta sulla griglia. Usa il pulsante per ruotarlo. Hai ${DURATA} secondi: ogni consegna corretta vale un punto.</p>
                    <button type="button" class="btn-start" id="geo-btn-start">AVVIA</button>
                </div>

                <div id="geo-end" class="geo-overlay" style="display:none;">
                    <h2>Tempo scaduto</h2>
                    <p style="font-size:1.25rem;">Punteggio totale: <b style="color:#22c55e;"><span id="geo-final">0</span> punti</b></p>
                    <div id="geo-report"></div>
                    <button type="button" class="btn-start" id="geo-btn-restart">GIOCA ANCORA</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-12');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-12';
        styleCart.innerHTML = `
            #geo-container {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                display: grid; grid-template-columns: minmax(0, 1fr);
                grid-template-rows: auto minmax(0, 1fr) auto;
                padding: 8px; box-sizing: border-box; overflow: hidden;
                background: #0f172a; color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            #geo-top { grid-column: 1; grid-row: 1; margin-bottom: 8px; }
            #geo-stage { grid-column: 1; grid-row: 2; min-width: 0; min-height: 0; }
            #geo-ctrl { grid-column: 1; grid-row: 3; display: flex; margin-top: 8px; }
            #geo-svg { display: block; width: 100%; height: 100%; touch-action: none; }
            #geo-svg text { pointer-events: none; }
            #geo-hud {
                display: flex; justify-content: space-between; align-items: center;
                background: #334155; border-radius: 8px; padding: 6px 12px; margin-bottom: 8px;
                font-weight: bold; font-size: clamp(0.9rem, 3vh, 1.15rem);
            }
            .geo-t { color: #f43f5e; }
            .geo-s { color: #22c55e; }
            #geo-audio {
                background: #1e293b; border: none; color: #fff; border-radius: 6px;
                padding: 4px 10px; font-size: 0.85rem; cursor: pointer; touch-action: manipulation;
            }
            #geo-istr {
                display: flex; align-items: center; justify-content: center; text-align: center;
                background: #1e293b; border-left: 5px solid #0ea5e9; border-radius: 10px;
                padding: 10px 12px; min-height: 3.4em; line-height: 1.35; font-weight: 600;
                font-size: clamp(0.9rem, 2.6vh, 1.15rem);
            }
            .geo-btn {
                flex: 1 1 0px; margin-right: 8px; padding: 12px; border: none; border-radius: 10px;
                background: #0284c7; color: #fff; font-weight: bold; cursor: pointer;
                touch-action: manipulation; font-size: clamp(0.9rem, 2.4vh, 1.05rem);
            }
            .geo-btn:last-child { margin-right: 0; }
            .geo-btn:active { background: #0369a1; }
            .geo-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
            .geo-btn.geo-sec { flex: 0 0 28%; background: #475569; }
            .geo-btn.geo-sec:disabled { background: #334155; }

            .geo-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.96); z-index: 10;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 16px; box-sizing: border-box; text-align: center; overflow-y: auto;
            }
            .geo-overlay > * { margin-top: 7px; margin-bottom: 7px; }
            .geo-overlay p { color: #94a3b8; max-width: 440px; line-height: 1.45; font-size: clamp(0.95rem, 2.8vh, 1.15rem); }
            .geo-overlay h2 { color: #38bdf8; margin: 0; font-size: clamp(1.5rem, 5vh, 2.2rem); }
            .geo-title { font-weight: 900; color: #0ea5e9; letter-spacing: 1px; font-size: clamp(1.8rem, 7vh, 2.6rem); }
            .geo-title span { color: #f43f5e; }
            .geo-overlay .btn-start { background: #0ea5e9; box-shadow: 0 4px 14px rgba(14,165,233,0.4); }
            #geo-report {
                width: 100%; max-width: 520px; max-height: 42%; overflow-y: auto;
                -webkit-overflow-scrolling: touch; background: rgba(30, 41, 59, 0.85);
                border-radius: 10px; padding: 8px 12px; box-sizing: border-box; text-align: left;
                color: #cbd5e1; line-height: 1.45; font-size: clamp(0.8rem, 2.4vh, 0.95rem);
            }
            .geo-rep-title { color: #fbbf24; font-weight: bold; margin: 6px 0 4px 0; }
            .geo-rep-item { margin-bottom: 6px; }

            /* Schermo in orizzontale: griglia a sinistra, comandi a destra */
            @media (orientation: landscape) {
                #geo-container { grid-template-columns: minmax(0, 1fr) minmax(230px, 300px); grid-template-rows: auto 1fr auto; }
                #geo-stage { grid-column: 1; grid-row: 1 / span 3; margin-right: 8px; }
                #geo-top { grid-column: 2; grid-row: 1; }
                #geo-ctrl { grid-column: 2; grid-row: 3; flex-direction: column; }
                .geo-btn { margin: 0 0 8px 0; flex: 0 0 auto; }
                .geo-btn.geo-sec { flex: 0 0 auto; }
            }
        `;
        document.head.appendChild(styleCart);

        // --- RIFERIMENTI ---
        const svg = document.getElementById('geo-svg');
        const layerF = document.getElementById('geo-fixed');
        const layerD = document.getElementById('geo-drag');
        const btnRot = document.getElementById('geo-rot');
        const btnSkip = document.getElementById('geo-skip');

        // --- STATO ---
        let punteggio = 0, tempo = DURATA, timer = null, partita = false;
        let scen = null, ultimaChiave = '';
        let mano = { tipo: 'punto', x: 200, y: 450, rot: 0 };
        let dragging = false, pid = null, off = [0, 0];
        let errori = {}, nGiuste = 0, nErrori = 0, nSaltate = 0;

        // --- AUDIO ---
        let audioCtx = null, audioOn = true;
        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function suona(freq, tipo, dur) {
            if (!audioOn || !audioCtx) return;
            try {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime;
                o.type = tipo; o.frequency.value = freq;
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(t); o.stop(t + dur);
            } catch (e) {}
        }
        function suonaOk() { suona(587.33, 'triangle', 0.15); setTimeout(function() { if (alive) suona(880, 'triangle', 0.2); }, 80); }
        function suonaKo() { suona(180, 'sawtooth', 0.3); }
        function fanfara() {
            [523.25, 659.25, 783.99, 1046.5].forEach(function(n, i) {
                setTimeout(function() { if (alive) suona(n, 'sine', 0.4); }, i * 150);
            });
        }

        // --- GEOMETRIA (coordinate dello schermo: y verso il basso; angoli antiorari) ---
        const R = function(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
        const pick = function(a) { return a[Math.floor(Math.random() * a.length)]; };
        const shuf = function(a) {
            a = a.slice();
            for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
            return a;
        };
        const gc = function() { return R(4, 16) * 20; };
        const rad = function(a) { return a * Math.PI / 180; };
        const dv = function(a) { return [Math.round(Math.cos(rad(a)) * 1e6) / 1e6, -Math.round(Math.sin(rad(a)) * 1e6) / 1e6]; };
        const sub = function(p, q) { return [p[0] - q[0], p[1] - q[1]]; };
        const dot = function(p, q) { return p[0] * q[0] + p[1] * q[1]; };
        const dPt = function(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); };
        const dLine = function(p, P, a) { const d = dv(a), v = sub(p, P); return Math.abs(v[0] * d[1] - v[1] * d[0]); };
        const paral = function(a, b) { return (((a - b) % 180) + 180) % 180 === 0; };
        const perpe = function(a, b) { return (((a - b) % 180) + 180) % 180 === 90; };
        const inB = function(p, m) { return p[0] >= m && p[0] <= 400 - m && p[1] >= m && p[1] <= 400 - m; };
        const nameOri = function(a) { a = a % 180; return a === 0 ? 'orizzontale' : (a === 90 ? 'verticale' : 'obliqua'); };
        const DIR = { 0: 'DESTRA', 45: 'ALTO-DESTRA', 90: 'ALTO', 135: 'ALTO-SINISTRA', 180: 'SINISTRA', 225: 'BASSO-SINISTRA', 270: 'BASSO', 315: 'BASSO-DESTRA' };
        const ANG4 = [0, 45, 90, 135], ANG8 = [0, 45, 90, 135, 180, 225, 270, 315];
        const PUNTI = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'M', 'N', 'O', 'P', 'Q'];
        const RETTE = ['r', 's', 't', 'u', 'v', 'w'];

        // passo di griglia (20 px) lungo una direzione multipla di 45 gradi
        function mk(P, a, n) {
            const d = dv(a);
            const g = (a % 90 === 0) ? [Math.round(d[0]), Math.round(d[1])] : [Math.sign(d[0]), Math.sign(d[1])];
            return [P[0] + 20 * n * g[0], P[1] + 20 * n * g[1]];
        }
        // due punti sulla griglia, lungo la direzione a, a n passi di distanza
        function coppia(a, nmin, nmax) {
            let A, B;
            do { A = [gc(), gc()]; B = mk(A, a, R(nmin, nmax)); } while (!inB(B, 25));
            return [A, B];
        }
        // intervallo del parametro t per cui P + t*d resta nel riquadro [lo, hi]
        function clip(P, d, lo, hi) {
            let t0 = -1e9, t1 = 1e9;
            for (let i = 0; i < 2; i++) {
                if (Math.abs(d[i]) < 1e-9) continue;
                const a = (lo - P[i]) / d[i], b = (hi - P[i]) / d[i];
                t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
            }
            return [t0, t1];
        }
        // origine di una semiretta con abbastanza spazio davanti (fw) e dietro (bk)
        function origine(a, fw, bk) {
            const d = dv(a);
            for (let i = 0; i < 60; i++) {
                const O = [gc(), gc()], t = clip(O, d, 25, 375);
                if (t[1] >= fw && -t[0] >= bk) return O;
            }
            return [200, 200];
        }
        function nuovaRetta(c) { return { k: 'retta', P: [gc(), gc()], a: pick(ANG4), n: c.L() }; }

        // --- SCENARI: ogni funzione restituisce { istr, base, hand, ver } ---
        // ver(h) riceve la posizione dell'oggetto: h.p reale, h.s agganciata alla griglia,
        // h.a angolo, h.e1/h.e2 estremi del segmento.
        const SC = {
            punto: [
                function(c) {
                    const H = c.P(), r = nuovaRetta(c), si = Math.random() < 0.5;
                    return { hand: H, base: [r],
                        istr: 'Trascina il punto ' + H + ' in modo che ' + (si ? 'APPARTENGA' : 'NON APPARTENGA') + ' alla retta ' + nameOri(r.a) + ' ' + r.n,
                        ver: function(h) { const d = dLine(h.s, r.P, r.a); return si ? d <= 8 : d > 12; } };
                },
                function(c) {
                    const H = c.P(), T = [R(4, 16) * 20, R(4, 16) * 20], an = shuf(ANG4);
                    const r = { k: 'retta', P: T, a: an[0], n: c.L() }, s = { k: 'retta', P: T, a: an[1], n: c.L() };
                    return { hand: H, base: [r, s],
                        istr: 'Trascina il punto ' + H + ' nell\'intersezione delle rette ' + r.n + ' e ' + s.n + ': deve appartenere a entrambe',
                        ver: function(h) { return dPt(h.s, T) <= 8; } };
                },
                function(c) {
                    const H = c.P(), an = shuf(ANG4);
                    const r = { k: 'retta', P: [gc(), gc()], a: an[0], n: c.L() }, s = { k: 'retta', P: [gc(), gc()], a: an[1], n: c.L() };
                    return { hand: H, base: [r, s],
                        istr: 'Trascina il punto ' + H + ' in modo che APPARTENGA alla retta ' + r.n + ' ma NON APPARTENGA alla retta ' + s.n,
                        ver: function(h) { return dLine(h.s, r.P, r.a) <= 8 && dLine(h.s, s.P, s.a) > 12; } };
                },
                function(c) {
                    const H = c.P(), a = pick(ANG8), prol = Math.random() < 0.5;
                    const O = origine(a, prol ? 60 : 100, prol ? 80 : 0), d = dv(a);
                    const t = { k: 'semiretta', P: O, a: a, n: c.P(), nl: c.L() };
                    return { hand: H, base: [t],
                        istr: prol
                            ? 'Trascina il punto ' + H + ' sulla retta che contiene la semiretta ' + t.nl + ', ma in modo che NON APPARTENGA alla semiretta'
                            : 'Trascina il punto ' + H + ' in modo che APPARTENGA alla semiretta ' + t.nl,
                        ver: function(h) {
                            if (dLine(h.s, O, a) > 8) return false;
                            const pr = dot(sub(h.s, O), d);
                            return prol ? pr < -12 : pr >= -8;
                        } };
                },
                function(c) {
                    const H = c.P(), a = pick(ANG4), AB = coppia(a, 3, 4), len = dPt(AB[0], AB[1]), d = dv(a), fuori = Math.random() < 0.5;
                    const nA = c.P(), nB = c.P();
                    const sg = { k: 'segmento', A: AB[0], B: AB[1], nA: nA, nB: nB };
                    return { hand: H, base: [sg],
                        istr: fuori
                            ? 'Trascina il punto ' + H + ' sulla retta passante per ' + nA + ' e ' + nB + ', ma in modo che NON APPARTENGA al segmento ' + nA + nB
                            : 'Trascina il punto ' + H + ' in modo che APPARTENGA al segmento ' + nA + nB,
                        ver: function(h) {
                            if (dLine(h.s, AB[0], a) > 8) return false;
                            const pr = dot(sub(h.s, AB[0]), d);
                            return fuori ? (pr < -12 || pr > len + 12) : (pr >= -8 && pr <= len + 8);
                        } };
                }
            ],
            retta: [
                function(c) {
                    const a = pick(ANG4), BC = coppia(a, 3, 5), nB = c.P(), nC = c.P();
                    return { base: [{ k: 'punto', P: BC[0], n: nB }, { k: 'punto', P: BC[1], n: nC }],
                        istr: 'Trascina e orienta la retta in modo che sia PASSANTE per i due punti ' + nB + ' e ' + nC,
                        ver: function(h) { return h.a === a && dLine(h.p, BC[0], a) <= 13; } };
                },
                function(c) {
                    const B = [gc(), gc()], nB = c.P(), tp = pick(['orizzontale', 'verticale', 'obliqua']);
                    return { base: [{ k: 'punto', P: B, n: nB }],
                        istr: 'Trascina la retta in modo che sia PASSANTE per il punto ' + nB + ' e sia una retta ' + tp.toUpperCase(),
                        ver: function(h) { return nameOri(h.a) === tp && dLine(h.p, B, h.a) <= 13; } };
                },
                function(c) {
                    const s = nuovaRetta(c), nB = c.P(), pa = Math.random() < 0.5;
                    let B;
                    do { B = [gc(), gc()]; } while (dLine(B, s.P, s.a) < 30);
                    return { base: [s, { k: 'punto', P: B, n: nB }],
                        istr: 'Disponi la retta in modo che sia PASSANTE per il punto ' + nB + ' e ' + (pa ? 'PARALLELA' : 'PERPENDICOLARE') + ' alla retta ' + nameOri(s.a) + ' ' + s.n,
                        ver: function(h) { return (pa ? paral(h.a, s.a) : perpe(h.a, s.a)) && dLine(h.p, B, h.a) <= 13; } };
                },
                function(c) {
                    const nB = c.P(), nC = c.P(), solo = Math.random() < 0.5;
                    let B, C;
                    do { B = [gc(), gc()]; C = [gc(), gc()]; } while (dPt(B, C) < 80);
                    return { base: [{ k: 'punto', P: B, n: nB }, { k: 'punto', P: C, n: nC }],
                        istr: solo
                            ? 'Trascina la retta in modo che sia PASSANTE per il punto ' + nB + ' ma NON passi per il punto ' + nC
                            : 'Posiziona la retta in modo che il punto ' + nC + ' NON APPARTENGA alla retta',
                        ver: function(h) { return dLine(h.p, C, h.a) > 26 && (!solo || dLine(h.p, B, h.a) <= 13); } };
                },
                function(c) {
                    const s = nuovaRetta(c);
                    return { base: [s],
                        istr: 'Trascina la retta in modo che sia PARALLELA alla retta ' + nameOri(s.a) + ' ' + s.n + ' e DISTINTA da essa',
                        ver: function(h) { return paral(h.a, s.a) && dLine(h.p, s.P, s.a) >= 24; } };
                },
                function(c) {
                    const s = nuovaRetta(c), B = [gc(), gc()], nB = c.P();
                    return { base: [s, { k: 'punto', P: B, n: nB }],
                        istr: 'Disponi la retta in modo che sia PASSANTE per il punto ' + nB + ' e INCIDENTE alla retta ' + nameOri(s.a) + ' ' + s.n + ' (non parallela)',
                        ver: function(h) { return !paral(h.a, s.a) && dLine(h.p, B, h.a) <= 13; } };
                }
            ],
            semiretta: [
                function(c) {
                    const O = [gc(), gc()], nO = c.P(), a = pick(ANG8);
                    return { base: [{ k: 'punto', P: O, n: nO }],
                        istr: 'Trascina la semiretta con origine nel punto ' + nO + ' e rivolta verso ' + DIR[a],
                        ver: function(h) { return dPt(h.s, O) <= 8 && h.a === a; } };
                },
                function(c) {
                    const nO = c.P(), r = nuovaRetta(c), pa = Math.random() < 0.5;
                    let O;
                    do { O = [gc(), gc()]; } while (dLine(O, r.P, r.a) < 30);
                    return { base: [r, { k: 'punto', P: O, n: nO }],
                        istr: 'Metti la semiretta con origine in ' + nO + ' in modo che sia ' + (pa ? 'PARALLELA' : 'PERPENDICOLARE') + ' alla retta ' + nameOri(r.a) + ' ' + r.n,
                        ver: function(h) { return dPt(h.s, O) <= 8 && (pa ? paral(h.a, r.a) : perpe(h.a, r.a)); } };
                },
                function(c) {
                    const a = pick(ANG8), nO = c.P(), nB = c.P();
                    let O, B;
                    do { O = [gc(), gc()]; B = mk(O, a, R(3, 5)); } while (!inB(B, 25));
                    return { base: [{ k: 'punto', P: O, n: nO }, { k: 'punto', P: B, n: nB }],
                        istr: 'Trascina la semiretta con origine in ' + nO + ' in modo che sia PASSANTE per il punto ' + nB,
                        ver: function(h) { return dPt(h.s, O) <= 8 && h.a === a; } };
                },
                function(c) {
                    const a = pick(ANG8), O = origine(a, 80, 80);
                    const t = { k: 'semiretta', P: O, a: a, n: c.P(), nl: c.L() };
                    return { base: [t],
                        istr: 'Trascina la semiretta in modo che sia OPPOSTA alla semiretta ' + t.nl + ': stessa origine ' + t.n + ', stessa retta, verso contrario',
                        ver: function(h) { return dPt(h.s, O) <= 8 && h.a === (a + 180) % 360; } };
                }
            ],
            segmento: [
                function(c) {
                    const a = pick(ANG4), d = dv(a), nA = c.P(), nB = c.P();
                    let C, A, B;
                    do {
                        C = [gc(), gc()];
                        A = [Math.round(C[0] - 60 * d[0]), Math.round(C[1] - 60 * d[1])];
                        B = [Math.round(C[0] + 60 * d[0]), Math.round(C[1] + 60 * d[1])];
                    } while (!inB(A, 22) || !inB(B, 22));
                    return { base: [{ k: 'punto', P: A, n: nA }, { k: 'punto', P: B, n: nB }],
                        istr: 'Trascina il segmento in modo che i suoi estremi coincidano con i punti ' + nA + ' e ' + nB,
                        ver: function(h) {
                            return (dPt(h.e1, A) <= 14 && dPt(h.e2, B) <= 14) || (dPt(h.e1, B) <= 14 && dPt(h.e2, A) <= 14);
                        } };
                },
                function(c) {
                    const r = nuovaRetta(c);
                    return { base: [r],
                        istr: 'Trascina il segmento in modo che APPARTENGA alla retta ' + nameOri(r.a) + ' ' + r.n,
                        ver: function(h) { return paral(h.a, r.a) && dLine(h.p, r.P, r.a) <= 13; } };
                },
                function(c) {
                    const r = nuovaRetta(c), nP = c.P(), pa = Math.random() < 0.5;
                    let P;
                    do { P = [gc(), gc()]; } while (dLine(P, r.P, r.a) < 30);
                    return { base: [r, { k: 'punto', P: P, n: nP }],
                        istr: 'Disponi il segmento con un estremo nel punto ' + nP + ' in modo che sia ' + (pa ? 'PARALLELO' : 'PERPENDICOLARE') + ' alla retta ' + nameOri(r.a) + ' ' + r.n,
                        ver: function(h) {
                            return (dPt(h.e1, P) <= 14 || dPt(h.e2, P) <= 14) && (pa ? paral(h.a, r.a) : perpe(h.a, r.a));
                        } };
                },
                function(c) {
                    const a = pick(ANG4), AB = coppia(a, 3, 4), nA = c.P(), nB = c.P(), v = R(0, 2);
                    const nome = nA + nB;
                    const testi = [
                        'CONSECUTIVO al segmento ' + nome + ': un estremo in comune e nessun altro punto in comune',
                        'ADIACENTE al segmento ' + nome + ': un estremo in comune e sulla stessa retta, senza sovrapporsi',
                        'CONSECUTIVO ma NON ADIACENTE al segmento ' + nome + ': un estremo in comune, ma non sulla stessa retta'
                    ];
                    return { base: [{ k: 'segmento', A: AB[0], B: AB[1], nA: nA, nB: nB }],
                        istr: 'Disponi il segmento in modo che sia ' + testi[v],
                        ver: function(h) {
                            const prove = [[h.e1, h.e2, AB[0], AB[1]], [h.e1, h.e2, AB[1], AB[0]], [h.e2, h.e1, AB[0], AB[1]], [h.e2, h.e1, AB[1], AB[0]]];
                            for (let i = 0; i < prove.length; i++) {
                                const q = prove[i], S = q[2], eo = q[1], F = q[3];
                                if (dPt(q[0], S) > 14) continue;
                                const coll = paral(h.a, a);
                                const sovr = coll && dot(sub(eo, S), sub(F, S)) > 0;
                                if (v === 0 && !sovr) return true;
                                if (v === 1 && coll && !sovr) return true;
                                if (v === 2 && !coll) return true;
                            }
                            return false;
                        } };
                }
            ]
        };

        function genera() {
            const np = shuf(PUNTI), nr = shuf(RETTE);
            const c = { P: function() { return np.pop(); }, L: function() { return nr.pop(); } };
            let tipo, i, key, giri = 0;
            do {
                tipo = pick(['punto', 'retta', 'semiretta', 'segmento']);
                i = Math.floor(Math.random() * SC[tipo].length);
                key = tipo + i; giri++;
            } while (key === ultimaChiave && giri < 8);
            ultimaChiave = key;
            const s = SC[tipo][i](c);
            s.tipo = tipo;
            return s;
        }

        // --- DISEGNO ---
        function E(tag, at, genitore) {
            const n = document.createElementNS(NS, tag);
            for (const k in at) n.setAttribute(k, at[k]);
            if (genitore) genitore.appendChild(n);
            return n;
        }
        function svuota(n) { while (n.firstChild) n.removeChild(n.firstChild); }
        function lbl(x, y, t, it) {
            const n = E('text', { x: x, y: y, fill: '#1e293b', 'font-size': 16, 'font-weight': 'bold', 'font-style': it ? 'italic' : 'normal' }, layerF);
            n.textContent = t;
        }
        function tratto(g, P, d, t0, t1, extra) {
            const at = { x1: P[0] + d[0] * t0, y1: P[1] + d[1] * t0, x2: P[0] + d[0] * t1, y2: P[1] + d[1] * t1 };
            for (const k in extra) at[k] = extra[k];
            E('line', at, g);
        }
        function pallino(g, P) { E('circle', { cx: P[0], cy: P[1], r: 5, fill: '#e11d48', stroke: 'none' }, g); }

        function disegnaFissi() {
            svuota(layerF);
            scen.base.forEach(function(o) {
                const g = E('g', { stroke: '#475569', 'stroke-width': 2 }, layerF);
                if (o.k === 'retta') {
                    const d = dv(o.a), u = clip(o.P, d, 0, 400), s = clip(o.P, d, 25, 375);
                    tratto(g, o.P, d, u[0], u[1], { 'stroke-dasharray': '4,4' });
                    tratto(g, o.P, d, s[0], s[1], {});
                    const t = s[1] - 40, n = [Math.sin(rad(o.a)), Math.cos(rad(o.a))];
                    lbl(o.P[0] + d[0] * t - n[0] * 12, o.P[1] + d[1] * t - n[1] * 12, o.n, true);
                } else if (o.k === 'semiretta') {
                    const d = dv(o.a), fine = clip(o.P, d, 0, 400)[1], s = Math.max(0, clip(o.P, d, 25, 375)[1]);
                    tratto(g, o.P, d, s, Math.max(s, fine), { 'stroke-dasharray': '4,4' });
                    tratto(g, o.P, d, 0, s, {});
                    pallino(g, o.P);
                    lbl(o.P[0] + 10, o.P[1] - 10, o.n, false);
                    const t = Math.max(10, s - 35), n = [Math.sin(rad(o.a)), Math.cos(rad(o.a))];
                    lbl(o.P[0] + d[0] * t - n[0] * 12, o.P[1] + d[1] * t - n[1] * 12, o.nl, true);
                } else if (o.k === 'segmento') {
                    E('line', { x1: o.A[0], y1: o.A[1], x2: o.B[0], y2: o.B[1], 'stroke-width': 3 }, g);
                    pallino(g, o.A); pallino(g, o.B);
                    lbl(o.A[0] + 10, o.A[1] - 10, o.nA, false);
                    lbl(o.B[0] + 10, o.B[1] - 10, o.nB, false);
                } else if (o.k === 'punto') {
                    pallino(g, o.P);
                    lbl(o.P[0] + 10, o.P[1] - 10, o.n, false);
                }
            });
        }

        function disegnaMano() {
            svuota(layerD);
            const m = mano, g = E('g', {}, layerD);
            if (m.tipo === 'punto') {
                E('circle', { cx: m.x, cy: m.y, r: 7, fill: '#06b6d4' }, g);
                const t = E('text', { x: m.x + 12, y: m.y - 12, fill: '#06b6d4', 'font-weight': 'bold', 'font-size': 16 }, g);
                t.textContent = scen ? scen.hand : '';
                return;
            }
            g.setAttribute('transform', 'translate(' + m.x + ',' + m.y + ') rotate(' + m.rot + ')');
            g.setAttribute('stroke', '#06b6d4'); g.setAttribute('stroke-width', 3); g.setAttribute('fill', 'none');
            if (m.tipo === 'retta') {
                E('line', { x1: -160, y1: 0, x2: 160, y2: 0 }, g);
                E('line', { x1: -190, y1: 0, x2: -160, y2: 0, 'stroke-dasharray': '5,5' }, g);
                E('line', { x1: 160, y1: 0, x2: 190, y2: 0, 'stroke-dasharray': '5,5' }, g);
            } else if (m.tipo === 'semiretta') {
                E('line', { x1: 0, y1: 0, x2: 150, y2: 0 }, g);
                E('line', { x1: 150, y1: 0, x2: 180, y2: 0, 'stroke-dasharray': '5,5' }, g);
                E('circle', { cx: 0, cy: 0, r: 5, fill: '#06b6d4', stroke: 'none' }, g);
            } else {
                E('line', { x1: -60, y1: 0, x2: 60, y2: 0 }, g);
                E('circle', { cx: -60, cy: 0, r: 5, fill: '#06b6d4', stroke: 'none' }, g);
                E('circle', { cx: 60, cy: 0, r: 5, fill: '#06b6d4', stroke: 'none' }, g);
            }
        }

        // --- STATO DELL'OGGETTO E VERIFICA ---
        function stato() {
            const lim = (mano.tipo === 'semiretta') ? 360 : 180;
            const a = (((360 - mano.rot) % lim) + lim) % lim, d = dv(a);
            const h = { p: [mano.x, mano.y], s: [Math.round(mano.x / 20) * 20, Math.round(mano.y / 20) * 20], a: a };
            if (mano.tipo === 'segmento') {
                h.e1 = [mano.x - 60 * d[0], mano.y - 60 * d[1]];
                h.e2 = [mano.x + 60 * d[0], mano.y + 60 * d[1]];
            }
            return h;
        }
        function dentroGriglia(h) {
            if (mano.tipo === 'segmento') return h.e1[1] < 400 && h.e2[1] < 400;
            if (mano.tipo === 'retta') return h.p[1] < 400;
            return h.s[1] < 400;
        }
        function reset() { mano.x = 200; mano.y = 450; }
        function registra(testo) { errori[testo] = (errori[testo] || 0) + 1; }

        function nuovoRound() {
            scen = genera();
            document.getElementById('geo-istr').textContent = scen.istr;
            mano.tipo = scen.tipo; mano.rot = 0; reset();
            btnRot.disabled = (scen.tipo === 'punto');
            btnSkip.disabled = false;
            disegnaFissi();
            disegnaMano();
        }

        function mostraStatoConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Enti geometrici");
                window.UGOConsole.setScore(punteggio);
                window.UGOConsole.setTimer(tempo + "s");
            }
        }

        // --- FLUSSO ---
        function iniziaPartita() {
            initAudio();
            punteggio = 0; tempo = DURATA; partita = true;
            errori = {}; nGiuste = 0; nErrori = 0; nSaltate = 0; ultimaChiave = '';
            document.getElementById('geo-score').textContent = 0;
            document.getElementById('geo-timer').textContent = tempo;
            document.getElementById('geo-start').style.display = 'none';
            document.getElementById('geo-end').style.display = 'none';
            mostraStatoConsole();
            nuovoRound();
            clearInterval(timer);
            timer = setInterval(function() {
                tempo--;
                document.getElementById('geo-timer').textContent = Math.max(0, tempo);
                mostraStatoConsole();
                if (tempo <= 0) fineGioco();
            }, 1000);
        }

        function fineGioco() {
            partita = false; dragging = false;
            clearInterval(timer);
            fanfara();
            btnRot.disabled = true; btnSkip.disabled = true;
            document.getElementById('geo-final').textContent = punteggio;
            let h = '<div>Corrette: <b>' + nGiuste + '</b> · Errori: <b>' + nErrori + '</b> · Saltate: <b>' + nSaltate + '</b></div>';
            const chiavi = Object.keys(errori);
            if (chiavi.length === 0) {
                h += '<div class="geo-rep-title">Nessun errore: ottimo lavoro.</div>';
            } else {
                h += '<div class="geo-rep-title">Da ripassare:</div>';
                chiavi.forEach(function(k) {
                    h += '<div class="geo-rep-item">' + k + (errori[k] > 1 ? ' (x' + errori[k] + ')' : '') + '</div>';
                });
            }
            document.getElementById('geo-report').innerHTML = h;
            document.getElementById('geo-end').style.display = 'flex';
        }

        // --- INPUT ---
        function coordinate(e) {
            const p = svg.createSVGPoint();
            p.x = e.clientX; p.y = e.clientY;
            const q = p.matrixTransform(svg.getScreenCTM().inverse());
            return [q.x, q.y];
        }

        svg.addEventListener('pointerdown', function(e) {
            if (!partita || dragging) return;
            initAudio();
            const c = coordinate(e);
            const raggio = { punto: 35, retta: 120, semiretta: 120, segmento: 80 }[mano.tipo];
            if (Math.hypot(c[0] - mano.x, c[1] - mano.y) >= raggio) return;
            dragging = true; pid = e.pointerId;
            try { svg.setPointerCapture(pid); } catch (err) {}
            // Il punto si solleva di 40 unita' quando lo si tocca: resta visibile sopra il dito
            // (voluto: sugli schermi touch altrimenti finirebbe sotto il polpastrello).
            if (mano.tipo === 'punto') { mano.y = mano.y - 40; disegnaMano(); }
            off = [c[0] - mano.x, c[1] - mano.y];
        });

        svg.addEventListener('pointermove', function(e) {
            if (!dragging || e.pointerId !== pid) return;
            const c = coordinate(e);
            mano.x = Math.max(15, Math.min(385, c[0] - off[0]));
            mano.y = Math.max(15, Math.min(460, c[1] - off[1]));
            disegnaMano();
        });

        svg.addEventListener('pointerup', function(e) {
            if (!dragging || e.pointerId !== pid) return;
            dragging = false;
            try { svg.releasePointerCapture(pid); } catch (err) {}
            const h = stato();
            if (!dentroGriglia(h)) { reset(); disegnaMano(); return; }  // rilasciato nella zona di partenza
            if (scen.ver(h)) {
                punteggio++; nGiuste++;
                document.getElementById('geo-score').textContent = punteggio;
                mostraStatoConsole();
                suonaOk();
                nuovoRound();
            } else {
                nErrori++; registra(scen.istr);
                suonaKo();
                reset(); disegnaMano();
            }
        });

        svg.addEventListener('pointercancel', function() {
            if (!dragging) return;
            dragging = false; reset(); disegnaMano();
        });

        btnRot.addEventListener('click', function() {
            if (!partita || mano.tipo === 'punto') return;
            const lim = (mano.tipo === 'semiretta') ? 360 : 180;
            mano.rot = (mano.rot - 45 + lim) % lim;
            initAudio(); suona(440, 'sine', 0.05);
            disegnaMano();
        });

        btnSkip.addEventListener('click', function() {
            if (!partita) return;
            nSaltate++; registra(scen.istr);
            nuovoRound();
        });

        document.getElementById('geo-audio').addEventListener('click', function() {
            audioOn = !audioOn;
            this.textContent = audioOn ? 'Audio: sì' : 'Audio: no';
            if (audioOn) initAudio();
        });
        document.getElementById('geo-btn-start').addEventListener('click', iniziaPartita);
        document.getElementById('geo-btn-restart').addEventListener('click', iniziaPartita);

        // --- PULIZIA quando si esce dal gioco ---
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false; partita = false; dragging = false;
                if (timer) clearInterval(timer);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-12');
                if (st) st.remove();
            });
        }

        mostraStatoConsole();
    }
});

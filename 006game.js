// --- CARTUCCIA 006: SOLIDAMENTE! ---

window.UGOConsole.registerCartridge({
    id: 6,
    titolo: "6. Solidamente!",
    colore: "#14b8a6",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco
        const NUM_SOLIDI = 8;
        const NOMI_LIVELLO = ["Apprendista", "Costruttore", "Architetto"];

        slot.innerHTML = `
            <div id="sd-root">
                <div id="sd-container">
                    <div class="sd-hud">
                        <div>Livello: <span id="sd-liv" class="sd-v">-</span></div>
                        <div>Solido: <span id="sd-n" class="sd-v">0/${NUM_SOLIDI}</span></div>
                        <div>Punti: <span id="sd-pt" class="sd-g">0</span></div>
                    </div>

                    <div id="sd-q"></div>

                    <div id="sd-main">
                        <div id="sd-draw">
                            <div id="sd-svg"></div>
                            <div id="sd-rot">
                                <button type="button" id="sd-rl" aria-label="Ruota a sinistra">&#8634;</button>
                                <button type="button" id="sd-rr" aria-label="Ruota a destra">&#8635;</button>
                            </div>
                        </div>

                        <div id="sd-side">
                            <div id="sd-hint"></div>
                            <div id="sd-ans">&nbsp;</div>
                            <div id="sd-pad">
                                <button type="button" class="sd-key" data-k="1">1</button>
                                <button type="button" class="sd-key" data-k="2">2</button>
                                <button type="button" class="sd-key" data-k="3">3</button>
                                <button type="button" class="sd-key" data-k="4">4</button>
                                <button type="button" class="sd-key" data-k="5">5</button>
                                <button type="button" class="sd-key" data-k="6">6</button>
                                <button type="button" class="sd-key" data-k="7">7</button>
                                <button type="button" class="sd-key" data-k="8">8</button>
                                <button type="button" class="sd-key" data-k="9">9</button>
                                <button type="button" class="sd-key sd-del" data-k="DEL">←</button>
                                <button type="button" class="sd-key" data-k="0">0</button>
                                <button type="button" class="sd-key sd-ok" data-k="OK">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="sd-menu" class="sd-overlay">
                    <h2>Solidamente!</h2>
                    <p>Scegli il tuo livello:</p>
                    <button type="button" class="sd-lv sd-lv0" data-lv="0"><b>Apprendista</b><span>Conta i cubetti: solidi piccoli, che puoi anche girare per guardarli da ogni lato.</span></button>
                    <button type="button" class="sd-lv sd-lv1" data-lv="1"><b>Costruttore</b><span>Calcola il volume pezzo per pezzo.</span></button>
                    <button type="button" class="sd-lv sd-lv2" data-lv="2"><b>Architetto</b><span>Solidi con parti nascoste: gira il solido! I mattoncini grandi valgono più cubetti.</span></button>
                    <p>In tutti i livelli i solidi sono pieni: dentro non ci sono vuoti e nessun cubetto è sospeso.</p>
                </div>

                <div id="sd-end" class="sd-overlay" style="display:none;">
                    <h2>Fine della partita!</h2>
                    <p>Hai totalizzato <span id="sd-finali" style="color:#22c55e; font-weight:bold;">0</span> punti su <span id="sd-max"></span>.</p>
                    <div id="sd-endmsg"></div>
                    <div id="sd-report"></div>
                    <div class="sd-endbtns">
                        <button type="button" class="btn-start" id="sd-again">Gioca ancora</button>
                        <button type="button" class="btn-start sd-alt" id="sd-change">Scegli livello</button>
                    </div>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-6');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-6';
        styleCart.innerHTML = `
            #sd-root { position: relative; width: 100%; height: 100%; background: #0f172a; color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            #sd-container { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; overflow: hidden;
                /* l'ultimo valore è la "barra invisibile" in basso: tiene la tastiera lontana dal bordo */
                padding: 6px 8px 14px 8px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }

            /* La barra con livello, solido e punti serve solo in tutto schermo: altrimenti c'è già quella della console */
            .sd-hud { flex: 0 0 auto; width: 100%; max-width: 900px; margin: 0 auto; box-sizing: border-box;
                display: flex; justify-content: space-between; gap: 8px; background: #1e293b; border: 1px solid #334155;
                border-radius: 8px; padding: 5px 12px; font-weight: bold; font-size: 0.95rem; font-size: clamp(0.8rem, 2.8vh, 1.1rem); }
            body:not(.is-fullscreen) .sd-hud { display: none; }
            .sd-v { color: #38bdf8; }
            .sd-g { color: #22c55e; }

            #sd-q { flex: 0 0 auto; width: 100%; max-width: 900px; margin: 0 auto; text-align: center; box-sizing: border-box;
                font-weight: bold; line-height: 1.25; min-height: 2.2em; display: flex; flex-direction: column; justify-content: center;
                font-size: 0.95rem; font-size: clamp(0.85rem, 2.9vh, 1.25rem); }
            #sd-q.q0 { min-height: 2.2em; }
            #sd-q.q1 { min-height: 3.5em; }
            #sd-q.q2 { min-height: 3.1em; }
            .sd-la { color: #38bdf8; }
            .sd-lb { color: #f59e0b; }
            .sd-leg { font-size: 0.9em; }

            #sd-main { flex: 1 1 0; min-height: 0; width: 100%; max-width: 900px; margin: 0 auto;
                display: flex; flex-direction: column; gap: 4px; }
            #sd-draw { flex: 1 1 0; min-height: 0; position: relative; background: #1e293b; border: 2px solid #334155;
                border-radius: 12px; overflow: hidden; }
            #sd-svg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
            #sd-svg svg { width: 100%; height: 100%; display: block; }
            #sd-rot { display: none; position: absolute; left: 6px; right: 6px; bottom: 6px; justify-content: space-between; pointer-events: none; }
            #sd-rot.on { display: flex; }
            #sd-rot button { pointer-events: auto; width: 52px; height: 52px; border-radius: 50%; border: none;
                background: rgba(20, 184, 166, 0.85); color: #fff; font-size: 1.7rem; cursor: pointer;
                touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
            #sd-rot button:active { background: rgba(13, 148, 136, 1); }

            /* Parte bassa (aiuto, risposta, tastierino): più alta di prima, ma lo spazio lo si è recuperato
               dalla barra info e dalle righe di testo, non dal disegno */
            #sd-side { flex: 0 0 48%; min-height: 0; display: flex; flex-direction: column; gap: 4px; align-items: center; }
            #sd-hint { flex: 0 0 auto; width: 100%; min-height: 2.3em; text-align: center; color: #fbbf24; font-weight: bold; line-height: 1.15;
                display: flex; align-items: center; justify-content: center;
                font-size: 0.78rem; font-size: clamp(0.7rem, 2.1vh, 0.95rem); }
            #sd-hint.ok { color: #4ade80; }
            #sd-hint.ko { color: #f87171; }
            #sd-ans { flex: 0 0 auto; width: 100%; max-width: 420px; height: 38px; height: clamp(34px, 6vh, 52px);
                background: rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; box-sizing: border-box;
                display: flex; align-items: center; justify-content: center; line-height: 1;
                font-size: 1.5rem; font-size: clamp(1.2rem, 4.4vh, 1.8rem); font-weight: 800; letter-spacing: 2px; color: #00ffcc; }
            #sd-ans.ok { border-color: #22c55e; }
            #sd-ans.ko { border-color: #ef4444; }
            /* La dimensione dei numeri sui tasti viene regolata dal codice (adattaTasti) in base all'altezza reale dei tasti */
            #sd-pad { flex: 1 1 0; min-height: 0; width: 100%; max-width: 420px; display: grid; grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 6px; font-size: 1.2rem; font-size: clamp(1rem, 3.4vh, 1.5rem); }
            .sd-key { width: 100%; height: 100%; padding: 0; margin: 0; background: #334155; color: #fff; border: none; border-radius: 10px;
                font: inherit; font-weight: bold; line-height: 1; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent;
                display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .sd-key:active { background: #475569; }
            .sd-del { background: #64748b; }
            .sd-ok { background: #22c55e; }
            .sd-ok:active { background: #16a34a; }

            .sd-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.97);
                display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
                padding: 14px; box-sizing: border-box; text-align: center; z-index: 10; overflow-y: auto; }
            .sd-overlay h2 { margin: 0; color: #14b8a6; font-size: 1.9rem; font-size: clamp(1.5rem, 5.5vh, 2.3rem); }
            .sd-overlay p { margin: 0; color: #94a3b8; font-size: 1.05rem; font-size: clamp(0.95rem, 2.8vh, 1.2rem); }
            .sd-lv { width: 100%; max-width: 440px; border: none; border-radius: 12px; padding: 10px 14px; color: #fff; cursor: pointer;
                display: flex; flex-direction: column; gap: 2px; text-align: center; box-shadow: 0 4px rgba(0,0,0,0.35);
                touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
            .sd-lv b { font-size: 1.25rem; font-size: clamp(1.05rem, 3.6vh, 1.45rem); }
            .sd-lv span { font-size: 0.85rem; font-size: clamp(0.75rem, 2.3vh, 0.95rem); opacity: 0.92; font-weight: normal; }
            .sd-lv:active { transform: translateY(3px); box-shadow: none; }
            .sd-lv0 { background: #0d9488; }
            .sd-lv1 { background: #d97706; }
            .sd-lv2 { background: #7c3aed; }

            #sd-endmsg { color: #fde68a; font-weight: bold; max-width: 460px; }
            #sd-report { width: 100%; max-width: 560px; max-height: 42%; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(30, 41, 59, 0.85); border-radius: 10px; padding: 8px 12px; box-sizing: border-box;
                text-align: left; color: #cbd5e1; font-size: 0.9rem; line-height: 1.4; }
            .sd-rep-head { margin-bottom: 4px; }
            .sd-rep-title { color: #fbbf24; font-weight: bold; margin: 6px 0 4px 0; }
            .sd-card { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; padding-bottom: 8px;
                border-bottom: 1px solid rgba(255,255,255,0.08); }
            .sd-card .dis { flex: 0 0 96px; width: 96px; height: 96px; background: #1e293b; border-radius: 8px; }
            .sd-card .dis svg { width: 100%; height: 100%; display: block; }
            .sd-card .q { color: #f8fafc; font-weight: bold; }
            .sd-card .r { color: #94a3b8; }
            .sd-endbtns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
            .sd-overlay .btn-start { background: #14b8a6; box-shadow: 0 4px #0f766e; }
            .sd-overlay .btn-start.sd-alt { background: #64748b; box-shadow: 0 4px #475569; }

            .sd-sub { font-weight: normal; color: #94a3b8; font-size: 0.76em; line-height: 1.25; }

            /* Schermo più largo che alto (telefono in orizzontale, PC, lavagna): disegno a sinistra, tastierino a destra */
            @media (orientation: landscape) {
                #sd-main { flex-direction: row; gap: 8px; }
                #sd-draw { flex: 1.25 1 0; }
                #sd-side { flex: 1 1 0; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== UTILITÀ =====================
        const rnd = function(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; };
        function shuffle(a) {
            const r = a.slice();
            for (let i = r.length - 1; i > 0; i--) {
                const j = rnd(0, i);
                const t = r[i]; r[i] = r[j]; r[j] = t;
            }
            return r;
        }
        function volumeBox(b) { return b.dx * b.dy * b.dz; }
        function volumeTotale(boxes) {
            let s = 0;
            boxes.forEach(function(b) { s += volumeBox(b); });
            return s;
        }

        function hexToRgb(h) {
            const n = parseInt(h.slice(1), 16);
            return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        }
        // f > 0: schiarisce verso il bianco; f < 0: scurisce verso il nero
        function shade(h, f) {
            const c = hexToRgb(h);
            const t = f >= 0 ? 255 : 0;
            const a = Math.abs(f);
            return 'rgb(' + c.map(function(v) { return Math.round(v + (t - v) * a); }).join(',') + ')';
        }

        // ===================== GEOMETRIA E DISEGNO =====================
        // Un solido è { W, D, boxes: [ {x,y,z,dx,dy,dz,c} ] }.
        // Si guarda da (+x, +y, +z): si vedono la faccia superiore e le due facce che guardano +x e +y.

        function ruota90(sol) {
            const boxes = sol.boxes.map(function(b) {
                return { x: sol.D - (b.y + b.dy), y: b.x, z: b.z, dx: b.dy, dy: b.dx, dz: b.dz, c: b.c };
            });
            return { W: sol.D, D: sol.W, boxes: boxes };
        }
        function ruotata(sol, k) {
            let s = sol;
            const n = ((k % 4) + 4) % 4;
            for (let i = 0; i < n; i++) s = ruota90(s);
            return s;
        }

        let ordinaFallback = 0; // (solo per i controlli: quante volte l'ordine ha dovuto ripiegare)

        // Ordine di disegno dal più lontano al più vicino (ordinamento topologico).
        // Restituisce i pezzi ordinati e, se tre mattoncini si incrociano "a girandola"
        // (impossibile da ordinare), l'elenco di quelli rimasti bloccati.
        function ordinaTry(boxes) {
            const n = boxes.length;
            const indeg = [];
            const adj = [];
            for (let i = 0; i < n; i++) { indeg.push(0); adj.push([]); }
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i === j) continue;
                    const A = boxes[i], B = boxes[j];
                    const ab = (A.x + A.dx <= B.x) || (A.y + A.dy <= B.y) || (A.z + A.dz <= B.z);
                    const ba = (B.x + B.dx <= A.x) || (B.y + B.dy <= A.y) || (B.z + B.dz <= A.z);
                    if (ab && !ba) { adj[i].push(j); indeg[j]++; }
                }
            }
            const key = function(b) { return b.x + b.y + b.z; };
            const done = [];
            const used = [];
            for (let i = 0; i < n; i++) used.push(false);
            for (let step = 0; step < n; step++) {
                let best = -1;
                for (let i = 0; i < n; i++) {
                    if (!used[i] && indeg[i] === 0 && (best < 0 || key(boxes[i]) < key(boxes[best]))) best = i;
                }
                if (best < 0) break;
                used[best] = true;
                done.push(boxes[best]);
                adj[best].forEach(function(j) { indeg[j]--; });
            }
            const resto = [];
            for (let i = 0; i < n; i++) if (!used[i]) resto.push(i);
            return { done: done, resto: resto };
        }

        // Se serve, spezza in cubetti i mattoncini bloccati, così l'ordine esiste sempre
        function ordina(boxes) {
            let corrente = boxes;
            for (let giro = 0; giro < 6; giro++) {
                const r = ordinaTry(corrente);
                if (r.resto.length === 0) return r.done;
                const bloccati = {};
                r.resto.forEach(function(i) { bloccati[i] = true; });
                const nuove = [];
                let spezzato = false;
                corrente.forEach(function(b, i) {
                    if (bloccati[i] && volumeBox(b) > 1) {
                        spezzato = true;
                        for (let x = b.x; x < b.x + b.dx; x++) for (let y = b.y; y < b.y + b.dy; y++) for (let z = b.z; z < b.z + b.dz; z++) {
                            nuove.push({ x: x, y: y, z: z, dx: 1, dy: 1, dz: 1, c: b.c });
                        }
                    } else {
                        nuove.push(b);
                    }
                });
                if (!spezzato) {
                    ordinaFallback++;
                    const resto = r.resto.map(function(i) { return corrente[i]; });
                    resto.sort(function(p, q) { return (p.x + p.y + p.z) - (q.x + q.y + q.z); });
                    return r.done.concat(resto);
                }
                corrente = nuove;
            }
            ordinaFallback++;
            return corrente;
        }

        function renderSvg(sol, rot) {
            const s = ruotata(sol, rot);
            const ord = ordina(s.boxes);
            const C = 0.8660254;
            const px = function(x, y) { return (x - y) * C; };
            const py = function(x, y, z) { return (x + y) * 0.5 - z; };

            let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
            s.boxes.forEach(function(b) {
                for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
                    const x = b.x + i * b.dx, y = b.y + j * b.dy, z = b.z + k * b.dz;
                    const X = px(x, y), Y = py(x, y, z);
                    if (X < minX) minX = X; if (X > maxX) maxX = X;
                    if (Y < minY) minY = Y; if (Y > maxY) maxY = Y;
                }
            });
            const pad = 26;
            const sc = Math.min(80, (400 - 2 * pad) / Math.max(0.001, maxX - minX), (400 - 2 * pad) / Math.max(0.001, maxY - minY));
            const ox = 200 - ((minX + maxX) / 2) * sc;
            const oy = 200 - ((minY + maxY) / 2) * sc;
            const T = function(x, y, z) { return [px(x, y) * sc + ox, py(x, y, z) * sc + oy]; };
            const f = function(n) { return n.toFixed(1); };
            const pt = function(p) { return f(p[0]) + ',' + f(p[1]); };
            const seg = function(p, q) { return 'M' + pt(p) + 'L' + pt(q); };

            let out = '';
            ord.forEach(function(b) {
                const x0 = b.x, y0 = b.y, z0 = b.z, x1 = b.x + b.dx, y1 = b.y + b.dy, z1 = b.z + b.dz;
                const top = [T(x0, y0, z1), T(x1, y0, z1), T(x1, y1, z1), T(x0, y1, z1)];
                const rgt = [T(x1, y0, z0), T(x1, y1, z0), T(x1, y1, z1), T(x1, y0, z1)];
                const lft = [T(x0, y1, z0), T(x1, y1, z0), T(x1, y1, z1), T(x0, y1, z1)];
                const poly = function(p, col) {
                    out += '<polygon points="' + p.map(pt).join(' ') + '" fill="' + col +
                           '" stroke="rgba(0,0,0,0.7)" stroke-width="1.8" stroke-linejoin="round"/>';
                };
                poly(top, shade(b.c, 0.3));
                poly(lft, shade(b.c, -0.05));
                poly(rgt, shade(b.c, -0.32));

                // Linee che dividono le facce in cubetti unitari
                let d = '';
                for (let i = 1; i < b.dx; i++) d += seg(T(x0 + i, y0, z1), T(x0 + i, y1, z1));   // sopra
                for (let j = 1; j < b.dy; j++) d += seg(T(x0, y0 + j, z1), T(x1, y0 + j, z1));
                for (let j = 1; j < b.dy; j++) d += seg(T(x1, y0 + j, z0), T(x1, y0 + j, z1));   // destra
                for (let k = 1; k < b.dz; k++) d += seg(T(x1, y0, z0 + k), T(x1, y1, z0 + k));
                for (let i = 1; i < b.dx; i++) d += seg(T(x0 + i, y1, z0), T(x0 + i, y1, z1));   // sinistra
                for (let k = 1; k < b.dz; k++) d += seg(T(x0, y1, z0 + k), T(x1, y1, z0 + k));
                if (d) out += '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,0.32)" stroke-width="0.9"/>';
            });
            return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' + out + '</svg>';
        }

        // ===================== GENERATORI DI SOLIDI =====================
        const COL_STRATO = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
        const COL_1 = "#3b82f6", COL_2 = "#f59e0b", COL_4 = "#22c55e";
        const COL_PEZZO_A = "#38bdf8", COL_PEZZO_B = "#f59e0b";

        // APPRENDISTA: gradinate (altezze che non crescono verso chi guarda), tutto a vista
        function genA(diff, consentiPieno) {
            const cfg = [{ mw: 3, md: 2, mh: 2, cap: 12 }, { mw: 3, md: 2, mh: 3, cap: 16 }, { mw: 3, md: 3, mh: 3, cap: 22 }][diff];
            // Ogni tanto (livello alto) un blocco pieno, compreso il cubo 3 × 3 × 3
            if (consentiPieno && Math.random() < 0.25) {
                const blocchi = [[3, 3, 3], [3, 3, 3], [3, 3, 2], [2, 3, 3], [3, 2, 3], [2, 2, 3]];
                const bl = blocchi[rnd(0, blocchi.length - 1)];
                const bx = [];
                for (let x = 0; x < bl[0]; x++) for (let y = 0; y < bl[1]; y++) for (let z = 0; z < bl[2]; z++) {
                    bx.push({ x: x, y: y, z: z, dx: 1, dy: 1, dz: 1, c: COL_STRATO[z % COL_STRATO.length] });
                }
                return { tipo: 'conta', W: bl[0], D: bl[1], boxes: bx, total: bl[0] * bl[1] * bl[2], H: bl[2], pieno: true };
            }
            for (let t = 0; t < 1000; t++) {
                const W = rnd(1, cfg.mw), D = rnd(1, cfg.md);
                if (W * D < 2) continue;
                const h = [];
                for (let x = 0; x < W; x++) { h.push([]); for (let y = 0; y < D; y++) h[x].push(0); }
                h[0][0] = rnd(2, cfg.mh);
                if (Math.random() < 0.3) {
                    for (let x = 0; x < W; x++) for (let y = 0; y < D; y++) h[x][y] = h[0][0]; // blocco pieno
                } else {
                    for (let x = 0; x < W; x++) for (let y = 0; y < D; y++) {
                        if (x === 0 && y === 0) continue;
                        const ub = Math.min(x > 0 ? h[x - 1][y] : 99, y > 0 ? h[x][y - 1] : 99);
                        h[x][y] = Math.random() < 0.6 ? Math.max(0, ub - rnd(0, 1)) : rnd(0, ub);
                    }
                }
                let total = 0, hmax = 0;
                for (let x = 0; x < W; x++) for (let y = 0; y < D; y++) { total += h[x][y]; if (h[x][y] > hmax) hmax = h[x][y]; }
                if (total < 5 || total > cfg.cap) continue;
                const boxes = [];
                for (let x = 0; x < W; x++) for (let y = 0; y < D; y++) for (let z = 0; z < h[x][y]; z++) {
                    boxes.push({ x: x, y: y, z: z, dx: 1, dy: 1, dz: 1, c: COL_STRATO[z % COL_STRATO.length] });
                }
                return { tipo: 'conta', W: W, D: D, boxes: boxes, total: total, H: hmax };
            }
            // ripiego: scala semplice
            const boxes = [];
            [[0, 0, 2], [1, 0, 1], [0, 1, 1]].forEach(function(c) {
                for (let z = 0; z < c[2]; z++) boxes.push({ x: c[0], y: c[1], z: z, dx: 1, dy: 1, dz: 1, c: COL_STRATO[z] });
            });
            return { tipo: 'conta', W: 2, D: 2, boxes: boxes, total: 4, H: 2 };
        }

        // Unisce a caso alcuni cubetti in mattoncini da 2 o da 4 cubetti
        function mergeBricks(h, W, D) {
            const key = function(x, y, z) { return x + ',' + y + ',' + z; };
            const has = {};
            const list = [];
            for (let x = 0; x < W; x++) for (let y = 0; y < D; y++) for (let z = 0; z < h[x][y]; z++) {
                has[key(x, y, z)] = true;
                list.push([x, y, z]);
            }
            const used = {};
            const free = function(a, b, c) { return has[key(a, b, c)] && !used[key(a, b, c)]; };
            const boxes = [];
            shuffle(list).forEach(function(v) {
                const x = v[0], y = v[1], z = v[2];
                if (used[key(x, y, z)]) return;
                const r = Math.random();
                let placed = false;
                if (r < 0.22) {
                    const anchors = shuffle([[x, y], [x - 1, y], [x, y - 1], [x - 1, y - 1]]);
                    for (let i = 0; i < anchors.length && !placed; i++) {
                        const ax = anchors[i][0], ay = anchors[i][1];
                        if (free(ax, ay, z) && free(ax + 1, ay, z) && free(ax, ay + 1, z) && free(ax + 1, ay + 1, z)) {
                            used[key(ax, ay, z)] = used[key(ax + 1, ay, z)] = used[key(ax, ay + 1, z)] = used[key(ax + 1, ay + 1, z)] = true;
                            boxes.push({ x: ax, y: ay, z: z, dx: 2, dy: 2, dz: 1, c: COL_4 });
                            placed = true;
                        }
                    }
                }
                if (!placed && r < 0.62) {
                    const dirs = shuffle([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]);
                    for (let i = 0; i < dirs.length && !placed; i++) {
                        const d = dirs[i];
                        const nx = x + d[0], ny = y + d[1], nz = z + d[2];
                        if (free(nx, ny, nz)) {
                            used[key(x, y, z)] = used[key(nx, ny, nz)] = true;
                            boxes.push({ x: Math.min(x, nx), y: Math.min(y, ny), z: Math.min(z, nz),
                                dx: 1 + Math.abs(d[0]), dy: 1 + Math.abs(d[1]), dz: 1 + Math.abs(d[2]), c: COL_2 });
                            placed = true;
                        }
                    }
                }
                if (!placed) {
                    used[key(x, y, z)] = true;
                    boxes.push({ x: x, y: y, z: z, dx: 1, dy: 1, dz: 1, c: COL_1 });
                }
            });
            return boxes;
        }

        // COSTRUTTORE: altezze qualsiasi, con parti nascoste, ma ogni colonna è leggibile
        // da almeno una delle quattro direzioni (quindi ruotando si può sapere tutto)
        function genB(diff, tipo) {
            const cfg = [{ mw: 3, md: 3, mh: 2, min: 7, max: 16 }, { mw: 4, md: 3, mh: 3, min: 10, max: 26 }, { mw: 4, md: 4, mh: 3, min: 14, max: 36 }][diff];
            for (let t = 0; t < 3000; t++) {
                const W = rnd(2, cfg.mw), D = rnd(2, cfg.md);
                const h = [];
                let total = 0, nz = 0, hmax = 0;
                for (let x = 0; x < W; x++) {
                    h.push([]);
                    for (let y = 0; y < D; y++) {
                        const v = Math.random() < 0.2 ? 0 : rnd(1, cfg.mh);
                        h[x].push(v);
                        total += v;
                        if (v > 0) nz++;
                        if (v > hmax) hmax = v;
                    }
                }
                if (total < cfg.min || total > cfg.max || nz < 3 || hmax < 2) continue;
                let righeOk = true;
                for (let x = 0; x < W && righeOk; x++) { let s = 0; for (let y = 0; y < D; y++) s += h[x][y]; if (s === 0) righeOk = false; }
                for (let y = 0; y < D && righeOk; y++) { let s = 0; for (let x = 0; x < W; x++) s += h[x][y]; if (s === 0) righeOk = false; }
                if (!righeOk) continue;

                const g = function(xx, yy) { return (xx < 0 || yy < 0 || xx >= W || yy >= D) ? 0 : h[xx][yy]; };
                let ok = true, nascosto = false;
                for (let x = 0; x < W && ok; x++) for (let y = 0; y < D && ok; y++) {
                    const v = h[x][y];
                    if (v === 0) continue;
                    let leggibile = false;
                    [1, -1].forEach(function(sx) { [1, -1].forEach(function(sy) {
                        if (g(x + sx, y) <= v && g(x, y + sy) <= v) leggibile = true;
                    }); });
                    if (!leggibile) ok = false;
                    if (g(x + 1, y) > v || g(x, y + 1) > v) nascosto = true;
                }
                if (!ok || !nascosto) continue;

                const blocco = W * D * hmax;
                const manca = blocco - total;
                if (tipo === 'mancano' && (manca < 2 || manca > 40)) continue;

                return { tipo: tipo, W: W, D: D, H: hmax, boxes: mergeBricks(h, W, D), total: total, blocco: blocco, manca: manca };
            }
            const s = genA(diff);
            s.tipo = 'conta';
            return s;
        }

        // ARCHITETTO: due parallelepipedi (azzurro e arancio) da calcolare e sommare
        function genC(diff) {
            const max = [3, 4, 5][diff];
            for (let t = 0; t < 1000; t++) {
                const a = rnd(2, max), b = rnd(2, max), c = rnd(1, max);
                let B, W, D;
                if (Math.random() < 0.5) {
                    // pezzo sopra
                    const d = rnd(1, a), e = rnd(1, b), f = rnd(1, max);
                    if (d === a && e === b) continue;
                    const x0 = Math.random() < 0.5 ? 0 : a - d;
                    const y0 = Math.random() < 0.5 ? 0 : b - e;
                    B = { x: x0, y: y0, z: c, dx: d, dy: e, dz: f };
                    W = a; D = b;
                } else {
                    // pezzo accanto, più basso o più stretto
                    const d = rnd(1, max), e = rnd(1, b), f = rnd(1, c);
                    if (f === c && e === b) continue;
                    const y0 = rnd(0, b - e);
                    B = { x: a, y: y0, z: 0, dx: d, dy: e, dz: f };
                    W = a + d; D = b;
                }
                const A = { x: 0, y: 0, z: 0, dx: a, dy: b, dz: c };
                A.c = COL_PEZZO_A; B.c = COL_PEZZO_B;
                const VA = volumeBox(A), VB = volumeBox(B);
                return { tipo: 'volume', W: W, D: D, boxes: [A, B], VA: VA, VB: VB, total: VA + VB };
            }
            const A = { x: 0, y: 0, z: 0, dx: 3, dy: 2, dz: 2, c: COL_PEZZO_A };
            const B = { x: 0, y: 0, z: 2, dx: 1, dy: 2, dz: 2, c: COL_PEZZO_B };
            return { tipo: 'volume', W: 3, D: 2, boxes: [A, B], VA: 12, VB: 4, total: 16 };
        }

        // ===================== AUDIO =====================
        let audioCtx = null;
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
        function suonaGiusto() { tono(987.77, 0, 0.12, 'square', 0.14); tono(1318.51, 0.08, 0.3, 'square', 0.14); }
        function suonaSbagliato() { tono(150, 0, 0.35, 'sawtooth', 0.2); tono(100, 0.1, 0.3, 'sawtooth', 0.18); }
        function suonaRuota() { tono(700, 0, 0.06, 'triangle', 0.08); }

        // ===================== STATO DEL GIOCO =====================
        let livello = 0;
        let diff = 0;
        let okDiFila = 0;
        let nSolido = 0;
        let punti = 0;
        let S = null;            // solido corrente
        let rot = 0;
        let stepIdx = 0;
        let tentativi = 0;
        let input = "";
        let busy = false;
        let giocoAttivo = false;
        let pianoB = [];
        let errori = [];
        let sbagliatoInSolido = false;
        let risposteDate = [];
        let hintTimeout = null;
        let promptCorrente = "";
        let schedTimeouts = [];
        let usati = {};          // solidi già usciti in questa partita (le versioni ruotate contano come uguali)
        let pienoUsato = false;  // il blocco pieno (cubo) esce al massimo una volta per partita
        let unicoRipiego = 0;    // (solo per i controlli)

        function chiave(sol, conColore) {
            let best = null;
            for (let r = 0; r < 4; r++) {
                const q = ruotata(sol, r);
                const v = [];
                let mx = 1e9, my = 1e9, mz = 1e9;
                q.boxes.forEach(function(b) {
                    if (b.x < mx) mx = b.x; if (b.y < my) my = b.y; if (b.z < mz) mz = b.z;
                });
                q.boxes.forEach(function(b) {
                    for (let x = b.x; x < b.x + b.dx; x++) for (let y = b.y; y < b.y + b.dy; y++) for (let z = b.z; z < b.z + b.dz; z++) {
                        v.push((x - mx) + ',' + (y - my) + ',' + (z - mz) + (conColore ? ':' + b.c : ''));
                    }
                });
                v.sort();
                const k = v.join('|');
                if (best === null || k < best) best = k;
            }
            return best;
        }

        // Genera un solido che non sia già uscito in questa partita
        function unico(fn, conColore) {
            let sol = null;
            for (let i = 0; i < 300; i++) {
                sol = fn();
                const k = chiave(sol, conColore);
                if (!usati[k]) { usati[k] = true; return sol; }
            }
            unicoRipiego++;
            usati[chiave(sol, conColore)] = true;
            return sol;
        }

        function schedule(fn, ms) {
            const id = setTimeout(function() { if (alive) fn(); }, ms);
            schedTimeouts.push(id);
        }

        function aggiornaConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle(giocoAttivo ? "Solidamente! · " + NOMI_LIVELLO[livello] : "Solidamente!");
                window.UGOConsole.setScore(punti);
                if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Solido");
                window.UGOConsole.setTimer(nSolido + "/" + NUM_SOLIDI);
            }
        }

        function setHint(testo, classe, ms) {
            const el = document.getElementById("sd-hint");
            el.textContent = testo;
            el.className = classe || "";
            if (hintTimeout) clearTimeout(hintTimeout);
            if (ms) {
                hintTimeout = setTimeout(function() {
                    if (alive) { el.textContent = promptCorrente; el.className = ""; }
                }, ms);
            }
        }

        function mostraInput() {
            document.getElementById("sd-ans").innerHTML = input === "" ? "&nbsp;" : input;
        }

        function lampeggia(ok) {
            const a = document.getElementById("sd-ans");
            a.classList.remove("ok", "ko");
            a.classList.add(ok ? "ok" : "ko");
            schedule(function() { a.classList.remove("ok", "ko"); }, 350);
        }

        // I numeri sui tasti si adattano all'altezza reale dei tasti: non escono mai dal tasto
        function adattaTasti() {
            const pad = document.getElementById("sd-pad");
            if (!pad) return;
            const r = pad.getBoundingClientRect();
            if (!r.height || !r.width) return;
            const keyH = (r.height - 18) / 4;
            const keyW = (r.width - 12) / 3;
            const f = Math.max(11, Math.min(30, keyH * 0.5, keyW * 0.45));
            pad.style.fontSize = f.toFixed(1) + "px";
        }

        function disegna() {
            document.getElementById("sd-svg").innerHTML = renderSvg(S, rot);
        }

        // ===================== FLUSSO =====================
        function avviaPartita(lv) {
            initAudio();
            livello = lv;
            diff = 0;
            okDiFila = 0;
            nSolido = 0;
            punti = 0;
            giocoAttivo = true;
            busy = false;
            errori = [];
            usati = {};
            pienoUsato = false;
            pianoB = shuffle(['conta', 'conta', 'conta', 'conta', 'conta', 'mancano', 'mancano', 'mancano']);
            document.getElementById("sd-menu").style.display = "none";
            document.getElementById("sd-end").style.display = "none";
            document.getElementById("sd-liv").textContent = NOMI_LIVELLO[lv];
            document.getElementById("sd-pt").textContent = 0;
            document.getElementById("sd-rot").classList.toggle("on", true); // rotazione in tutti i livelli
            prossimoSolido();
            schedule(adattaTasti, 80);
            schedule(adattaTasti, 500);
        }

        function prossimoSolido() {
            if (nSolido >= NUM_SOLIDI) { finePartita(); return; }
            nSolido++;
            rot = 0;
            stepIdx = 0;
            tentativi = 0;
            input = "";
            busy = false;
            sbagliatoInSolido = false;
            risposteDate = [];

            const SUB = "<span class='sd-sub'>";
            const PIENO = "Solido pieno: niente vuoti, niente cubetti sospesi.";
            let domanda = "";
            if (livello === 0) {
                // APPRENDISTA
                S = unico(function() { return genA(diff, diff >= 2 && !pienoUsato); }, false);
                if (S.pieno) pienoUsato = true;
                S.steps = [{ target: S.total, testo: "" }];
                domanda = "Quanti cubetti ci sono in tutto?<br>" + SUB + PIENO + "</span>";
            } else if (livello === 1) {
                // COSTRUTTORE: due pezzi, volume a passi
                S = unico(function() { return genC(diff); }, true);
                const A = S.boxes[0], B = S.boxes[1];
                S.steps = [
                    { target: S.VA, testo: "Volume del pezzo azzurro?" },
                    { target: S.VB, testo: "Volume del pezzo arancio?" },
                    { target: S.total, testo: "Volume totale del solido?" }
                ];
                domanda = "Calcola il volume.<br><span class='sd-la sd-leg'>Pezzo azzurro: " + A.dx + " × " + A.dy + " × " + A.dz + "</span><br>" +
                          "<span class='sd-lb sd-leg'>Pezzo arancio: " + B.dx + " × " + B.dy + " × " + B.dz + "</span>";
            } else {
                // ARCHITETTO: parti nascoste, mattoncini, rotazione
                const tipo = pianoB[nSolido - 1];
                S = unico(function() { return genB(diff, tipo); }, false);
                if (S.tipo === 'mancano') {
                    S.steps = [{ target: S.manca, testo: "" }];
                    domanda = "Quanti cubetti mancano per completare un blocco " + S.W + " × " + S.D + " × " + S.H + "?<br>" +
                              SUB + "Dentro il solido non ci sono vuoti nascosti.</span>";
                } else {
                    S.steps = [{ target: S.total, testo: "" }];
                    domanda = "Quanti cubetti ci sono in tutto?<br>" + SUB + "Gira il solido per vedere dietro. I mattoncini grandi valgono più cubetti. " + PIENO + "</span>";
                }
            }

            const qEl = document.getElementById("sd-q");
            qEl.className = "q" + livello;
            qEl.innerHTML = domanda;
            S.domandaPiana = domanda.replace(/<br>.*$/, "").replace(/<[^>]+>/g, "");
            document.getElementById("sd-n").textContent = nSolido + "/" + NUM_SOLIDI;
            promptCorrente = S.steps[0].testo;
            setHint(promptCorrente, "", 0);
            mostraInput();
            disegna();
            adattaTasti();
            aggiornaConsole();
        }

        function ruotaVista(dir) {
            if (!giocoAttivo || !S) return;
            rot = (rot + dir + 4) % 4;
            suonaRuota();
            disegna();
        }

        // ---------- tastierino ----------
        function premi(k) {
            if (!giocoAttivo || busy) return;
            initAudio();
            if (k === "OK") { conferma(); return; }
            if (k === "DEL") { input = input.slice(0, -1); mostraInput(); return; }
            if (input.length < 3) { input += k; mostraInput(); }
        }

        function conferma() {
            if (!giocoAttivo || busy || input === "" || !S) return;
            const st = S.steps[stepIdx];
            const v = parseInt(input, 10);
            risposteDate.push(v);

            if (v === st.target) {
                suonaGiusto();
                lampeggia(true);
                if (livello === 1 && stepIdx < S.steps.length - 1) {
                    setHint("Esatto! " + st.target, "ok", 1100);
                    stepIdx++;
                    input = "";
                    mostraInput();
                    promptCorrente = S.steps[stepIdx].testo;
                    schedule(function() { setHint(promptCorrente, "", 0); }, 900);
                    return;
                }
                chiudiSolido(true);
            } else {
                suonaSbagliato();
                lampeggia(false);
                if (livello === 0 && tentativi === 0) {
                    // Apprendista: secondo tentativo con un aiuto
                    tentativi = 1;
                    let basso = 0;
                    S.boxes.forEach(function(b) { if (b.z === 0) basso += b.dx * b.dy; });
                    input = "";
                    mostraInput();
                    promptCorrente = "Aiuto: lo strato più in basso ha " + basso + " cubetti. Conta gli altri strati e somma.";
                    setHint(promptCorrente, "", 0);
                    return;
                }
                sbagliatoInSolido = true;
                busy = true;
                setHint("Era " + st.target, "ko", 0);
                input = "";
                mostraInput();
                if (livello === 1 && stepIdx < S.steps.length - 1) {
                    schedule(function() {
                        busy = false;
                        stepIdx++;
                        promptCorrente = S.steps[stepIdx].testo;
                        setHint(promptCorrente, "", 0);
                    }, 1300);
                    return;
                }
                chiudiSolido(false);
            }
        }

        function spiegazione(sol) {
            if (sol.tipo === 'volume') {
                const A = sol.boxes[0], B = sol.boxes[1];
                return "Pezzo azzurro: " + A.dx + " × " + A.dy + " × " + A.dz + " = " + sol.VA + ". " +
                       "Pezzo arancio: " + B.dx + " × " + B.dy + " × " + B.dz + " = " + sol.VB + ". " +
                       "Totale: " + sol.VA + " + " + sol.VB + " = " + sol.total + ".";
            }
            const strati = [];
            sol.boxes.forEach(function(b) {
                for (let z = b.z; z < b.z + b.dz; z++) strati[z] = (strati[z] || 0) + b.dx * b.dy;
            });
            const parti = [];
            const nomi = [];
            for (let z = 0; z < strati.length; z++) { parti.push(strati[z] || 0); nomi.push("strato " + (z + 1) + ": " + (strati[z] || 0)); }
            let t = "Contando per strati, dal basso: " + nomi.join(", ") + ". Totale: " + parti.join(" + ") + " = " + sol.total + " cubetti.";
            if (sol.tipo === 'mancano') {
                t += " Il blocco completo è " + sol.W + " × " + sol.D + " × " + sol.H + " = " + sol.blocco +
                     ", quindi mancano " + sol.blocco + " − " + sol.total + " = " + sol.manca + ".";
            }
            return t;
        }

        function chiudiSolido(giusto) {
            busy = true;
            let p = 0;
            if (giusto && !sbagliatoInSolido) {
                p = (livello === 0 && tentativi === 1) ? 1 : 2;
            }
            punti += p;
            document.getElementById("sd-pt").textContent = punti;
            aggiornaConsole();

            if (p < 2) {
                errori.push({ sol: S, domanda: S.domandaPiana, punti: p, risposte: risposteDate.slice(), spieg: spiegazione(S) });
            }

            if (giusto && !sbagliatoInSolido) {
                setHint(p === 2 ? "Esatto!" : "Esatto, al secondo tentativo!", "ok", 0);
            }

            // difficoltà che si adatta in modo invisibile
            if (p === 2) { okDiFila++; if (okDiFila >= 2 && diff < 2) { diff++; okDiFila = 0; } }
            else if (p === 0) { okDiFila = 0; if (diff > 0) diff--; }
            else { okDiFila = 0; }

            schedule(prossimoSolido, giusto && !sbagliatoInSolido ? 800 : 1700);
        }

        // ---------- fine partita e report ----------
        function finePartita() {
            giocoAttivo = false;
            document.getElementById("sd-finali").textContent = punti;
            document.getElementById("sd-max").textContent = NUM_SOLIDI * 2;

            let msg = "";
            if (punti === NUM_SOLIDI * 2 && livello < 2) {
                msg = "Punteggio pieno! Vuoi provare il livello " + NOMI_LIVELLO[livello + 1] + "?";
            } else if (punti <= 6 && livello > 0) {
                msg = "Se ti va, puoi provare il livello " + NOMI_LIVELLO[livello - 1] + ": è più tranquillo.";
            } else if (punti === NUM_SOLIDI * 2) {
                msg = "Punteggio pieno al livello più alto: da vero Architetto!";
            }
            document.getElementById("sd-endmsg").textContent = msg;

            const box = document.getElementById("sd-report");
            let h = "";
            if (errori.length === 0) {
                h = '<div class="sd-rep-title">Tutti i solidi perfetti!</div>';
            } else {
                h = '<div class="sd-rep-title">Da ripassare:</div>';
                errori.forEach(function(e) {
                    const stato = e.punti === 1 ? "Risolto al secondo tentativo (1 punto)." : "Le tue risposte: " + e.risposte.join(", ") + ".";
                    h += '<div class="sd-card"><div class="dis">' + renderSvg(e.sol, 0) + '</div>' +
                         '<div><div class="q">' + e.domanda + '</div><div class="r">' + stato + '</div><div class="r">' + e.spieg + '</div></div></div>';
                });
            }
            box.innerHTML = h;
            document.getElementById("sd-end").style.display = "flex";
        }

        // ===================== EVENTI =====================
        document.getElementById("sd-pad").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (b) premi(b.getAttribute("data-k"));
        });
        document.getElementById("sd-rl").addEventListener("click", function() { ruotaVista(-1); });
        document.getElementById("sd-rr").addEventListener("click", function() { ruotaVista(1); });

        document.getElementById("sd-menu").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (b && b.getAttribute("data-lv") !== null) avviaPartita(parseInt(b.getAttribute("data-lv"), 10));
        });
        document.getElementById("sd-again").addEventListener("click", function() { avviaPartita(livello); });
        document.getElementById("sd-change").addEventListener("click", function() {
            document.getElementById("sd-end").style.display = "none";
            document.getElementById("sd-menu").style.display = "flex";
        });

        window.addEventListener('resize', adattaTasti);
        window.addEventListener('orientationchange', adattaTasti);

        if (window.__sdKeyHandler) window.removeEventListener('keydown', window.__sdKeyHandler);
        window.__sdKeyHandler = function(e) {
            if (!alive || !giocoAttivo || !document.getElementById('sd-container')) return;
            if (e.key >= '0' && e.key <= '9') { premi(e.key); e.preventDefault(); }
            else if (e.key === 'Backspace') { premi('DEL'); e.preventDefault(); }
            else if (e.key === 'Enter') { premi('OK'); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { ruotaVista(-1); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { ruotaVista(1); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__sdKeyHandler);

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoAttivo = false;
                if (hintTimeout) clearTimeout(hintTimeout);
                schedTimeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('keydown', window.__sdKeyHandler);
                window.removeEventListener('resize', adattaTasti);
                window.removeEventListener('orientationchange', adattaTasti);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-6');
                if (st) st.remove();
            });
        }

        aggiornaConsole();
        // __TEST_HOOK__
    }
});

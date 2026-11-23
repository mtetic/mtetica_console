// --- CARTUCCIA 005: DIETRO L'ANGOLO ---

window.UGOConsole.registerCartridge({
    id: 5,
    titolo: "5. Dietro l'angolo",
    colore: "#0ea5e9",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        slot.innerHTML = `
            <div id="ag-root">
                <div id="ag-container">
                    <div class="ag-hud">
                        <div>Punti: <span id="ag-punti" class="ag-val">0</span></div>
                        <div>Tempo: <span id="ag-tempo" class="ag-time">60s</span></div>
                    </div>

                    <div id="ag-msg"></div>

                    <div id="ag-main">
                        <div id="ag-draw"></div>

                        <div id="ag-panel">
                            <div class="ag-specials" id="ag-specials">
                                <button type="button" class="ag-btn ag-sp" data-id="4"><span class="n">NULLO</span><span class="g">0°</span></button>
                                <button type="button" class="ag-btn ag-sp" data-id="5"><span class="n">RETTO</span><span class="g">90°</span></button>
                                <button type="button" class="ag-btn ag-sp" data-id="6"><span class="n">PIATTO</span><span class="g">180°</span></button>
                                <button type="button" class="ag-btn ag-sp" data-id="7"><span class="n">270°</span></button>
                                <button type="button" class="ag-btn ag-sp" data-id="8"><span class="n">GIRO</span><span class="g">360°</span></button>
                            </div>
                            <!-- Pulsanti normali a 2 righe flex (compatibile con i browser vecchi) -->
                            <div class="ag-normals" id="ag-normals">
                                <div class="ag-nrow">
                                    <button type="button" class="ag-btn ag-b0" data-id="0">0° &lt; &alpha; &lt; 90°</button>
                                    <button type="button" class="ag-btn ag-b1" data-id="1">90° &lt; &alpha; &lt; 180°</button>
                                </div>
                                <div class="ag-nrow">
                                    <button type="button" class="ag-btn ag-b2" data-id="2">180° &lt; &alpha; &lt; 270°</button>
                                    <button type="button" class="ag-btn ag-b3" data-id="3">270° &lt; &alpha; &lt; 360°</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="ag-start" class="ag-overlay">
                    <h2>Pronto? Giochiamo???!!!</h2>
                    <p>Indovina più angoli possibili in 60 secondi!<br>
                    Quando l'angolo è <b style="color:#fbbf24;">dorato</b> è un angolo speciale: usa i tasti dorati.</p>
                    <button type="button" class="btn-start" id="ag-btn-start">Inizia la sfida</button>
                </div>

                <div id="ag-end" class="ag-overlay" style="display:none;">
                    <h2>Tempo Scaduto!</h2>
                    <p>Hai totalizzato <span id="ag-finali" style="color:#22c55e; font-weight:bold;">0</span> punti.</p>
                    <div id="ag-report"></div>
                    <button type="button" class="btn-start" id="ag-btn-restart">Gioca Ancora</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-5');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-5';
        styleCart.innerHTML = `
            /* Radice e contenitore ancorati ai 4 lati dello slot: altezza SEMPRE definita,
               anche sui browser vecchi delle lavagne */
            #ag-root {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                background: #0f172a; color: #f8fafc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            #ag-container {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                padding: 8px; box-sizing: border-box; overflow: hidden;
            }

            .ag-hud {
                -webkit-flex: 0 0 auto; flex: 0 0 auto;
                width: 100%; max-width: 900px; margin: 0 auto 6px auto; box-sizing: border-box;
                display: -webkit-flex; display: flex;
                -webkit-justify-content: space-between; justify-content: space-between;
                background: #1e293b; border: 1px solid #334155;
                border-radius: 8px; padding: 6px 14px; font-weight: bold;
                font-size: 3vh;
                font-size: clamp(0.9rem, 3vh, 1.15rem);
            }
            .ag-val { color: #38bdf8; }
            .ag-time { color: #ef4444; }

            #ag-msg {
                -webkit-flex: 0 0 auto; flex: 0 0 auto;
                min-height: 1.7em; line-height: 1.7em; text-align: center; font-weight: bold;
                color: #4ade80; margin-bottom: 6px;
                font-size: 3vh;
                font-size: clamp(1rem, 3.4vh, 1.4rem);
            }

            #ag-main {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; width: 100%; max-width: 900px; margin: 0 auto;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
            }
            /* Riquadro del disegno: l'SVG sta in posizione assoluta, così riempie
               sempre il riquadro anche sui browser vecchi */
            #ag-draw {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; margin-bottom: 6px; position: relative;
                background: #1e293b; border: 2px solid #334155; border-radius: 12px;
                overflow: hidden;
            }
            #ag-draw svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

            #ag-panel {
                -webkit-flex: 0 0 34vh; flex: 0 0 34vh;
                -webkit-flex: 0 0 min(36vh, 300px); flex: 0 0 min(36vh, 300px);
                min-height: 0;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
            }
            .ag-specials {
                -webkit-flex: 0.8 1 0px; flex: 0.8 1 0px;
                min-height: 0; margin-bottom: 6px;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: row; flex-direction: row;
            }
            .ag-normals {
                -webkit-flex: 1.5 1 0px; flex: 1.5 1 0px;
                min-height: 0;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
            }
            .ag-nrow {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; margin-bottom: 6px;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: row; flex-direction: row;
            }
            .ag-nrow:last-child { margin-bottom: 0; }

            .ag-btn {
                border: none; border-radius: 10px; color: #fff; font-weight: bold; cursor: pointer; padding: 0 4px;
                margin: 0 6px 0 0;
                font-size: 2.6vh;
                font-size: clamp(0.8rem, 2.8vh, 1.15rem);
                box-shadow: 0 3px rgba(0,0,0,0.35);
                touch-action: manipulation; -webkit-tap-highlight-color: transparent; outline: none;
                transition: opacity 0.15s; min-width: 0;
            }
            .ag-btn:last-child { margin-right: 0; }
            .ag-nrow .ag-btn { -webkit-flex: 1 1 0px; flex: 1 1 0px; }
            .ag-btn:active { transform: translateY(3px); box-shadow: none; }
            .ag-b0 { background: #0d9488; }
            .ag-b1 { background: #d97706; }
            .ag-b2 { background: #dc2626; }
            .ag-b3 { background: #7c3aed; }
            .ag-sp {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                background: #fbbf24; color: #1f2937;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                -webkit-align-items: center; align-items: center;
                -webkit-justify-content: center; justify-content: center;
                line-height: 1.15;
                font-size: 2.1vh;
                font-size: clamp(0.65rem, 2.3vh, 0.95rem);
            }
            .ag-sp .n { font-weight: 800; }
            .ag-off { opacity: 0.28; -webkit-filter: saturate(0.3); filter: saturate(0.3); }

            .ag-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.96);
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                -webkit-align-items: center; align-items: center;
                -webkit-justify-content: center; justify-content: center;
                padding: 14px; box-sizing: border-box; text-align: center; z-index: 10; overflow-y: auto;
            }
            /* niente "gap": si usano i margini */
            .ag-overlay h2 {
                color: #38bdf8; margin: 5px 0;
                font-size: 4.5vh;
                font-size: clamp(1.4rem, 5vh, 2.1rem);
            }
            .ag-overlay p {
                margin: 5px 0; color: #94a3b8; max-width: 460px; line-height: 1.4;
                font-size: 2.6vh;
                font-size: clamp(0.95rem, 2.8vh, 1.2rem);
            }
            .ag-overlay .btn-start { background: #22c55e; box-shadow: 0 4px #16a34a; margin: 8px 0 5px 0; }

            #ag-report {
                width: 100%; max-width: 560px; max-height: 46%; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(30, 41, 59, 0.85); border-radius: 10px; padding: 8px 12px; box-sizing: border-box;
                text-align: left; color: #cbd5e1; font-size: 0.9rem; line-height: 1.4; margin: 5px 0;
            }
            .ag-rep-head { margin-bottom: 6px; }
            .ag-rep-title { color: #fbbf24; font-weight: bold; margin: 8px 0 4px 0; }
            .ag-chips { display: -webkit-flex; display: flex; -webkit-flex-wrap: wrap; flex-wrap: wrap; }
            .ag-chip { padding: 2px 8px; margin: 0 6px 6px 0; border-radius: 10px; font-size: 0.8rem; background: rgba(34,197,94,0.25); color: #bbf7d0; }
            .ag-chip.ko { background: rgba(251,191,36,0.25); color: #fde68a; }
            .ag-card {
                display: -webkit-flex; display: flex;
                -webkit-align-items: center; align-items: center;
                margin-bottom: 8px; padding-bottom: 8px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
            }
            .ag-card .dis {
                -webkit-flex: 0 0 84px; flex: 0 0 84px;
                width: 84px; height: 84px; margin-right: 10px;
                background: #1e293b; border-radius: 8px;
            }
            .ag-card .dis svg { width: 100%; height: 100%; display: block; }
            .ag-card .q { color: #f8fafc; font-weight: bold; }
            .ag-card .r { color: #94a3b8; }

            /* Telefono in orizzontale: disegno a sinistra, tasti a destra */
            @media (orientation: landscape) and (max-height: 520px) {
                #ag-main { -webkit-flex-direction: row; flex-direction: row; }
                #ag-draw { -webkit-flex: 1 1 0px; flex: 1 1 0px; margin-bottom: 0; margin-right: 6px; }
                #ag-panel { -webkit-flex: 1 1 0px; flex: 1 1 0px; }
            }
        `;
        document.head.appendChild(styleCart);

        // --- DATI DELLE CATEGORIE (0-3 normali, 4-8 speciali) ---
        const CAT = [
            { corto: "Acuto", nome: "acuto", btn: "0° < α < 90°", regola: "è maggiore di 0° e minore di 90°." },
            { corto: "Ottuso", nome: "ottuso", btn: "90° < α < 180°", regola: "è maggiore di 90° e minore di 180°." },
            { corto: "Concavo <270°", nome: "concavo minore di 270°", btn: "180° < α < 270°", regola: "è maggiore di 180° e minore di 270°: contiene l'angolo piatto." },
            { corto: "Concavo >270°", nome: "concavo maggiore di 270°", btn: "270° < α < 360°", regola: "è maggiore di 270° e minore di 360°." },
            { corto: "Nullo", nome: "nullo", btn: "NULLO 0°", regola: "misura 0°: le due semirette coincidono e non c'è apertura." },
            { corto: "Retto", nome: "retto", btn: "RETTO 90°", regola: "misura 90°: è un quarto di giro." },
            { corto: "Piatto", nome: "piatto", btn: "PIATTO 180°", regola: "misura 180°: le semirette sono opposte, è mezzo giro." },
            { corto: "270°", nome: "di 270°", btn: "270°", regola: "misura 270°: sono tre quarti di giro." },
            { corto: "Giro", nome: "giro", btn: "GIRO 360°", regola: "misura 360°: le semirette coincidono dopo un giro completo." }
        ];
        const ELOGI = ["Eccezionale!", "Bravissimo!", "Perfetto!", "Grande!", "Esatto!", "Ottimo!"];

        // --- STATO ---
        let punti = 0;
        let tempoResiduo = 60;
        let timerInterval = null;
        let giocoInCorso = false;
        let corrente = null;          // { id, amp, rot }
        let margine = 15;             // distanza (in gradi) dai confini tra le fasce
        let serie = 0;                // risposte esatte consecutive
        let erroriDiFila = 0;
        let corretteDaAgg = 0;
        let domandeFatte = 0;
        let ultimaSpeciale = false;
        let sacchettoSpeciali = [];
        let ultimoTocco = 0;
        let msgTimeout = null;
        let stats = [];               // per categoria: { ok, tot }
        let errori = [];              // angoli sbagliati

        // --- AUDIO ---
        let audioCtx = null;

        function inizializzaAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function suonaNota(frequenze, durate, tipo) {
            if (!audioCtx) return;
            let t = audioCtx.currentTime;
            frequenze.forEach(function(freq, i) {
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                osc.type = tipo;
                osc.frequency.setValueAtTime(freq, t);
                g.gain.setValueAtTime(0.15, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + durate[i]);
                osc.connect(g);
                g.connect(audioCtx.destination);
                osc.start(t);
                osc.stop(t + durate[i] + 0.02);
                t += durate[i] * 0.8;
            });
        }

        // Il suono sale di tono con la serie di risposte esatte (fino a 8)
        function suonaVittoria() {
            const f = Math.pow(2, Math.min(serie, 8) / 12);
            suonaNota([523.25 * f, 659.25 * f, 783.99 * f, 1046.50 * f], [0.1, 0.1, 0.1, 0.25], 'triangle');
        }

        function suonaSconfitta() {
            suonaNota([220.00, 146.83], [0.15, 0.35], 'sawtooth');
        }

        // --- DISEGNO DELL'ANGOLO (restituisce un <svg> come testo) ---
        function disegnaAngolo(amp, rotDeg, speciale, grande) {
            const cx = 200, cy = 200, R = 150, r = 60;
            const col = speciale ? "#fbbf24" : "#38bdf8";
            const riempi = speciale ? "rgba(251,191,36,0.28)" : "rgba(56,189,248,0.25)";
            const rad1 = rotDeg * Math.PI / 180;
            const rad2 = (rotDeg + amp) * Math.PI / 180;
            const P = function(rad, rr) { return [cx + rr * Math.cos(rad), cy - rr * Math.sin(rad)]; };
            const p1 = P(rad1, R), p2 = P(rad2, R);
            const a1 = P(rad1, r), a2 = P(rad2, r);

            let s = "";
            if (grande) {
                s += '<defs><pattern id="ag-grid" width="20" height="20" patternUnits="userSpaceOnUse">' +
                     '<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.8"/></pattern></defs>' +
                     '<rect width="400" height="400" fill="url(#ag-grid)"/>';
            }

            if (amp >= 360) {
                s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + riempi + '" stroke="' + col + '" stroke-width="2.5"/>';
            } else if (amp > 0) {
                const large = amp > 180 ? 1 : 0;
                s += '<path d="M ' + cx + ' ' + cy + ' L ' + a1[0] + ' ' + a1[1] +
                     ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + a2[0] + ' ' + a2[1] +
                     ' Z" fill="' + riempi + '" stroke="' + col + '" stroke-width="2.5"/>';
            }

            s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p1[0] + '" y2="' + p1[1] + '" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>';
            s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p2[0] + '" y2="' + p2[1] + '" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/>';
            s += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + col + '"/>';

            if (grande && speciale) {
                s += '<text x="200" y="34" text-anchor="middle" font-size="24" font-weight="bold" fill="#fbbf24" font-family="sans-serif">ANGOLO SPECIALE</text>';
            }
            return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
        }

        // --- GENERAZIONE DELL'ANGOLO ---
        function intero(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

        function scegliCategoria() {
            domandeFatte++;
            // Speciali: ~20% in media, mai nelle prime 3 domande e mai due di fila, a rotazione
            if (domandeFatte > 3 && !ultimaSpeciale && Math.random() < 0.25) {
                if (sacchettoSpeciali.length === 0) {
                    sacchettoSpeciali = [4, 5, 6, 7, 8];
                    for (let i = sacchettoSpeciali.length - 1; i > 0; i--) {
                        const j = intero(0, i);
                        const t = sacchettoSpeciali[i]; sacchettoSpeciali[i] = sacchettoSpeciali[j]; sacchettoSpeciali[j] = t;
                    }
                }
                ultimaSpeciale = true;
                return sacchettoSpeciali.pop();
            }
            ultimaSpeciale = false;
            return intero(0, 3);
        }

        function ampiezzaPer(id) {
            const m = margine;
            if (id === 0) { let a; do { a = intero(m, 90 - m); } while (a === 45); return a; }
            if (id === 1) return intero(90 + m, 180 - m);
            if (id === 2) return intero(180 + m, 270 - m);
            if (id === 3) return intero(270 + m, 360 - m);
            return [0, 90, 180, 270, 360][id - 4];
        }

        function aggiornaGruppi() {
            const speciale = corrente && corrente.id >= 4;
            document.getElementById("ag-specials").classList.toggle("ag-off", !speciale);
            document.getElementById("ag-normals").classList.toggle("ag-off", !!speciale);
        }

        function generaNuovoAngolo() {
            const id = scegliCategoria();
            const amp = ampiezzaPer(id);
            const rot = Math.random() * 360;
            corrente = { id: id, amp: amp, rot: rot };
            document.getElementById("ag-draw").innerHTML = disegnaAngolo(amp, rot, id >= 4, true);
            aggiornaGruppi();
        }

        // --- FLUSSO ---
        function aggiornaConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("Dietro l'angolo");
                window.UGOConsole.setScore(punti);
                window.UGOConsole.setTimer(Math.max(0, tempoResiduo) + "s");
            }
        }

        function mostraMessaggio(testo) {
            const el = document.getElementById("ag-msg");
            el.textContent = testo;
            if (msgTimeout) clearTimeout(msgTimeout);
            msgTimeout = setTimeout(function() {
                if (alive) el.textContent = "";
            }, 1400);
        }

        function iniziaGioco() {
            inizializzaAudio();
            punti = 0;
            tempoResiduo = 60;
            giocoInCorso = true;
            margine = 15;
            serie = 0;
            erroriDiFila = 0;
            corretteDaAgg = 0;
            domandeFatte = 0;
            ultimaSpeciale = false;
            sacchettoSpeciali = [];
            ultimoTocco = 0;
            errori = [];
            stats = [];
            for (let i = 0; i < CAT.length; i++) stats.push({ ok: 0, tot: 0 });

            document.getElementById("ag-punti").textContent = punti;
            document.getElementById("ag-tempo").textContent = tempoResiduo + "s";
            document.getElementById("ag-msg").textContent = "";
            document.getElementById("ag-start").style.display = "none";
            document.getElementById("ag-end").style.display = "none";
            aggiornaConsole();

            generaNuovoAngolo();

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                tempoResiduo--;
                document.getElementById("ag-tempo").textContent = Math.max(0, tempoResiduo) + "s";
                aggiornaConsole();
                if (tempoResiduo <= 0) terminaGioco();
            }, 1000);
        }

        function rispondi(id) {
            if (!giocoInCorso || !corrente) return;

            // Il gruppo di tasti spento non risponde
            const speciale = corrente.id >= 4;
            if ((id >= 4) !== speciale) return;

            // Protezione dal doppio tocco (alcune lavagne registrano due tocchi per uno)
            const ora = performance.now();
            if (ora - ultimoTocco < 250) return;
            ultimoTocco = ora;

            stats[corrente.id].tot++;

            if (id === corrente.id) {
                stats[corrente.id].ok++;
                punti++;
                serie++;
                suonaVittoria();
                const elogio = ELOGI[intero(0, ELOGI.length - 1)];
                mostraMessaggio(elogio + " È un angolo " + CAT[corrente.id].nome + "!");
                document.getElementById("ag-punti").textContent = punti;
                aggiornaConsole();

                if (!speciale) {
                    erroriDiFila = 0;
                    corretteDaAgg++;
                    if (corretteDaAgg >= 3) { margine = Math.max(5, margine - 2); corretteDaAgg = 0; }
                }
            } else {
                // Nessuna penalità: solo il suono, e l'angolo finisce nel report
                serie = 0;
                suonaSconfitta();
                errori.push({ id: corrente.id, amp: corrente.amp, rot: corrente.rot, scelta: id });

                if (!speciale) {
                    corretteDaAgg = 0;
                    erroriDiFila++;
                    if (erroriDiFila >= 2) { margine = Math.min(15, margine + 2); erroriDiFila = 0; }
                }
            }
            generaNuovoAngolo();
        }

        function terminaGioco() {
            giocoInCorso = false;
            clearInterval(timerInterval);
            document.getElementById("ag-finali").textContent = punti;
            costruisciReport();
            document.getElementById("ag-end").style.display = "flex";
        }

        // --- REPORT FINALE ---
        function costruisciReport() {
            const box = document.getElementById("ag-report");
            if (!box) return;

            let totTot = 0, totOk = 0;
            stats.forEach(function(s) { totTot += s.tot; totOk += s.ok; });

            let h = '<div class="ag-rep-head">Risposte giuste: <b>' + totOk + '</b> su <b>' + totTot + '</b></div>';

            if (totTot > 0) {
                h += '<div class="ag-chips">';
                stats.forEach(function(s, i) {
                    if (s.tot > 0) {
                        h += '<span class="ag-chip' + (s.ok < s.tot ? ' ko' : '') + '">' + CAT[i].corto + ' ' + s.ok + '/' + s.tot + '</span>';
                    }
                });
                h += '</div>';
            }

            if (errori.length === 0) {
                h += '<div class="ag-rep-title">' + (totTot > 0 ? 'Nessun errore: perfetto!' : '') + '</div>';
            } else {
                h += '<div class="ag-rep-title">Da ripassare:</div>';
                const MAX = 12;
                errori.slice(0, MAX).forEach(function(e) {
                    const c = CAT[e.id];
                    h += '<div class="ag-card"><div class="dis">' + disegnaAngolo(e.amp, e.rot, e.id >= 4, false) + '</div>' +
                         '<div><div class="q">' + e.amp + '° — angolo ' + c.nome + '</div>' +
                         '<div class="r">Hai scelto: ' + CAT[e.scelta].btn + '</div>' +
                         '<div class="r">Questo angolo ' + c.regola + '</div></div></div>';
                });
                if (errori.length > MAX) {
                    h += '<div class="r">…e altri ' + (errori.length - MAX) + ' errori.</div>';
                }
            }
            box.innerHTML = h;
        }

        // --- INPUT: tasti a schermo ---
        document.getElementById("ag-panel").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (!b) return;
            rispondi(parseInt(b.getAttribute("data-id"), 10));
        });

        document.getElementById("ag-btn-start").addEventListener("click", iniziaGioco);
        document.getElementById("ag-btn-restart").addEventListener("click", iniziaGioco);

        // --- INPUT: tastiera fisica (1-4 normali, 5-9 speciali) ---
        if (window.__agKeyHandler) window.removeEventListener('keydown', window.__agKeyHandler);
        window.__agKeyHandler = function(e) {
            if (!alive || !giocoInCorso || !document.getElementById('ag-container')) return;
            if (e.key >= '1' && e.key <= '9') {
                rispondi(parseInt(e.key, 10) - 1);
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', window.__agKeyHandler);

        // --- PULIZIA quando si esce dal gioco (tasto Menu della console) ---
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoInCorso = false;
                if (timerInterval) clearInterval(timerInterval);
                if (msgTimeout) clearTimeout(msgTimeout);
                window.removeEventListener('keydown', window.__agKeyHandler);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-5');
                if (st) st.remove();
            });
        }

        aggiornaConsole();
    }
});

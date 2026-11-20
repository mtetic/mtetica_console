// --- CARTUCCIA 002: chePOTENZA!!! ---

window.UGOConsole.registerCartridge({
    id: 2,
    titolo: "2. chePOTENZA!!!",
    colore: "#3b82f6",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        slot.innerHTML = `
            <div id="pot-container">
                <!-- Barra compatta: tempo, punti, audio -->
                <div id="pot-hud">
                    <div class="pot-timer">Tempo: <span id="pot-timer-val">60</span>s</div>
                    <div class="pot-score">Punti: <span id="pot-score-val">0</span></div>
                    <button id="pot-audio" type="button">🔊</button>
                </div>

                <div id="pot-main">
                    <div id="pot-screen">
                        <div id="pot-question"></div>
                        <div id="pot-buffer"></div>
                    </div>

                    <!-- Tastierino a righe flex (compatibile con i browser vecchi) -->
                    <div id="pot-numpad">
                        <div class="pot-row">
                            <button type="button" class="pot-key" data-k="1">1</button>
                            <button type="button" class="pot-key" data-k="2">2</button>
                            <button type="button" class="pot-key" data-k="3">3</button>
                        </div>
                        <div class="pot-row">
                            <button type="button" class="pot-key" data-k="4">4</button>
                            <button type="button" class="pot-key" data-k="5">5</button>
                            <button type="button" class="pot-key" data-k="6">6</button>
                        </div>
                        <div class="pot-row">
                            <button type="button" class="pot-key" data-k="7">7</button>
                            <button type="button" class="pot-key" data-k="8">8</button>
                            <button type="button" class="pot-key" data-k="9">9</button>
                        </div>
                        <div class="pot-row">
                            <button type="button" class="pot-key pot-canc" data-k="C">C</button>
                            <button type="button" class="pot-key" data-k="0">0</button>
                            <button type="button" class="pot-key pot-ok" data-k="OK">OK</button>
                        </div>
                    </div>
                </div>

                <div id="pot-start" class="pot-overlay">
                    <div class="pot-title">che<span>POTENZA!!!</span></div>
                    <p>Trova l'elemento mancante contrassegnato dal punto di domanda (?). Rispondi a più domande possibili in 60 secondi!</p>
                    <button type="button" class="btn-start" id="pot-btn-start">PARTI</button>
                </div>

                <div id="pot-end" class="pot-overlay" style="display:none;">
                    <h2>Tempo Scaduto! 🎮</h2>
                    <p style="font-size:1.3rem;">Punteggio totale: <b style="color:#22c55e;"><span id="pot-final-score">0</span> punti</b></p>
                    <div id="pot-report"></div>
                    <button type="button" class="btn-start" id="pot-btn-restart">GIOCA ANCORA</button>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-2');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-2';
        styleCart.innerHTML = `
            /* Contenitore ancorato ai 4 lati dello slot: altezza SEMPRE definita,
               anche sui browser vecchi delle lavagne */
            #pot-container {
                position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                padding: 8px; box-sizing: border-box;
                background: #0f172a; color: #f8fafc; overflow: hidden;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            #pot-hud {
                -webkit-flex: 0 0 auto; flex: 0 0 auto;
                width: 100%; max-width: 560px; margin: 0 auto 8px auto;
                display: -webkit-flex; display: flex;
                -webkit-justify-content: space-between; justify-content: space-between;
                -webkit-align-items: center; align-items: center;
                background: #334155; padding: 6px 12px; border-radius: 8px;
                font-weight: bold; box-sizing: border-box;
                font-size: 3vh;
                font-size: clamp(0.9rem, 3.2vh, 1.15rem);
            }
            .pot-timer { color: #f43f5e; }
            .pot-score { color: #22c55e; }
            #pot-audio {
                background: #1e293b; border: none; color: #fff; border-radius: 6px;
                padding: 4px 10px; font-size: 1rem; cursor: pointer; touch-action: manipulation;
            }
            #pot-main {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; width: 100%; max-width: 560px; margin: 0 auto;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
            }
            #pot-screen {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; margin-bottom: 8px;
                background: #020617; border: 2px solid #475569; border-radius: 12px;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                -webkit-justify-content: center; justify-content: center;
                -webkit-align-items: center; align-items: center;
                padding: 4px 8px; box-sizing: border-box; transition: border-color 0.15s;
            }
            #pot-screen.ok { border-color: #22c55e; }
            #pot-screen.ko { border-color: #ef4444; }
            #pot-question {
                font-weight: bold; letter-spacing: 2px; text-align: center;
                font-size: 6vh;
                font-size: clamp(1.6rem, 7vh, 2.6rem);
            }
            #pot-question sup { font-size: 0.65em; line-height: 0; }
            #pot-buffer {
                color: #3b82f6; font-weight: bold; margin-top: 6px; min-height: 1.3em;
                font-size: 5vh;
                font-size: clamp(1.3rem, 5.5vh, 2rem);
            }
            #pot-numpad {
                -webkit-flex: 1.7 1 0px; flex: 1.7 1 0px;
                min-height: 0;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
            }
            .pot-row {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-height: 0; margin-bottom: 8px;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: row; flex-direction: row;
            }
            .pot-row:last-child { margin-bottom: 0; }
            .pot-key {
                -webkit-flex: 1 1 0px; flex: 1 1 0px;
                min-width: 0; margin: 0 8px 0 0; padding: 0;
                background: #334155; color: #fff; border: none; border-radius: 10px;
                font-weight: bold; cursor: pointer;
                touch-action: manipulation;
                font-size: 4.5vh;
                font-size: clamp(1.1rem, 5vh, 1.9rem);
            }
            .pot-key:last-child { margin-right: 0; }
            .pot-key:active { background: #475569; }
            .pot-canc { background: #64748b; }
            .pot-ok { background: #22c55e; }
            .pot-ok:active { background: #16a34a; }

            .pot-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.96); z-index: 10;
                display: -webkit-flex; display: flex;
                -webkit-flex-direction: column; flex-direction: column;
                -webkit-align-items: center; align-items: center;
                -webkit-justify-content: center; justify-content: center;
                padding: 16px; box-sizing: border-box; text-align: center; overflow-y: auto;
            }
            /* niente "gap": si usano i margini */
            .pot-overlay > * { margin-top: 7px; margin-bottom: 7px; }
            .pot-overlay p {
                color: #94a3b8; max-width: 440px; line-height: 1.45;
                font-size: 2.6vh;
                font-size: clamp(0.95rem, 2.8vh, 1.15rem);
            }
            .pot-overlay h2 {
                color: #38bdf8; margin: 0;
                font-size: 4.5vh;
                font-size: clamp(1.5rem, 5vh, 2.2rem);
            }
            .pot-title {
                font-weight: 900; color: #3b82f6;
                text-shadow: 0 0 10px rgba(59,130,246,0.5); letter-spacing: 1px;
                font-size: 6vh;
                font-size: clamp(1.8rem, 7vh, 2.6rem);
            }
            .pot-title span { color: #f43f5e; }
            .pot-overlay .btn-start { background: #3b82f6; box-shadow: 0 4px 14px rgba(59,130,246,0.4); }

            #pot-report {
                width: 100%; max-width: 520px; max-height: 42%;
                overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(30, 41, 59, 0.85); border-radius: 10px; padding: 8px 12px;
                box-sizing: border-box; text-align: left; color: #cbd5e1;
                line-height: 1.45;
                font-size: 2.2vh;
                font-size: clamp(0.8rem, 2.4vh, 0.95rem);
            }
            .pot-rep-head { margin-bottom: 6px; }
            .pot-rep-title { color: #fbbf24; font-weight: bold; margin-bottom: 4px; }
            .pot-rep-item { margin-bottom: 10px; }
            .pot-rep-q { font-size: 1.2em; font-weight: bold; color: #f8fafc; }
            .pot-rep-sp { color: #94a3b8; }

            /* Telefono in orizzontale: schermo a sinistra, tastierino a destra */
            @media (orientation: landscape) and (max-height: 520px) {
                #pot-main { -webkit-flex-direction: row; flex-direction: row; }
                #pot-screen { -webkit-flex: 1 1 0px; flex: 1 1 0px; margin-bottom: 0; margin-right: 8px; }
                #pot-numpad { -webkit-flex: 1 1 0px; flex: 1 1 0px; }
            }
        `;
        document.head.appendChild(styleCart);

        // --- STATO ---
        let punteggio = 0;
        let tempoRimasto = 60;
        let timerInterval = null;
        let musicInterval = null;
        let rispostaCorretta = "";
        let inputUtente = "";
        let modalitaCorrente = "STANDARD";
        let giocoAttivo = false;
        let ultimaDomanda = "";
        let notaCorrente = 0;
        let flashTimeout = null;

        // Report finale
        let errori = {};              // domanda -> dettagli dell'errore
        let giuste = 0;
        let sbagliate = 0;
        let spiegazioneCorrente = "";
        let rispostaMostrata = "";

        // --- AUDIO ---
        let audioCtx = null;
        let audioAbilitato = true;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function suonaNota(frequenza, durata, tipo, volume) {
            if (!audioAbilitato || !audioCtx) return;
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = tipo || 'sine';
                osc.frequency.value = frequenza;
                gainNode.gain.setValueAtTime(volume || 0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, now + durata);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + durata);
            } catch (e) {}
        }

        function suonaEsito(corretto) {
            if (corretto) {
                suonaNota(523.25, 0.1, 'triangle', 0.15);
                setTimeout(function() { if (alive) suonaNota(659.25, 0.15, 'triangle', 0.15); }, 60);
            } else {
                suonaNota(180, 0.25, 'sawtooth', 0.2);
            }
        }

        function farPartireMusica() {
            if (musicInterval) clearInterval(musicInterval);
            const noteMusica = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];
            notaCorrente = 0;
            musicInterval = setInterval(function() {
                if (audioAbilitato && audioCtx && giocoAttivo) {
                    suonaNota(noteMusica[notaCorrente % noteMusica.length], 0.2, 'sine', 0.03);
                    notaCorrente++;
                }
            }, 400);
        }

        function toggleAudio() {
            audioAbilitato = !audioAbilitato;
            document.getElementById("pot-audio").textContent = audioAbilitato ? "🔊" : "🔇";
            if (audioAbilitato) initAudio();
        }

        // --- DOMANDE ---
        function sup(x) { return "<sup>" + x + "</sup>"; }
        function prodotto(b, e) {
            const f = [];
            for (let i = 0; i < e; i++) f.push(b);
            return f.join(" × ");
        }

        function generaDomandaPotenza() {
            modalitaCorrente = "STANDARD";

            const combinazioni = [
                {b: 2, e: 0, v: 1}, {b: 3, e: 0, v: 1}, {b: 5, e: 0, v: 1}, {b: 10, e: 0, v: 1}, {b: 8, e: 0, v: 1},
                {b: 2, e: 1, v: 2}, {b: 4, e: 1, v: 4}, {b: 7, e: 1, v: 7}, {b: 10, e: 1, v: 10}, {b: 15, e: 1, v: 15},
                {b: 0, e: 2, v: 0}, {b: 0, e: 5, v: 0}, {b: 0, e: 3, v: 0},
                {b: 1, e: 4, v: 1}, {b: 1, e: 9, v: 1},
                {b: 10, e: 2, v: 100}, {b: 10, e: 3, v: 1000}, {b: 10, e: 4, v: 10000}, {b: 10, e: 5, v: 100000},
                {b: 2, e: 2, v: 4}, {b: 2, e: 3, v: 8}, {b: 2, e: 4, v: 16}, {b: 2, e: 5, v: 32}, {b: 2, e: 6, v: 64},
                {b: 3, e: 2, v: 9}, {b: 3, e: 3, v: 27}, {b: 3, e: 4, v: 81},
                {b: 4, e: 2, v: 16}, {b: 4, e: 3, v: 64},
                {b: 5, e: 2, v: 25}, {b: 5, e: 3, v: 125},
                {b: 6, e: 2, v: 36}, {b: 7, e: 2, v: 49}, {b: 8, e: 2, v: 64}, {b: 9, e: 2, v: 81}
            ];

            if (Math.random() < 0.12) {
                modalitaCorrente = "JOLLY_UNO";
                spiegazioneCorrente = "1 elevato a qualsiasi esponente fa sempre 1.";
                rispostaMostrata = "qualsiasi numero";
                return `1<sup>?</sup> = 1`;
            }

            const scelta = combinazioni[Math.floor(Math.random() * combinazioni.length)];
            const b = scelta.b, e = scelta.e, v = scelta.v;
            const tipoIncognita = Math.floor(Math.random() * 3);

            if (tipoIncognita === 0) {
                // ?^e = v  (manca la base)
                if (e === 0 && v === 1) {
                    modalitaCorrente = "JOLLY_ESP_ZERO";
                    spiegazioneCorrente = "Ogni numero diverso da 0 elevato a 0 fa 1. Il caso 0" + sup(0) + " non ha significato, quindi 0 non va bene.";
                    rispostaMostrata = "qualsiasi numero diverso da 0";
                    return `?<sup>0</sup> = 1`;
                }
                rispostaCorretta = String(b);
                rispostaMostrata = String(b);
                if (e === 1) {
                    spiegazioneCorrente = "Un numero elevato a 1 resta uguale a sé stesso: ?" + sup(1) + " = " + v + ", quindi la base è " + b + ".";
                } else if (b === 0) {
                    spiegazioneCorrente = "0 elevato a un esponente maggiore di 0 fa sempre 0, quindi la base è 0.";
                } else if (b === 1) {
                    spiegazioneCorrente = "1 elevato a qualsiasi esponente fa sempre 1, quindi la base è 1.";
                } else {
                    spiegazioneCorrente = "Cerchi il numero che, usato " + e + " volte in una moltiplicazione, dà " + v + ": " + prodotto(b, e) + " = " + v + ". La base è " + b + ".";
                }
                return `?<sup>${e}</sup> = ${v}`;

            } else if (tipoIncognita === 1) {
                // b^? = v  (manca l'esponente)
                if (b === 0 && v === 0) {
                    modalitaCorrente = "JOLLY_BASE_ZERO";
                    spiegazioneCorrente = "0 elevato a un esponente maggiore di 0 fa 0. Con esponente 0 invece 0" + sup(0) + " non ha significato.";
                    rispostaMostrata = "qualsiasi numero maggiore di 0";
                    return `0<sup>?</sup> = 0`;
                }
                if (b === 1) {
                    // 1 elevato a qualsiasi esponente fa 1: va accettata qualunque risposta
                    modalitaCorrente = "JOLLY_UNO";
                    spiegazioneCorrente = "1 elevato a qualsiasi esponente fa sempre 1.";
                    rispostaMostrata = "qualsiasi numero";
                    return `1<sup>?</sup> = 1`;
                }
                rispostaCorretta = String(e);
                rispostaMostrata = String(e);
                if (e === 0) {
                    spiegazioneCorrente = "Un numero (diverso da 0) elevato a 0 fa 1, quindi l'esponente è 0.";
                } else if (e === 1) {
                    spiegazioneCorrente = b + " elevato a 1 resta " + b + ", quindi l'esponente è 1.";
                } else {
                    spiegazioneCorrente = "Quante volte serve scrivere " + b + " per ottenere " + v + "? " + prodotto(b, e) + " = " + v + ": sono " + e + " volte, quindi l'esponente è " + e + ".";
                }
                return `${b}<sup>?</sup> = ${v}`;

            } else {
                // b^e = ?  (manca il risultato)
                rispostaCorretta = String(v);
                rispostaMostrata = String(v);
                if (e === 0) {
                    spiegazioneCorrente = "Un numero (diverso da 0) elevato a 0 fa sempre 1.";
                } else if (e === 1) {
                    spiegazioneCorrente = "Un numero elevato a 1 resta uguale a sé stesso: " + b + sup(1) + " = " + b + ".";
                } else if (b === 0) {
                    spiegazioneCorrente = "0 elevato a un esponente maggiore di 0 fa sempre 0.";
                } else if (b === 1) {
                    spiegazioneCorrente = "1 elevato a qualsiasi esponente fa sempre 1.";
                } else {
                    spiegazioneCorrente = "La base " + b + " va moltiplicata per sé stessa " + e + " volte: " + prodotto(b, e) + " = " + v + ".";
                }
                return `${b}<sup>${e}</sup> = ?`;
            }
        }

        function registraErrore() {
            const k = ultimaDomanda;
            if (!errori[k]) {
                errori[k] = { q: ultimaDomanda, dato: inputUtente, giusta: rispostaMostrata, spieg: spiegazioneCorrente, n: 0 };
            }
            errori[k].n++;
            errori[k].dato = inputUtente;
        }

        function costruisciReport() {
            const box = document.getElementById("pot-report");
            if (!box) return;
            let h = '<div class="pot-rep-head">Giuste: <b>' + giuste + '</b> · Sbagliate: <b>' + sbagliate + '</b></div>';
            const chiavi = Object.keys(errori);
            if (chiavi.length === 0) {
                h += '<div><b>Nessun errore: perfetto!</b></div>';
            } else {
                h += '<div class="pot-rep-title">Da ripassare:</div>';
                chiavi.forEach(function(k) {
                    const x = errori[k];
                    h += '<div class="pot-rep-item"><div class="pot-rep-q">' + x.q + '</div>' +
                         '<div>Hai scritto: <b>' + x.dato + '</b> · Giusto: <b>' + x.giusta + '</b>' + (x.n > 1 ? ' (×' + x.n + ')' : '') + '</div>' +
                         '<div class="pot-rep-sp">' + x.spieg + '</div></div>';
                });
            }
            box.innerHTML = h;
        }

        // --- FLUSSO ---
        function mostraStatoConsole() {
            if (window.UGOConsole) {
                window.UGOConsole.setTitle("chePOTENZA!!!");
                window.UGOConsole.setScore(punteggio);
                window.UGOConsole.setTimer(tempoRimasto + "s");
            }
        }

        function iniziaGioco() {
            initAudio();
            punteggio = 0;
            tempoRimasto = 60;
            inputUtente = "";
            giocoAttivo = true;
            ultimaDomanda = "";
            errori = {};
            giuste = 0;
            sbagliate = 0;
            document.getElementById("pot-score-val").textContent = punteggio;
            document.getElementById("pot-timer-val").textContent = tempoRimasto;
            document.getElementById("pot-buffer").textContent = "";
            document.getElementById("pot-start").style.display = "none";
            document.getElementById("pot-end").style.display = "none";
            mostraStatoConsole();

            prossimaDomanda();
            farPartireMusica();

            clearInterval(timerInterval);
            timerInterval = setInterval(function() {
                tempoRimasto--;
                document.getElementById("pot-timer-val").textContent = Math.max(0, tempoRimasto);
                mostraStatoConsole();
                if (tempoRimasto <= 0) fineGioco();
            }, 1000);
        }

        function prossimaDomanda() {
            inputUtente = "";
            document.getElementById("pot-buffer").textContent = "";
            // Evita di ripetere subito la stessa domanda
            let testo = generaDomandaPotenza();
            for (let i = 0; i < 10 && testo === ultimaDomanda; i++) testo = generaDomandaPotenza();
            ultimaDomanda = testo;
            document.getElementById("pot-question").innerHTML = testo;
        }

        function lampeggia(ok) {
            const sc = document.getElementById("pot-screen");
            sc.classList.remove("ok", "ko");
            sc.classList.add(ok ? "ok" : "ko");
            if (flashTimeout) clearTimeout(flashTimeout);
            flashTimeout = setTimeout(function() {
                if (alive) sc.classList.remove("ok", "ko");
            }, 250);
        }

        function premiCifra(n) {
            if (!giocoAttivo) return;
            initAudio();
            suonaNota(440, 0.04, 'sine', 0.05);
            if (inputUtente.length < 6) {
                inputUtente += String(n);
                document.getElementById("pot-buffer").textContent = inputUtente;
            }
        }

        function cancella() {
            if (!giocoAttivo) return;
            inputUtente = inputUtente.slice(0, -1);
            document.getElementById("pot-buffer").textContent = inputUtente;
        }

        function conferma() {
            if (!giocoAttivo || inputUtente === "") return;
            let esitoCorretto = false;
            const valoreInserito = parseInt(inputUtente, 10);

            if (modalitaCorrente === "JOLLY_UNO") {
                esitoCorretto = true;
            } else if (modalitaCorrente === "JOLLY_BASE_ZERO") {
                esitoCorretto = (valoreInserito > 0);
            } else if (modalitaCorrente === "JOLLY_ESP_ZERO") {
                esitoCorretto = (valoreInserito !== 0);
            } else {
                esitoCorretto = (String(valoreInserito) === rispostaCorretta);
            }

            if (esitoCorretto) {
                punteggio++;
                giuste++;
                document.getElementById("pot-score-val").textContent = punteggio;
                mostraStatoConsole();
            } else {
                sbagliate++;
                registraErrore();
            }
            suonaEsito(esitoCorretto);
            lampeggia(esitoCorretto);
            prossimaDomanda();
        }

        function fineGioco() {
            giocoAttivo = false;
            clearInterval(timerInterval);
            clearInterval(musicInterval);
            suonaNota(120, 0.6, 'sawtooth', 0.25);
            document.getElementById("pot-final-score").textContent = punteggio;
            costruisciReport();
            document.getElementById("pot-end").style.display = "flex";
        }

        // --- INPUT: tastierino a schermo ---
        document.getElementById("pot-numpad").addEventListener("click", function(e) {
            const b = e.target.closest ? e.target.closest("button") : null;
            if (!b) return;
            const k = b.getAttribute("data-k");
            if (k === "OK") conferma();
            else if (k === "C") cancella();
            else premiCifra(k);
        });

        document.getElementById("pot-audio").addEventListener("click", toggleAudio);
        document.getElementById("pot-btn-start").addEventListener("click", iniziaGioco);
        document.getElementById("pot-btn-restart").addEventListener("click", iniziaGioco);

        // --- INPUT: tastiera fisica (cifre, Invio, Backspace) ---
        if (window.__potKeyHandler) window.removeEventListener('keydown', window.__potKeyHandler);
        window.__potKeyHandler = function(e) {
            if (!alive || !giocoAttivo || !document.getElementById('pot-container')) return;
            if (e.key >= '0' && e.key <= '9') { premiCifra(e.key); e.preventDefault(); }
            else if (e.key === 'Backspace' || e.key === 'Delete') { cancella(); e.preventDefault(); }
            else if (e.key === 'Enter') { conferma(); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__potKeyHandler);

        // --- PULIZIA quando si esce dal gioco (tasto Menu della console) ---
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                giocoAttivo = false;
                if (timerInterval) clearInterval(timerInterval);
                if (musicInterval) clearInterval(musicInterval);
                if (flashTimeout) clearTimeout(flashTimeout);
                window.removeEventListener('keydown', window.__potKeyHandler);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-2');
                if (st) st.remove();
            });
        }

        mostraStatoConsole();
    }
});

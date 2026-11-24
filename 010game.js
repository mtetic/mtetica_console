// --- CARTUCCIA 010: RETTANGOLI E QUADRATI ---
// 10 tappe di geometria piana in sequenza. Layout compatibile con i browser vecchi (flex con prefissi, niente grid né gap).
// LIVELLO 1: numeri piccoli (5 varianti per tappa, come prima).
// LIVELLO 2: numeri grandi, problemi generati a caso (migliaia di combinazioni), pensato per l'uso della calcolatrice.

window.UGOConsole.registerCartridge({
    id: 10,
    titolo: "10. Rettangoli e quadrati",
    colore: "#2563eb",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        // ===================== LE 10 TAPPE (5 varianti ciascuna, geometricamente coerenti) =====================
        // Nelle formule "A_1" diventa A con il pedice 1.
        const LEVELS1 = [
            // TAPPA 1 (*nuovo): Rettangolo, area e altezza -> base
            {
                topic: "Tappa 1 — Rettangolo",
                unit: "cm",
                hasCalculator: true,
                formulas: ["Base del rettangolo: b = A ÷ h"],
                variants: [
                    { a: 42, h: 6, ans: 7 }, { a: 63, h: 7, ans: 9 }, { a: 88, h: 8, ans: 11 },
                    { a: 108, h: 9, ans: 12 }, { a: 150, h: 10, ans: 15 }
                ],
                text: function(v) { return "Un rettangolo ha l'area di " + v.a + " cm² e l'altezza di " + v.h + " cm. Calcola la misura della base."; },
                svg: function(v) { return '<svg viewBox="0 0 380 200">' +
                    '<rect x="85" y="35" width="210" height="115" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<line x1="295" y1="35" x2="295" y2="150" stroke="#1d4ed8" stroke-width="4"/>' +
                    '<line x1="85" y1="150" x2="295" y2="150" stroke="#dc2626" stroke-width="4" stroke-dasharray="6,4"/>' +
                    '<text x="190" y="98" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="15">A = ' + v.a + ' cm²</text>' +
                    '<text x="336" y="96" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">h = ' + v.h + ' cm</text>' +
                    '<text x="190" y="174" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="15">b = ?</text></svg>'; }
            },
            // TAPPA 2 (*nuovo): Rettangolo, perimetro e base -> altezza
            {
                topic: "Tappa 2 — Rettangolo",
                unit: "cm",
                hasCalculator: true,
                formulas: ["Semiperimetro: p = P ÷ 2", "Altezza del rettangolo: h = p − b"],
                variants: [
                    { p: 30, b: 9, ans: 6 }, { p: 36, b: 11, ans: 7 }, { p: 42, b: 13, ans: 8 },
                    { p: 48, b: 15, ans: 9 }, { p: 54, b: 16, ans: 11 }
                ],
                text: function(v) { return "Il perimetro di un rettangolo è " + v.p + " cm e la sua base misura " + v.b + " cm. Calcola l'altezza."; },
                svg: function(v) { return '<svg viewBox="0 0 380 200">' +
                    '<rect x="85" y="35" width="210" height="115" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<line x1="85" y1="150" x2="295" y2="150" stroke="#1d4ed8" stroke-width="4"/>' +
                    '<line x1="295" y1="35" x2="295" y2="150" stroke="#dc2626" stroke-width="4" stroke-dasharray="6,4"/>' +
                    '<text x="190" y="22" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">P = ' + v.p + ' cm</text>' +
                    '<text x="190" y="174" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">b = ' + v.b + ' cm</text>' +
                    '<text x="336" y="96" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="15">h = ?</text></svg>'; }
            },
            // TAPPA 3: Quadrato, perimetro -> area
            {
                topic: "Tappa 3 — Quadrato",
                unit: "cm²",
                hasCalculator: true,
                formulas: ["Lato del quadrato: l = P ÷ 4", "Area del quadrato: A = l × l = l²"],
                variants: [
                    { p: 20, l: 5, ans: 25 }, { p: 24, l: 6, ans: 36 }, { p: 32, l: 8, ans: 64 },
                    { p: 36, l: 9, ans: 81 }, { p: 44, l: 11, ans: 121 }
                ],
                text: function(v) { return "Un quadrato ha il perimetro di " + v.p + " cm. Calcola la sua area."; },
                svg: function(v) { return '<svg viewBox="0 0 360 200">' +
                    '<rect x="115" y="30" width="130" height="130" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<text x="180" y="20" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">P = ' + v.p + ' cm</text>' +
                    '<text x="180" y="100" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="18">A = ?</text></svg>'; }
            },
            // TAPPA 4: Quadrato, area -> perimetro
            {
                topic: "Tappa 4 — Quadrato",
                unit: "cm",
                hasCalculator: true,
                formulas: ["Lato del quadrato: l = √A", "Perimetro del quadrato: P = l × 4"],
                variants: [
                    { a: 36, l: 6, ans: 24 }, { a: 49, l: 7, ans: 28 }, { a: 64, l: 8, ans: 32 },
                    { a: 100, l: 10, ans: 40 }, { a: 144, l: 12, ans: 48 }
                ],
                text: function(v) { return "L'area di un quadrato misura " + v.a + " cm². Calcola il suo perimetro."; },
                svg: function(v) { return '<svg viewBox="0 0 360 200">' +
                    '<rect x="115" y="25" width="130" height="130" fill="#dbeafe" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4"/>' +
                    '<text x="180" y="95" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="15">A = ' + v.a + ' cm²</text>' +
                    '<text x="180" y="180" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="15">P = ?</text></svg>'; }
            },
            // TAPPA 5: Rettangolo, area e base -> perimetro
            {
                topic: "Tappa 5 — Rettangolo",
                unit: "cm",
                hasCalculator: true,
                formulas: ["Altezza del rettangolo: h = A ÷ b", "Perimetro del rettangolo: P = (b + h) × 2"],
                variants: [
                    { a: 48, b: 8, h: 6, ans: 28 }, { a: 63, b: 9, h: 7, ans: 32 }, { a: 80, b: 10, h: 8, ans: 36 },
                    { a: 96, b: 12, h: 8, ans: 40 }, { a: 135, b: 15, h: 9, ans: 48 }
                ],
                text: function(v) { return "Un rettangolo ha l'area di " + v.a + " cm² e la base di " + v.b + " cm. Calcola il suo perimetro."; },
                svg: function(v) { return '<svg viewBox="0 0 380 200">' +
                    '<rect x="85" y="35" width="210" height="115" fill="#dbeafe" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4"/>' +
                    '<line x1="85" y1="150" x2="295" y2="150" stroke="#2563eb" stroke-width="4"/>' +
                    '<text x="190" y="98" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="15">A = ' + v.a + ' cm²</text>' +
                    '<text x="190" y="172" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">b = ' + v.b + ' cm</text>' +
                    '<text x="190" y="22" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="15">P = ?</text></svg>'; }
            },
            // TAPPA 6: Rettangolo, perimetro e altezza -> area
            {
                topic: "Tappa 6 — Rettangolo",
                unit: "cm²",
                hasCalculator: true,
                formulas: ["Semiperimetro: p = P ÷ 2", "Base del rettangolo: b = p − h", "Area del rettangolo: A = b × h"],
                variants: [
                    { p: 34, h: 7, b: 10, ans: 70 }, { p: 38, h: 8, b: 11, ans: 88 }, { p: 42, h: 9, b: 12, ans: 108 },
                    { p: 46, h: 8, b: 15, ans: 120 }, { p: 50, h: 11, b: 14, ans: 154 }
                ],
                text: function(v) { return "Il perimetro di un rettangolo è " + v.p + " cm e la sua altezza misura " + v.h + " cm. Calcola l'area."; },
                svg: function(v) { return '<svg viewBox="0 0 380 200">' +
                    '<rect x="85" y="35" width="210" height="115" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<line x1="295" y1="35" x2="295" y2="150" stroke="#1d4ed8" stroke-width="4"/>' +
                    '<text x="190" y="22" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">P = ' + v.p + ' cm</text>' +
                    '<text x="336" y="96" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">h = ' + v.h + ' cm</text>' +
                    '<text x="190" y="98" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="18">A = ?</text></svg>'; }
            },
            // TAPPA 7: Equivalenza quadrato-rettangolo
            {
                topic: "Tappa 7 — Equivalenza",
                unit: "cm",
                hasCalculator: true,
                formulas: [
                    "Lato del quadrato: l = P(quadrato) ÷ 4",
                    "Area del quadrato = Area del rettangolo: A = l²",
                    "Base del rettangolo: b = A ÷ h",
                    "Perimetro del rettangolo: P = (b + h) × 2"
                ],
                variants: [
                    { pq: 24, hr: 4, ans: 26 }, { pq: 32, hr: 4, ans: 40 }, { pq: 24, hr: 3, ans: 30 },
                    { pq: 48, hr: 9, ans: 50 }, { pq: 40, hr: 5, ans: 50 }
                ],
                text: function(v) { return "Un quadrato ha il perimetro di " + v.pq + " cm ed è equivalente a un rettangolo che ha l'altezza di " + v.hr + " cm. Calcola il perimetro del rettangolo."; },
                svg: function(v) { return '<svg viewBox="0 0 460 195">' +
                    '<rect x="35" y="42" width="105" height="105" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<text x="87" y="28" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="13">P = ' + v.pq + ' cm</text>' +
                    '<text x="87" y="99" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">A<tspan dy="4" font-size="10">1</tspan></text>' +
                    '<text x="175" y="102" text-anchor="middle" fill="#0f172a" font-weight="800" font-size="24">=</text>' +
                    '<rect x="210" y="57" width="175" height="75" fill="#fee2e2" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4"/>' +
                    '<line x1="385" y1="57" x2="385" y2="132" stroke="#2563eb" stroke-width="4"/>' +
                    '<text x="297" y="99" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">A<tspan dy="4" font-size="10">2</tspan><tspan dy="-4"> = A</tspan><tspan dy="4" font-size="10">1</tspan></text>' +
                    '<text x="424" y="99" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="13">h = ' + v.hr + ' cm</text>' +
                    '<text x="297" y="42" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="14">P = ?</text></svg>'; }
            },
            // TAPPA 8 (*nuovo): Isoperimetria rettangolo-quadrato
            {
                topic: "Tappa 8 — Isoperimetria",
                unit: "cm²",
                hasCalculator: true,
                formulas: [
                    "Base del rettangolo: b = A(rettangolo) ÷ h",
                    "Perimetro del rettangolo = Perimetro del quadrato: P = (b + h) × 2",
                    "Lato del quadrato: l = P ÷ 4",
                    "Area del quadrato: A = l²"
                ],
                variants: [
                    { ar: 32, hr: 4, br: 8, p: 24, l: 6, ans: 36 },
                    { ar: 60, hr: 6, br: 10, p: 32, l: 8, ans: 64 },
                    { ar: 96, hr: 8, br: 12, p: 40, l: 10, ans: 100 },
                    { ar: 135, hr: 9, br: 15, p: 48, l: 12, ans: 144 },
                    { ar: 180, hr: 10, br: 18, p: 56, l: 14, ans: 196 }
                ],
                text: function(v) { return "Un rettangolo ha l'area di " + v.ar + " cm² e l'altezza di " + v.hr + " cm. Calcola l'area di un quadrato isoperimetrico al rettangolo."; },
                svg: function(v) { return '<svg viewBox="0 0 460 195">' +
                    '<rect x="30" y="55" width="170" height="78" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<line x1="200" y1="55" x2="200" y2="133" stroke="#1d4ed8" stroke-width="4"/>' +
                    '<text x="115" y="99" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">A<tspan dy="4" font-size="10">1</tspan><tspan dy="-4"> = ' + v.ar + ' cm²</tspan></text>' +
                    '<text x="234" y="99" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="13">h = ' + v.hr + ' cm</text>' +
                    '<text x="115" y="40" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="13">P<tspan dy="4" font-size="10">1</tspan></text>' +
                    '<text x="278" y="102" text-anchor="middle" fill="#0f172a" font-weight="800" font-size="22">=</text>' +
                    '<rect x="315" y="42" width="105" height="105" fill="#fee2e2" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4"/>' +
                    '<text x="367" y="28" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="13">P<tspan dy="4" font-size="10">2</tspan><tspan dy="-4"> = P</tspan><tspan dy="4" font-size="10">1</tspan></text>' +
                    '<text x="367" y="99" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="16">A<tspan dy="4" font-size="11">2</tspan><tspan dy="-4"> = ?</tspan></text></svg>'; }
            },
            // TAPPA 9 (*nuovo): Rettangolo con b = 2h, area -> perimetro
            {
                topic: "Tappa 9 — Rettangolo",
                unit: "cm",
                hasCalculator: true,
                formulas: [
                    "Dividendo il rettangolo a metà si ottengono 2 quadrati congruenti di lato h",
                    "Area di ciascun quadrato: A(quadrato) = A ÷ 2",
                    "Altezza: h = √(A ÷ 2)   |   Base: b = 2 × h",
                    "Perimetro del rettangolo: P = (b + h) × 2"
                ],
                variants: [
                    { a: 32, h: 4, b: 8, ans: 24 },
                    { a: 50, h: 5, b: 10, ans: 30 },
                    { a: 72, h: 6, b: 12, ans: 36 },
                    { a: 98, h: 7, b: 14, ans: 42 },
                    { a: 128, h: 8, b: 16, ans: 48 }
                ],
                text: function(v) { return "Un rettangolo ha la base pari al doppio dell'altezza e l'area misura " + v.a + " cm². Calcola il perimetro."; },
                svg: function(v) { return '<svg viewBox="0 0 380 200">' +
                    '<rect x="75" y="40" width="230" height="115" fill="#dbeafe" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4"/>' +
                    '<line x1="190" y1="40" x2="190" y2="155" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,5"/>' +
                    '<text x="190" y="102" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="15">A = ' + v.a + ' cm²</text>' +
                    '<text x="190" y="176" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">b = 2 × h</text>' +
                    '<text x="322" y="102" text-anchor="start" fill="#1e40af" font-weight="700" font-size="14">h</text>' +
                    '<text x="190" y="24" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="15">P = ?</text></svg>'; }
            },
            // TAPPA 10: Quadrato dalle diagonali -> area esatta (niente approssimazioni)
            {
                topic: "Tappa 10 — Quadrato",
                unit: "cm²",
                hasCalculator: true,
                noApprox: true,
                formulas: [
                    "Il quadrato è un rombo con le diagonali congruenti (d_1 = d_2 = d)",
                    "Area usando le diagonali: A = (d × d) ÷ 2 = d² ÷ 2"
                ],
                variants: [
                    { d: 8, ans: 32 }, { d: 10, ans: 50 }, { d: 12, ans: 72 }, { d: 14, ans: 98 }, { d: 16, ans: 128 }
                ],
                text: function(v) { return "Le diagonali di un quadrato misurano " + v.d + " cm. Calcola l'area esatta del quadrato."; },
                svg: function(v) { return '<svg viewBox="0 0 360 205">' +
                    '<rect x="115" y="32" width="130" height="130" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>' +
                    '<line x1="115" y1="32" x2="245" y2="162" stroke="#1d4ed8" stroke-width="3"/>' +
                    '<line x1="245" y1="32" x2="115" y2="162" stroke="#1d4ed8" stroke-width="3"/>' +
                    '<text x="180" y="20" text-anchor="middle" fill="#1e40af" font-weight="700" font-size="14">d = ' + v.d + ' cm</text>' +
                    '<text x="180" y="186" text-anchor="middle" fill="#dc2626" font-weight="800" font-size="16">A = ?</text></svg>'; }
            }
        ];

        // ===================== LIVELLO 2: numeri grandi, problemi generati a caso =====================
        // Ogni funzione restituisce una variante nuova e geometricamente coerente (risultati sempre interi).
        function rndDiverso(minA, maxA, minB, maxB) {
            let a = rnd(minA, maxA), b = rnd(minB, maxB), guard = 0;
            while (a === b && guard < 50) { b = rnd(minB, maxB); guard++; }
            return [a, b];
        }
        const GEN2 = [
            // 1: A e h -> b
            function() { const r = rndDiverso(12, 48, 15, 95); const h = r[0], b = r[1]; return { a: b * h, h: h, ans: b }; },
            // 2: P e b -> h
            function() { const r = rndDiverso(20, 90, 12, 80); const b = r[0], h = r[1]; return { p: 2 * (b + h), b: b, ans: h }; },
            // 3: P quadrato -> A
            function() { const l = rnd(12, 99); return { p: 4 * l, l: l, ans: l * l }; },
            // 4: A quadrato -> P
            function() { const l = rnd(12, 99); return { a: l * l, l: l, ans: 4 * l }; },
            // 5: A e b -> P rettangolo
            function() { const r = rndDiverso(12, 60, 11, 50); const b = r[0], h = r[1]; return { a: b * h, b: b, h: h, ans: 2 * (b + h) }; },
            // 6: P e h -> A rettangolo
            function() { const r = rndDiverso(12, 60, 12, 70); const h = r[0], b = r[1]; return { p: 2 * (b + h), h: h, b: b, ans: b * h }; },
            // 7: quadrato equivalente a un rettangolo di altezza hr -> P rettangolo
            function() {
                for (let g = 0; g < 300; g++) {
                    const l = rnd(12, 60), sq = l * l, ds = [];
                    for (let d = 4; d < l; d++) { if (sq % d === 0) ds.push(d); }
                    if (ds.length) {
                        const hr = ds[rnd(0, ds.length - 1)];
                        return { pq: 4 * l, hr: hr, ans: 2 * (sq / hr + hr) };
                    }
                }
                return { pq: 96, hr: 12, ans: 120 };
            },
            // 8: isoperimetria rettangolo -> quadrato (br + hr = 2l, quindi il lato è intero)
            function() { const l = rnd(15, 70); const hr = rnd(6, l - 3); const br = 2 * l - hr; return { ar: hr * br, hr: hr, br: br, p: 4 * l, l: l, ans: l * l }; },
            // 9: b = 2h, A -> P
            function() { const h = rnd(10, 70); return { a: 2 * h * h, h: h, b: 2 * h, ans: 6 * h }; },
            // 10: diagonale (pari, così l'area è intera) -> A
            function() { const d = 2 * rnd(10, 99); return { d: d, ans: d * d / 2 }; }
        ];
        // Il livello 2 riusa testi, figure e formule del livello 1, ma con varianti generate
        const LEVELS2 = LEVELS1.map(function(l, i) {
            const o = {};
            for (const k in l) { if (Object.prototype.hasOwnProperty.call(l, k)) o[k] = l[k]; }
            o.gen = GEN2[i];
            return o;
        });

        let livello = 1;
        let LEVELS = LEVELS1;
        const N = LEVELS1.length;

        // ===================== COMPATIBILITÀ: pezzi di CSS con i prefissi per i browser vecchi =====================
        const FLEX = "display:-webkit-flex;display:flex;";
        const COL = "-webkit-flex-direction:column;flex-direction:column;";
        const ROW = "-webkit-flex-direction:row;flex-direction:row;";
        const CEN = "-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;";
        const BETW = "-webkit-justify-content:space-between;justify-content:space-between;-webkit-align-items:center;align-items:center;";
        const fl = function(v) { return "-webkit-flex:" + v + ";flex:" + v + ";"; };

        slot.innerHTML = `
            <div id="cp-container">
                <div id="cp-main">
                    <div id="cp-left">
                        <div id="cp-stepper"></div>
                        <div id="cp-top">
                            <span id="cp-tag">Tappa 1</span>
                            <span id="cp-err">Errori su questa tappa: 0</span>
                            <button type="button" id="cp-snd" aria-label="Musica">&#128266;</button>
                            <button type="button" id="cp-new">&#8635; Nuova</button>
                        </div>
                        <div id="cp-text"></div>
                        <div id="cp-fig"><div id="cp-svg"></div></div>
                        <div id="cp-formula" class="cp-hide">
                            <div class="cp-ftitle">Formule utili per questo problema</div>
                            <ul id="cp-flist"></ul>
                        </div>
                    </div>

                    <div id="cp-right">
                        <div id="cp-answer">
                            <button type="button" id="cp-calcbtn" class="cp-hide">Calc</button>
                            <div id="cp-ansval"></div>
                            <div id="cp-unit">cm²</div>
                        </div>
                        <div id="cp-fb"></div>

                        <div id="cp-keys">
                            <div id="cp-kmain">
                                <div class="cp-row"><button type="button" class="cp-key" data-k="7">7</button><button type="button" class="cp-key" data-k="8">8</button><button type="button" class="cp-key" data-k="9">9</button></div>
                                <div class="cp-row"><button type="button" class="cp-key" data-k="4">4</button><button type="button" class="cp-key" data-k="5">5</button><button type="button" class="cp-key" data-k="6">6</button></div>
                                <div class="cp-row"><button type="button" class="cp-key" data-k="1">1</button><button type="button" class="cp-key" data-k="2">2</button><button type="button" class="cp-key" data-k="3">3</button></div>
                                <div class="cp-row"><button type="button" class="cp-key cp-wide" data-k="0">0</button><button type="button" class="cp-key" data-k=",">,</button></div>
                            </div>
                            <div id="cp-kside">
                                <button type="button" class="cp-key cp-del" data-k="DEL">&#9003;</button>
                                <button type="button" class="cp-key cp-ok" data-k="OK">VERIFICA</button>
                            </div>
                        </div>

                        <div id="cp-calc" class="cp-hide">
                            <div id="cp-cdisp">0</div>
                            <div id="cp-cbody">
                                <div class="cp-crow"><button type="button" class="cp-c cp-cclr" data-calc="C">C</button><button type="button" class="cp-c cp-cop" data-calc="sqrt">√</button><button type="button" class="cp-c cp-cop" data-calc="sq">x²</button><button type="button" class="cp-c cp-cop" data-calc="/">÷</button></div>
                                <div class="cp-crow"><button type="button" class="cp-c" data-calc="7">7</button><button type="button" class="cp-c" data-calc="8">8</button><button type="button" class="cp-c" data-calc="9">9</button><button type="button" class="cp-c cp-cop" data-calc="*">×</button></div>
                                <div class="cp-crow"><button type="button" class="cp-c" data-calc="4">4</button><button type="button" class="cp-c" data-calc="5">5</button><button type="button" class="cp-c" data-calc="6">6</button><button type="button" class="cp-c cp-cop" data-calc="-">−</button></div>
                                <div class="cp-crow"><button type="button" class="cp-c" data-calc="1">1</button><button type="button" class="cp-c" data-calc="2">2</button><button type="button" class="cp-c" data-calc="3">3</button><button type="button" class="cp-c cp-cop" data-calc="+">+</button></div>
                                <div class="cp-crow"><button type="button" class="cp-c cp-cwide" data-calc="0">0</button><button type="button" class="cp-c" data-calc=".">,</button><button type="button" class="cp-c cp-ceq" data-calc="=">=</button></div>
                            </div>
                            <button type="button" id="cp-cuse">Usa il risultato nella risposta</button>
                        </div>
                    </div>
                </div>

                <!-- Istruzioni iniziali + scelta del livello -->
                <div id="cp-start" class="cp-overlay">
                    <div class="cp-title">Rettangoli e quadrati</div>
                    <p>10 tappe di geometria piana, una dopo l'altra. Leggi il problema, guarda la figura e scrivi il risultato.</p>
                    <ul class="cp-rules">
                        <li>Dopo <b>2 errori</b> sulla stessa tappa compaiono le formule utili.</li>
                        <li>Puoi usare la calcolatrice in qualsiasi momento (tasto <b>Calc</b>).</li>
                        <li>Alla <b>tappa 10</b> vale solo il risultato esatto, senza approssimazioni.</li>
                        <li>I problemi cambiano a ogni partita.</li>
                    </ul>
                    <div class="cp-lvtitle">Scegli il livello</div>
                    <div class="cp-lvls">
                        <button type="button" class="btn-start cp-lvbtn" id="cp-lv1">LIVELLO 1<small>numeri piccoli</small></button>
                        <button type="button" class="btn-start cp-lvbtn cp-lv2" id="cp-lv2">LIVELLO 2<small>numeri grandi: serve la calcolatrice</small></button>
                    </div>
                </div>

                <!-- Vittoria -->
                <div id="cp-victory" class="cp-overlay cp-hide">
                    <div id="cp-trophy">
                        <svg viewBox="0 0 120 120" width="100" height="100">
                            <path d="M30 14h60v32c0 19-13 33-30 33S30 65 30 46z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
                            <path d="M30 24H14v12c0 14 9 22 20 25" fill="none" stroke="#ca8a04" stroke-width="5" stroke-linecap="round"/>
                            <path d="M90 24h16v12c0 14-9 22-20 25" fill="none" stroke="#ca8a04" stroke-width="5" stroke-linecap="round"/>
                            <rect x="52" y="78" width="16" height="16" fill="#eab308"/>
                            <rect x="34" y="94" width="52" height="13" rx="3" fill="#ca8a04"/>
                            <polygon points="60,28 65,40 78,41 68,50 71,63 60,56 49,63 52,50 42,41 55,40" fill="#fff7cc" stroke="#ca8a04" stroke-width="1.5"/>
                        </svg>
                    </div>
                    <h2 id="cp-vtitle">Percorso completato!</h2>
                    <p id="cp-vstats"></p>
                    <div class="cp-lvls">
                        <button type="button" class="btn-start cp-lvbtn" id="cp-again">Gioca un'altra partita</button>
                        <button type="button" class="btn-start cp-lvbtn cp-lv2" id="cp-menu">Cambia livello</button>
                    </div>
                </div>

                <canvas id="cp-confetti"></canvas>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-10');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-10';
        styleCart.innerHTML = `
            /* Contenitore ancorato ai 4 lati dello slot: altezza sempre definita, anche sui browser vecchi */
            #cp-container { position: absolute; top: 0; right: 0; bottom: 0; left: 0; ${FLEX}${COL}
                padding: 8px; padding-bottom: 12px; box-sizing: border-box; background: #0f172a; color: #f8fafc; overflow: hidden;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .cp-hide { display: none !important; }

            #cp-main { ${fl("1 1 0px")} min-height: 0; width: 100%; max-width: 780px; margin: 0 auto; ${FLEX}${COL} }
            #cp-left { ${fl("1.3 1 0px")} min-height: 0; ${FLEX}${COL} }
            /* se lo schermo è troppo basso la colonna di destra scorre, invece di schiacciare i tasti */
            #cp-right { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL} margin-top: 6px; overflow-y: auto; -webkit-overflow-scrolling: touch; }

            /* barra delle 10 tappe */
            #cp-stepper { ${fl("0 0 auto")} ${FLEX}${ROW} margin-bottom: 6px; }
            .cp-pill { ${fl("1 1 0px")} min-width: 0; ${FLEX}${CEN} height: 22px; margin-right: 4px; border-radius: 6px; background: #1e293b;
                border: 1.5px solid #334155; color: #94a3b8; font-weight: 700; font-size: 0.72rem; }
            .cp-pill:last-child { margin-right: 0; }
            .cp-pill.done { background: #16a34a; border-color: #16a34a; color: #fff; }
            .cp-pill.active { background: #2563eb; border-color: #2563eb; color: #fff; box-shadow: 0 2px 8px rgba(37,99,235,0.45); }

            #cp-top { ${fl("0 0 auto")} ${FLEX}${BETW} margin-bottom: 4px; }
            #cp-tag { background: #1e3a8a; color: #bfdbfe; font-weight: 700; border-radius: 999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.3px;
                white-space: nowrap; font-size: 0.72rem; }
            #cp-err { ${fl("1 1 0px")} min-width: 0; text-align: right; color: #94a3b8; font-weight: 600; margin: 0 8px; white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; font-size: 0.72rem; }
            #cp-snd, #cp-new { background: #334155; border: none; color: #fff; border-radius: 8px; padding: 4px 9px; margin-left: 5px; cursor: pointer;
                touch-action: manipulation; font-size: 0.78rem; white-space: nowrap; }

            #cp-text { ${fl("0 0 auto")} font-weight: 500; line-height: 1.35; margin-bottom: 6px;
                font-size: 2.5vh; font-size: clamp(0.88rem, 2.6vh, 1.2rem); }

            /* la figura sta su fondo chiaro, come sul quaderno */
            #cp-fig { ${fl("1 1 0px")} min-height: 0; position: relative; background: #f8fafc; border-radius: 12px; border: 2px solid #334155; overflow: hidden; }
            #cp-svg { position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 4px; box-sizing: border-box; }
            #cp-svg svg { width: 100%; height: 100%; display: block; }
            #cp-svg svg text { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

            #cp-formula { ${fl("0 0 auto")} margin-top: 6px; background: #172554; border: 1.5px solid #3b82f6; border-radius: 12px; padding: 6px 12px; }
            .cp-ftitle { color: #93c5fd; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px; font-size: 0.68rem; }
            #cp-flist { list-style: none; margin: 0; padding: 0; color: #dbeafe; font-weight: 600; line-height: 1.4;
                font-size: 2.1vh; font-size: clamp(0.74rem, 2.1vh, 0.92rem); }
            #cp-flist li { margin: 1px 0; }

            /* risposta, messaggio e tastierino */
            #cp-answer { ${fl("0 0 auto")} ${FLEX}${ROW} -webkit-align-items: stretch; align-items: stretch; background: #020617; border: 2px solid #475569; border-radius: 12px;
                height: 7vh; min-height: 42px; max-height: 56px; box-sizing: border-box; overflow: hidden; }
            #cp-answer.ok { border-color: #22c55e; }
            #cp-answer.ko { border-color: #ef4444; }
            #cp-answer.warn { border-color: #f59e0b; }
            #cp-calcbtn { background: #0284c7; color: #fff; border: none; font-weight: 800; padding: 0 12px; cursor: pointer; touch-action: manipulation; font-size: 0.85rem; }
            #cp-ansval { ${fl("1 1 0px")} min-width: 0; ${FLEX}${CEN} -webkit-justify-content: flex-end; justify-content: flex-end; padding: 0 8px; color: #00ffcc; font-weight: 800;
                letter-spacing: 1px; white-space: nowrap; overflow: hidden; font-size: 3.6vh; font-size: clamp(1.1rem, 3.8vh, 1.7rem); }
            #cp-ansval.cp-ph { color: #475569; font-weight: 600; letter-spacing: 0; font-size: 0.9rem; }
            #cp-unit { ${fl("0 0 auto")} ${FLEX}${CEN} padding: 0 12px 0 4px; color: #94a3b8; font-weight: 700; font-size: 0.95rem; }

            #cp-fb { ${fl("0 0 auto")} min-height: 1.5em; margin: 4px 0; text-align: center; font-weight: 700; line-height: 1.4; border-radius: 8px;
                font-size: 2.2vh; font-size: clamp(0.74rem, 2.2vh, 0.95rem); }
            #cp-fb.error { color: #fca5a5; }
            #cp-fb.warn { color: #fcd34d; }
            #cp-fb.success { color: #86efac; }

            #cp-keys { ${fl("1 1 0px")} min-height: 0; ${FLEX}${ROW} width: 100%; max-width: 520px; margin: 0 auto; }
            #cp-kmain { ${fl("3 1 0px")} min-width: 0; ${FLEX}${COL} margin-right: 6px; }
            #cp-kside { ${fl("1.25 1 0px")} min-width: 0; ${FLEX}${COL} }
            .cp-row { ${fl("1 1 0px")} min-height: 0; ${FLEX}${ROW} margin-bottom: 6px; }
            .cp-row:last-child { margin-bottom: 0; }
            .cp-key { ${fl("1 1 0px")} min-width: 0; min-height: 0; margin: 0 6px 0 0; padding: 0; background: #334155; color: #fff; border: none; border-radius: 10px;
                font-weight: bold; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; line-height: 1; overflow: hidden;
                font-size: 4.4vh; font-size: clamp(1.1rem, 4.6vh, 1.8rem); }
            .cp-row .cp-key:last-child { margin-right: 0; }
            .cp-key:active { background: #475569; }
            .cp-wide { ${fl("2 1 0px")} }
            #cp-kside .cp-key { margin: 0 0 6px 0; }
            #cp-kside .cp-key:last-child { margin-bottom: 0; }
            #cp-kside .cp-del { ${fl("1 1 0px")} background: #64748b; }
            #cp-kside .cp-ok { ${fl("3 1 0px")} background: #16a34a; font-size: 2.2vh; font-size: clamp(0.72rem, 2.3vh, 1rem); letter-spacing: 0.3px; }
            #cp-kside .cp-ok:active { background: #15803d; }

            /* calcolatrice: prende il posto del tastierino.
               Altezza minima garantita: se lo schermo è troppo basso scorre la colonna di destra, i tasti non si schiacciano.
               La dimensione dei numeri viene adattata via JavaScript (fitCalc) in base allo spazio reale dei tasti. */
            #cp-calc { ${fl("1 1 0px")} min-height: 250px; ${FLEX}${COL} width: 100%; max-width: 420px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 6px; box-sizing: border-box; }
            #cp-cdisp { ${fl("0 0 auto")} background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 4px 10px; text-align: right; color: #f8fafc;
                font-weight: 700; font-family: 'Courier New', monospace; margin-bottom: 5px; overflow: hidden; white-space: nowrap; font-size: 1.15rem; line-height: 1.3;
                min-height: 1.3em; }
            #cp-cbody { ${fl("1 1 0px")} min-height: 165px; ${FLEX}${COL} }
            .cp-crow { ${fl("1 1 0px")} min-height: 32px; ${FLEX}${ROW} margin-bottom: 4px; }
            .cp-c { ${fl("1 1 0px")} min-width: 0; min-height: 0; margin: 0 4px 0 0; padding: 0; background: #334155; color: #fff; border: none; border-radius: 8px;
                font-weight: 700; cursor: pointer; touch-action: manipulation; font-size: 1rem; line-height: 1; overflow: hidden; white-space: nowrap;
                -webkit-tap-highlight-color: transparent; }
            .cp-crow .cp-c:last-child { margin-right: 0; }
            .cp-c:active { background: #475569; }
            .cp-cop { background: #0284c7; }
            .cp-cclr { background: #dc2626; }
            .cp-ceq { background: #16a34a; }
            .cp-cwide { ${fl("2 1 0px")} }
            #cp-cuse { ${fl("0 0 auto")} background: #38bdf8; color: #0f172a; border: none; border-radius: 8px; padding: 8px 6px; font-weight: 800; cursor: pointer;
                touch-action: manipulation; font-size: 0.8rem; margin-top: 2px; line-height: 1.2; }

            /* schermate sopra il gioco */
            .cp-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.96); z-index: 20; ${FLEX}${COL}${CEN}
                padding: 16px; box-sizing: border-box; text-align: center; overflow-y: auto; }
            .cp-overlay > * { margin-top: 6px; margin-bottom: 6px; }
            .cp-overlay p { color: #94a3b8; max-width: 480px; line-height: 1.45; margin-top: 4px; margin-bottom: 4px; font-size: 2.6vh; font-size: clamp(0.92rem, 2.7vh, 1.15rem); }
            .cp-overlay h2 { color: #4ade80; margin: 0; font-size: 4.6vh; font-size: clamp(1.5rem, 5vh, 2.2rem); }
            .cp-title { font-weight: 900; color: #60a5fa; letter-spacing: 0.5px; font-size: 5.4vh; font-size: clamp(1.7rem, 6vh, 2.5rem); }
            .cp-rules { list-style: none; margin: 0; padding: 10px 14px; text-align: left; background: rgba(30,41,59,0.85); border-radius: 10px; max-width: 480px; color: #cbd5e1;
                line-height: 1.4; font-size: 2.3vh; font-size: clamp(0.82rem, 2.4vh, 1rem); }
            .cp-rules li { margin: 5px 0; }
            .cp-overlay .btn-start { background: #2563eb; box-shadow: 0 4px #1e3a8a; }
            .cp-overlay .btn-start.cp-lv2 { background: #7c3aed; box-shadow: 0 4px #4c1d95; }
            .cp-lvtitle { color: #e2e8f0; font-weight: 800; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
            .cp-lvls { ${FLEX}${ROW} -webkit-flex-wrap: wrap; flex-wrap: wrap; -webkit-justify-content: center; justify-content: center; }
            .cp-lvbtn { margin: 6px 7px; padding: 10px 18px; cursor: pointer; line-height: 1.2; }
            .cp-lvbtn small { display: block; font-size: 0.68rem; font-weight: 600; opacity: 0.9; margin-top: 3px; letter-spacing: 0; text-transform: none; }
            #cp-victory { background: rgba(15, 23, 42, 0.9); }
            #cp-trophy { -webkit-transform-origin: center; }
            #cp-confetti { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 40; }

            /* Schermo largo e basso (telefono in orizzontale, lavagna): figura a sinistra, risposta a destra */
            @media (orientation: landscape) and (max-height: 560px) {
                #cp-main { ${ROW} }
                #cp-left { ${fl("1.15 1 0px")} }
                #cp-right { ${fl("1 1 0px")} margin-top: 0; margin-left: 10px; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== UTILITÀ =====================
        function el(id) { return document.getElementById(id); }
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function mostra(id) { el(id).classList.remove('cp-hide'); }
        function nascondi(id) { el(id).classList.add('cp-hide'); }
        function conPedici(t) { return t.replace(/([a-zA-Z])_([a-z0-9]+)/g, '$1<sub>$2</sub>'); }
        function trovaConAttr(target, attr) {
            let n = target;
            while (n && n !== slot) {
                if (n.getAttribute && n.getAttribute(attr) !== null) return n;
                n = n.parentNode;
            }
            return null;
        }

        // ===================== AUDIO =====================
        let audioCtx = null;
        let suoniOn = true;
        let musicTimer = null;
        let musicStep = 0;

        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }
        function nota(freq, inizio, durata, tipo, volume) {
            if (!suoniOn || !audioCtx) return;
            try {
                const t = audioCtx.currentTime + inizio;
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                osc.type = tipo;
                osc.frequency.setValueAtTime(freq, t);
                g.gain.setValueAtTime(0.0001, t);
                g.gain.linearRampToValueAtTime(volume, t + 0.012);
                g.gain.exponentialRampToValueAtTime(0.001, t + durata);
                osc.connect(g);
                g.connect(audioCtx.destination);
                osc.start(t);
                osc.stop(t + durata + 0.03);
            } catch (e) {}
        }
        function suonoTasto() { nota(520, 0, 0.04, 'sine', 0.04); }
        // Risposta giusta: piccola fanfara in salita. Più brillante se la tappa è risolta al primo tentativo.
        function suonoGiusto(primoTentativo) {
            const base = [523.25, 659.25, 783.99, 1046.50];     // Do Mi Sol Do
            base.forEach(function(f, i) { nota(f, i * 0.09, 0.22, 'triangle', 0.16); nota(f * 2, i * 0.09, 0.14, 'sine', 0.05); });
            if (primoTentativo) {
                nota(1318.51, 0.38, 0.3, 'triangle', 0.15);
                nota(1567.98, 0.46, 0.45, 'triangle', 0.14);
            }
        }
        function suonoErrore() { nota(150, 0, 0.3, 'sawtooth', 0.18); nota(100, 0.12, 0.28, 'sawtooth', 0.16); }
        function suonoAvviso() { nota(240, 0, 0.14, 'square', 0.08); nota(190, 0.16, 0.2, 'square', 0.08); }
        function suonoNuova() { nota(392, 0, 0.1, 'triangle', 0.12); nota(523.25, 0.09, 0.14, 'triangle', 0.12); }
        // Fanfara finale: tema in salita, accordo pieno e scintillio
        function suonoVittoria() {
            const tema = [[523.25, 0], [523.25, 0.14], [523.25, 0.28], [659.25, 0.42], [783.99, 0.62], [659.25, 0.9], [783.99, 1.1], [1046.50, 1.32]];
            tema.forEach(function(n, i) {
                const durata = i === tema.length - 1 ? 1.4 : 0.22;
                nota(n[0], n[1], durata, 'square', 0.07);
                nota(n[0] / 2, n[1], durata, 'triangle', 0.1);
            });
            // accordo finale di Do maggiore
            [523.25, 659.25, 783.99, 1046.50].forEach(function(f) { nota(f, 1.32, 1.8, 'triangle', 0.09); });
            nota(261.63, 1.32, 1.8, 'sine', 0.12);
            // scintillio
            [1567.98, 2093.00, 1760.00, 2349.32, 2093.00, 2637.02].forEach(function(f, i) { nota(f, 1.5 + i * 0.1, 0.25, 'sine', 0.05); });
        }

        // Musichetta di sottofondo: arpeggi leggeri su Sol, Mi minore, Do, Re
        const ACC = [[196.00, 246.94, 293.66, 392.00], [164.81, 196.00, 246.94, 329.63], [130.81, 164.81, 196.00, 261.63], [146.83, 185.00, 220.00, 293.66]];
        const BASSO = [98.00, 82.41, 65.41, 73.42];
        const SCHEMA = [0, 1, 2, 3, 2, 1, 2, 3];
        function avviaMusica() {
            fermaMusica();
            if (!audioCtx) return;
            musicStep = 0;
            musicTimer = setInterval(function() {
                if (!alive || !suoniOn || !audioCtx) return;
                const c = Math.floor(musicStep / 8) % ACC.length;
                const i = musicStep % 8;
                nota(ACC[c][SCHEMA[i]] * 2, 0, 0.5, 'triangle', 0.028);
                if (i === 0 || i === 4) nota(BASSO[c], 0, 0.9, 'sine', 0.05);
                if (i === 0 && (Math.floor(musicStep / 8) % 2 === 1)) nota(ACC[c][3] * 4, 0.15, 0.4, 'sine', 0.018);
                musicStep++;
            }, 320);
        }
        function fermaMusica() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

        // ===================== STATO =====================
        let step = 0;                // tappa corrente (0-9)
        let sel = [];                // variante scelta (oggetto) per ogni tappa
        let ultimaFirma = "";
        let sbagliati = 0;           // errori su questa tappa
        let totErrori = 0;
        let primoTentativo = 0;      // tappe risolte al primo tentativo
        let ans = "";                // risposta digitata
        let fase = 'start';          // 'start' | 'gioco' | 'blocco' | 'fine'
        let calcAperta = false;
        let gettone = 0;             // cambia a ogni nuova partita: cancella le azioni in attesa
        const timeouts = [];
        let fbTimeout = null;

        function schedule(fn, ms) {
            const mio = gettone;
            timeouts.push(setTimeout(function() { if (alive && mio === gettone) fn(); }, ms));
        }

        function aggiornaConsole() {
            if (!window.UGOConsole) return;
            window.UGOConsole.setTitle("Rettangoli e quadrati — Livello " + livello);
            window.UGOConsole.setScore(primoTentativo);
            if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Tappa");
            window.UGOConsole.setTimer(Math.min(step + 1, N) + "/" + N);
        }

        function scegliVariante(l) {
            if (l.gen) return l.gen();
            return l.variants[rnd(0, l.variants.length - 1)];
        }

        function generaCombinazione() {
            let combo = [], firma = "", guard = 0;
            do {
                combo = LEVELS.map(scegliVariante);
                firma = livello + JSON.stringify(combo);
                guard++;
            } while (firma === ultimaFirma && guard < 30);
            ultimaFirma = firma;
            return combo;
        }

        function disegnaStepper() {
            const s = el('cp-stepper');
            s.innerHTML = '';
            for (let i = 0; i < N; i++) {
                const p = document.createElement('div');
                p.className = 'cp-pill' + (i < step ? ' done' : (i === step ? ' active' : ''));
                p.textContent = i < step ? '✓' : String(i + 1);
                s.appendChild(p);
            }
        }

        function mostraRisposta() {
            const v = el('cp-ansval');
            if (ans === "") { v.textContent = "Scrivi il risultato"; v.classList.add('cp-ph'); }
            else { v.textContent = ans; v.classList.remove('cp-ph'); }
        }

        function fb(testo, tipo, ms) {
            const f = el('cp-fb');
            f.textContent = testo;
            f.className = tipo || "";
            if (fbTimeout) clearTimeout(fbTimeout);
            if (ms) fbTimeout = setTimeout(function() { if (alive) { f.textContent = ""; f.className = ""; } }, ms);
        }
        function bordo(classe) {
            const a = el('cp-answer');
            a.classList.remove('ok', 'ko', 'warn');
            a.classList.add(classe);
            schedule(function() { a.classList.remove('ok', 'ko', 'warn'); }, 450);
        }

        function disegnaTappa() {
            const L = LEVELS[step];
            const v = sel[step];
            sbagliati = 0;
            ans = "";
            calcAperta = false;
            el('cp-tag').textContent = L.topic;
            el('cp-err').textContent = "Errori su questa tappa: 0";
            el('cp-text').textContent = L.text(v);
            el('cp-svg').innerHTML = L.svg(v);
            el('cp-unit').textContent = L.unit;
            el('cp-flist').innerHTML = L.formulas.map(function(f) { return '<li>• ' + conPedici(f) + '</li>'; }).join('');
            nascondi('cp-formula');
            fb("", "", 0);
            if (L.hasCalculator) { mostra('cp-calcbtn'); azzeraCalc(); } else { nascondi('cp-calcbtn'); }
            nascondi('cp-calc'); mostra('cp-keys');
            mostraRisposta();
            disegnaStepper();
            aggiornaConsole();
        }

        function nuovaPartita() {
            gettone++;
            sel = generaCombinazione();
            step = 0;
            totErrori = 0;
            primoTentativo = 0;
            fase = 'gioco';
            nascondi('cp-victory');
            confettiStop();
            disegnaTappa();
        }

        function impostaLivello(n) {
            livello = n;
            LEVELS = (n === 2) ? LEVELS2 : LEVELS1;
            ultimaFirma = "";
        }

        // ===================== VERIFICA =====================
        function verifica() {
            if (fase !== 'gioco') return;
            const raw = ans.trim();
            if (!raw) return;
            const L = LEVELS[step];
            const v = sel[step];

            // tappa 10: niente valori approssimati
            if (L.noApprox && /[.,]/.test(raw)) {
                registraErrore();
                suonoAvviso();
                fb("Qui non si accettano valori approssimati", "warn", 0);
                bordo('warn');
                ans = ""; mostraRisposta();
                return;
            }
            if (!/^\d+([.,]\d*)?$/.test(raw)) {
                suonoErrore();
                fb("Inserisci un numero valido.", "error", 2500);
                bordo('ko');
                ans = ""; mostraRisposta();
                return;
            }
            const valore = Number(raw.replace(',', '.'));
            if (Math.abs(valore - v.ans) < 0.001) {
                fase = 'blocco';                      // evita doppi invii durante il passaggio alla tappa successiva
                const primo = (sbagliati === 0);
                if (primo) primoTentativo++;
                suonoGiusto(primo);
                bordo('ok');
                fb("Esatto! Passiamo al problema successivo...", "success", 0);
                aggiornaConsole();
                schedule(function() {
                    step++;
                    if (step < N) {
                        fase = 'gioco';
                        disegnaTappa();
                    } else {
                        disegnaStepper();
                        vittoria();
                    }
                }, 950);
            } else {
                registraErrore();
                suonoErrore();
                bordo('ko');
                fb(sbagliati >= 2 ? "Non è corretto. Guarda le formule e riprova!" : "Risposta non corretta: riprova!", "error", 0);
                ans = ""; mostraRisposta();
            }
        }

        function registraErrore() {
            sbagliati++;
            totErrori++;
            el('cp-err').textContent = "Errori su questa tappa: " + sbagliati;
            if (sbagliati >= 2) mostra('cp-formula');
        }

        // ===================== TASTIERINO =====================
        function tasto(k) {
            if (fase !== 'gioco') return;
            initAudio();
            if (k === 'OK') { verifica(); return; }
            if (k === 'DEL') { ans = ans.slice(0, -1); mostraRisposta(); return; }
            suonoTasto();
            if (k === ',') {
                if (ans.indexOf(',') === -1 && ans.length > 0 && ans.length < 8) { ans += ','; mostraRisposta(); }
                return;
            }
            if (/^[0-9]$/.test(k) && ans.length < 8) { ans += k; mostraRisposta(); }
        }

        // ===================== CALCOLATRICE =====================
        let cCur = "0", cPrev = null, cOp = null, cReset = false;
        function azzeraCalc() { cCur = "0"; cPrev = null; cOp = null; cReset = false; mostraCalc(); }
        function mostraCalc() {
            const d = el('cp-cdisp');
            d.textContent = cCur.replace('.', ',');
            // numeri lunghi: display più piccolo, così non escono dal riquadro
            const n = cCur.length;
            d.style.fontSize = n > 14 ? '0.8rem' : (n > 11 ? '0.95rem' : (n > 9 ? '1.05rem' : '1.15rem'));
        }
        // Adatta la grandezza dei numeri dei tasti allo spazio realmente disponibile (altezza e larghezza del tasto)
        function fitCalc() {
            if (!calcAperta) return;
            const calc = el('cp-calc');
            const righe = calc.getElementsByClassName('cp-crow');
            const tasti = calc.getElementsByClassName('cp-c');
            if (!righe.length || !tasti.length) return;
            const h = righe[0].clientHeight;
            const w = tasti[1] ? tasti[1].clientWidth : tasti[0].clientWidth;
            if (!h || !w) return;
            let fs = Math.floor(Math.min(h * 0.55, w * 0.5));
            fs = Math.max(11, Math.min(fs, 26));
            for (let i = 0; i < tasti.length; i++) tasti[i].style.fontSize = fs + 'px';
        }
        function arrotonda(x) { return Math.round(x * 100000) / 100000; }
        function calcola(a, b, op) {
            if (op === '+') return a + b;
            if (op === '-') return a - b;
            if (op === '*') return a * b;
            if (op === '/') return b === 0 ? NaN : a / b;
            return b;
        }
        function calcTasto(val) {
            if (val === 'C') { azzeraCalc(); return; }
            if (cCur === "Errore" && val !== 'C') { cCur = "0"; cPrev = null; cOp = null; }
            if (val === 'sqrt') {
                const n = parseFloat(cCur);
                if (n >= 0) { cCur = String(arrotonda(Math.sqrt(n))); cReset = true; mostraCalc(); }
                return;
            }
            if (val === 'sq') {
                const n = parseFloat(cCur);
                cCur = String(arrotonda(n * n)); cReset = true; mostraCalc();
                return;
            }
            if (val === '+' || val === '-' || val === '*' || val === '/') {
                if (cOp && !cReset) {
                    const r = calcola(cPrev, parseFloat(cCur), cOp);
                    cCur = isNaN(r) ? "Errore" : String(arrotonda(r));
                    mostraCalc();
                    if (cCur === "Errore") { cPrev = null; cOp = null; return; }
                }
                cPrev = parseFloat(cCur);
                cOp = val;
                cReset = true;
                return;
            }
            if (val === '=') {
                if (cOp !== null && cPrev !== null) {
                    const r = calcola(cPrev, parseFloat(cCur), cOp);
                    cCur = isNaN(r) ? "Errore" : String(arrotonda(r));
                    cPrev = null; cOp = null; cReset = true;
                    mostraCalc();
                }
                return;
            }
            if (val === '.') {
                if (cReset) { cCur = "0."; cReset = false; }
                else if (cCur.indexOf('.') === -1) cCur += '.';
                mostraCalc();
                return;
            }
            // cifre
            if (cReset || cCur === "0") { cCur = val; cReset = false; }
            else if (cCur.length < 12) cCur += val;
            mostraCalc();
        }
        function calcApriChiudi() {
            if (fase !== 'gioco') return;
            calcAperta = !calcAperta;
            if (calcAperta) {
                nascondi('cp-keys'); mostra('cp-calc');
                fitCalc();
                schedule(fitCalc, 60);   // secondo passaggio, quando il layout è definitivo
            }
            else { nascondi('cp-calc'); mostra('cp-keys'); }
        }
        function calcUsa() {
            if (cCur !== "Errore") {
                ans = cCur.replace('.', ',').slice(0, 8);
                mostraRisposta();
            }
            calcAperta = false;
            nascondi('cp-calc'); mostra('cp-keys');
        }

        // ===================== CORIANDOLI =====================
        const CF_COL = ['#f43f5e', '#f59e0b', '#22c55e', '#38bdf8', '#a855f7', '#facc15', '#ec4899', '#14b8a6'];
        let cfParts = [], cfRaf = null, cfCtx = null, cfW = 0, cfH = 0, cfT0 = 0, cfLast = 0, cfBurst2 = false;

        function cfPrepara() {
            const cv = el('cp-confetti');
            const box = el('cp-container');
            cfW = box.clientWidth; cfH = box.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = Math.round(cfW * dpr);
            cv.height = Math.round(cfH * dpr);
            cfCtx = cv.getContext('2d');
            if (cfCtx) cfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        function cfAggiungi(x, y, vx, vy) {
            cfParts.push({ x: x, y: y, vx: vx, vy: vy, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35,
                w: 6 + Math.random() * 7, h: 9 + Math.random() * 9, c: CF_COL[rnd(0, CF_COL.length - 1)],
                ph: Math.random() * 6.28, ps: 0.08 + Math.random() * 0.18, tondo: Math.random() < 0.2 });
        }
        function cfCannone(lato) {
            const k = Math.max(0.7, Math.min(1.6, cfH / 600));
            for (let i = 0; i < 70; i++) {
                const ang = (55 + Math.random() * 25) * Math.PI / 180;
                const vel = (12 + Math.random() * 11) * k;
                cfAggiungi(lato < 0 ? 0 : cfW, cfH, (lato < 0 ? 1 : -1) * Math.cos(ang) * vel, -Math.sin(ang) * vel);
            }
        }
        function cfPioggia(n) {
            const k = Math.max(0.7, Math.min(1.6, cfH / 600));
            for (let i = 0; i < n; i++) cfAggiungi(Math.random() * cfW, -12, (Math.random() - 0.5) * 2, (1.5 + Math.random() * 2) * k);
        }
        function cfFrame(ts) {
            if (!alive || !cfCtx) return;
            const dt = Math.min(3, Math.max(0.2, ((ts || Date.now()) - (cfLast || ts || Date.now())) / 16.667));
            cfLast = ts || Date.now();
            const t = (ts || Date.now()) - cfT0;
            if (!cfBurst2 && t > 1500) { cfBurst2 = true; cfCannone(-1); cfCannone(1); }
            if (t < 6000) cfPioggia(Math.random() < (t < 3000 ? 0.7 : 0.35) ? 1 : 0);

            cfCtx.clearRect(0, 0, cfW, cfH);
            const k = Math.max(0.7, Math.min(1.6, cfH / 600));
            for (let i = cfParts.length - 1; i >= 0; i--) {
                const p = cfParts[i];
                p.vy = Math.min(p.vy + 0.3 * dt * k, 6.5 * k);   // gravità con velocità limite (i coriandoli "galleggiano")
                p.vx *= Math.pow(0.992, dt);
                p.ph += p.ps * dt;
                p.x += (p.vx + Math.sin(p.ph) * 0.6) * dt;
                p.y += p.vy * dt;
                p.rot += p.vr * dt;
                if (p.y > cfH + 24 || p.x < -40 || p.x > cfW + 40) { cfParts.splice(i, 1); continue; }
                cfCtx.save();
                cfCtx.translate(p.x, p.y);
                cfCtx.rotate(p.rot);
                cfCtx.scale(1, Math.cos(p.ph));              // effetto "svolazzo"
                cfCtx.fillStyle = p.c;
                if (p.tondo) { cfCtx.beginPath(); cfCtx.arc(0, 0, p.w / 2, 0, 6.2832); cfCtx.fill(); }
                else cfCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                cfCtx.restore();
            }
            if (t > 6000 && cfParts.length === 0) { confettiStop(); return; }
            cfRaf = requestAnimationFrame(cfFrame);
        }
        function confettiStart() {
            confettiStop();
            cfPrepara();
            if (!cfCtx) return;
            cfT0 = (window.performance && performance.now) ? performance.now() : Date.now();
            cfLast = 0; cfBurst2 = false;
            cfCannone(-1); cfCannone(1);
            cfRaf = requestAnimationFrame(cfFrame);
        }
        function confettiStop() {
            if (cfRaf) { cancelAnimationFrame(cfRaf); cfRaf = null; }
            cfParts = [];
            if (cfCtx) cfCtx.clearRect(0, 0, cfW, cfH);
        }

        // ===================== VITTORIA =====================
        function vittoria() {
            fase = 'fine';
            fermaMusica();
            fb("", "", 0);
            suonoVittoria();
            let titolo = "Percorso completato!";
            if (primoTentativo === N) titolo = "Impeccabile!";
            else if (primoTentativo >= 8) titolo = "Bravissimo!";
            el('cp-vtitle').textContent = titolo;
            el('cp-vstats').innerHTML = "Hai completato tutte e " + N + " le tappe di geometria (livello " + livello + ").<br>Risolte al primo tentativo: <b>" + primoTentativo + "</b> su " + N +
                ". Errori totali: <b>" + totErrori + "</b>.";
            mostra('cp-victory');
            aggiornaConsole();
            schedule(confettiStart, 250);
        }

        // ===================== EVENTI =====================
        el('cp-keys').addEventListener('click', function(e) {
            const b = trovaConAttr(e.target, 'data-k');
            if (b) tasto(b.getAttribute('data-k'));
        });
        el('cp-calc').addEventListener('click', function(e) {
            const b = trovaConAttr(e.target, 'data-calc');
            if (b) { initAudio(); suonoTasto(); calcTasto(b.getAttribute('data-calc')); }
        });
        el('cp-calcbtn').addEventListener('click', calcApriChiudi);
        el('cp-cuse').addEventListener('click', calcUsa);
        el('cp-snd').addEventListener('click', function() {
            suoniOn = !suoniOn;
            this.innerHTML = suoniOn ? '&#128266;' : '&#128263;';
            if (suoniOn) initAudio();
        });

        let nuovaConferma = false;
        el('cp-new').addEventListener('click', function() {
            if (fase !== 'gioco' && fase !== 'blocco') return;
            const b = this;
            if (!nuovaConferma) {
                nuovaConferma = true;
                b.textContent = "Sicuro?";
                schedule(function() { nuovaConferma = false; b.innerHTML = "&#8635; Nuova"; }, 2500);
                return;
            }
            nuovaConferma = false;
            b.innerHTML = "&#8635; Nuova";
            initAudio(); suonoNuova();
            nuovaPartita();
        });

        // Scelta del livello all'inizio
        function iniziaLivello(n) {
            initAudio();
            impostaLivello(n);
            nascondi('cp-start');
            nuovaPartita();
            avviaMusica();
        }
        el('cp-lv1').addEventListener('click', function() { iniziaLivello(1); });
        el('cp-lv2').addEventListener('click', function() { iniziaLivello(2); });

        el('cp-again').addEventListener('click', function() {
            initAudio(); suonoNuova();
            nuovaPartita();
            avviaMusica();
        });
        // Dalla schermata finale si può tornare alla scelta del livello
        el('cp-menu').addEventListener('click', function() {
            gettone++;
            confettiStop();
            nascondi('cp-victory');
            fase = 'start';
            mostra('cp-start');
        });
        el('cp-trophy').addEventListener('click', function() { if (fase === 'fine') confettiStart(); });

        // Tastiera fisica: cifre, virgola/punto, Backspace, Invio
        if (window.__cpKeyHandler) window.removeEventListener('keydown', window.__cpKeyHandler);
        window.__cpKeyHandler = function(e) {
            if (!alive || fase !== 'gioco' || !document.getElementById('cp-container')) return;
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            const k = e.key;
            if (/^[0-9]$/.test(k)) { tasto(k); e.preventDefault(); }
            else if (k === ',' || k === '.') { tasto(','); e.preventDefault(); }
            else if (k === 'Backspace') { tasto('DEL'); e.preventDefault(); }
            else if (k === 'Enter') { tasto('OK'); e.preventDefault(); }
        };
        window.addEventListener('keydown', window.__cpKeyHandler);

        const onResize = function() { if (cfRaf) cfPrepara(); fitCalc(); };
        window.addEventListener('resize', onResize);

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                fase = 'fine';
                fermaMusica();
                confettiStop();
                if (fbTimeout) clearTimeout(fbTimeout);
                timeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('keydown', window.__cpKeyHandler);
                window.removeEventListener('resize', onResize);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-10');
                if (st) st.remove();
            });
        }

        // schermata iniziale: il gioco è pronto dietro la scelta del livello
        impostaLivello(1);
        sel = generaCombinazione();
        step = 0;
        disegnaTappa();
        aggiornaConsole();
        // __TEST_HOOK__
    }
});

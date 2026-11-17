// --- LAUNCHER INTELLIGENTE (AUTO-DISCOVERY) ---

// Cambia questo numero ogni volta che aggiorni un gioco: obbliga i dispositivi
// (iPhone, lavagne) a scaricare la versione nuova invece di mostrare quella vecchia.
var VERSIONE = "2";

// La scansione si ferma dopo questo numero di file mancanti consecutivi.
// Così puoi togliere un gioco (es. 002game.js) senza perdere quelli successivi.
var MAX_BUCHI = 3;

function nomeFile(n) {
    return ('00' + n).slice(-3) + 'game.js'; // 001game.js, 002game.js, ...
}

function scansionaCartucce() {
    var index = 1;
    var buchi = 0;

    function prossimo() {
        if (buchi >= MAX_BUCHI || index > 99) {
            mostraMenuPrincipale();
            return;
        }

        var script = document.createElement('script');
        script.src = nomeFile(index) + '?v=' + VERSIONE;

        // File trovato: si registra da solo, si passa al successivo
        script.onload = function() {
            buchi = 0;
            index++;
            prossimo();
        };

        // File mancante: lo conto come "buco" e provo il successivo
        script.onerror = function() {
            script.remove();
            buchi++;
            index++;
            prossimo();
        };

        document.body.appendChild(script);
    }

    prossimo();
}

function loadMenu() {
    mostraMenuPrincipale();
}

function mostraMenuPrincipale() {
    if (window.UGOConsole) {
        window.UGOConsole.setInGame(false);
        window.UGOConsole.setTitle("Progetto Console - Menu Principale");
        window.UGOConsole.setScore(0);
        window.UGOConsole.setTimerLabel("Tempo");
        window.UGOConsole.setTimer("--");
    }

    var slot = document.getElementById('cartridge-slot');
    var cartucce = window.UGOConsole.cartridges || [];

    if (cartucce.length === 0) {
        slot.innerHTML =
            '<div style="text-align: center; padding: 20px; color: #94a3b8;">' +
            '<h1 style="color: #38bdf8; font-size: 2.2rem; margin-bottom: 10px;">🎮 Progetto Console</h1>' +
            '<p>Nessuna cartuccia trovata nella cartella (verifica che i file si chiamino 001game.js, 002game.js...)</p>' +
            '</div>';
        return;
    }

    var bottoniHTML = '';
    cartucce.forEach(function(cart, idx) {
        bottoniHTML +=
            '<button onclick="avviaCartuccia(' + idx + ')" style="background: ' + (cart.colore || '#0284c7') + '; color: white; border: none; padding: 20px 30px; font-size: 1.2rem; font-weight: bold; border-radius: 12px; cursor: pointer; box-shadow: 0 4px rgba(0,0,0,0.3);">' +
            cart.titolo +
            '</button>';
    });

    // Contenitore scorrevole: con tanti giochi si può scorrere col dito
    slot.innerHTML =
        '<div style="width: 100%; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; background: #0f172a; display: flex; flex-direction: column;">' +
        '<div style="margin: auto; text-align: center; padding: 20px; display: flex; flex-direction: column; gap: 20px; align-items: center;">' +
        '<h1 style="color: #38bdf8; font-size: 2.5rem; margin-bottom: 5px;">🎮 Progetto Console</h1>' +
        '<p style="color: #94a3b8; font-size: 1.2rem; margin-bottom: 15px;">Seleziona la cartuccia da inserire nello slot:</p>' +
        '<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 700px;">' +
        bottoniHTML +
        '</div></div></div>';
}

function mostraErroreCartuccia(titolo) {
    var slot = document.getElementById('cartridge-slot');
    slot.innerHTML =
        '<div style="text-align: center; padding: 20px; color: #fca5a5;">' +
        '<h2 style="margin-bottom: 10px;">Questo gioco non si è avviato</h2>' +
        '<p style="color: #94a3b8; margin-bottom: 20px;">' + titolo + '</p>' +
        '<button class="btn-start" onclick="window.UGOConsole.returnToMenu()">TORNA AL MENU</button>' +
        '</div>';
}

function avviaCartuccia(index) {
    var cart = window.UGOConsole.cartridges[index];
    if (!cart || typeof cart.avvia !== 'function') return;

    // Ripulisce l'eventuale gioco precedente
    window.UGOConsole.runExit();

    var slot = document.getElementById('cartridge-slot');
    slot.innerHTML = ''; // pulisce lo slot

    window.UGOConsole.setInGame(true);
    window.UGOConsole.setTitle(cart.titolo);
    window.UGOConsole.setScore(0);
    window.UGOConsole.setTimerLabel("Tempo");
    window.UGOConsole.setTimer("--");

    try {
        cart.avvia();
    } catch (e) {
        console.error('Errore nell\'avvio di "' + cart.titolo + '":', e);
        window.UGOConsole.runExit();
        mostraErroreCartuccia(cart.titolo);
        return;
    }

    // Se dopo l'avvio lo slot è ancora vuoto, qualcosa è andato storto
    if (slot.children.length === 0) {
        mostraErrore_vuoto(cart.titolo);
    }
}

function mostraErrore_vuoto(titolo) {
    window.UGOConsole.runExit();
    mostraErroreCartuccia(titolo);
}

// Avvia automaticamente la scansione all'apertura della pagina
scansionaCartucce();

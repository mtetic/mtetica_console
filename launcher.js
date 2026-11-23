// --- LAUNCHER (ORDINE DECISO DA ELENCO) ---

// Cambia questo numero ogni volta che aggiorni un gioco: obbliga i dispositivi
// (iPhone, lavagne) a scaricare la versione nuova invece di mostrare quella vecchia.
var VERSIONE = "13";

// ELENCO DEI GIOCHI, NELL'ORDINE IN CUI COMPAIONO NEL MENU.
// Il numero davanti al titolo lo scrive il launcher da solo, in base alla posizione.
// - Per SPOSTARE un gioco: sposta la sua riga su o giù.
// - Per AGGIUNGERE un gioco: carica il file nella cartella e scrivi qui il suo nome,
//   nel punto in cui vuoi che compaia. Gli altri scalano da soli.
// - Per TOGLIERE un gioco: cancella la sua riga.
// Attenzione: tutte le righe tranne l'ultima devono finire con la virgola.
var ORDINE = [
    "009game.js",   // Pescatore&Telepatico
    "007game.js",   // Operiamo!
    "002game.js",   // chePOTENZA!!!
    "005game.js",   // Dietro l'angolo
    "008game.js",   // Dividendo...
    "001game.js",   // Primi palloncini
    "011game.js",   // Spaccapianeti
    "010game.js",   // Rettangoli e quadrati
    "004game.js",   // Circa-Cerchio
    "003game.js",   // Frazioniamo relativamente???
    "006game.js"    // Solidamente!
];

function scansionaCartucce() {
    var index = 0;

    function prossimo() {
        if (index >= ORDINE.length) {
            numeraCartucce();
            mostraMenuPrincipale();
            return;
        }

        var script = document.createElement('script');
        script.src = ORDINE[index] + '?v=' + VERSIONE;

        // File trovato: si registra da solo, si passa al successivo
        script.onload = function() {
            index++;
            prossimo();
        };

        // File mancante: lo salto e passo al successivo
        script.onerror = function() {
            script.remove();
            console.error('File non trovato: ' + ORDINE[index]);
            index++;
            prossimo();
        };

        document.body.appendChild(script);
    }

    prossimo();
}

// I giochi si registrano nell'ordine in cui vengono caricati, cioè quello dell'elenco.
// Qui si mette il numero giusto davanti al titolo (togliendo quello scritto a mano, se c'è).
function numeraCartucce() {
    var lista = window.UGOConsole.cartridges || [];
    for (var i = 0; i < lista.length; i++) {
        var t = String(lista[i].titolo).replace(/^\s*\d+\s*\.\s*/, '');
        lista[i].titolo = (i + 1) + '. ' + t;
    }
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
            '<p>Nessuna cartuccia trovata (verifica che i nomi nell\'elenco ORDINE di launcher.js corrispondano ai file)</p>' +
            '</div>';
        return;
    }

    var bottoniHTML = '';
    cartucce.forEach(function(cart, idx) {
        bottoniHTML +=
            '<button onclick="avviaCartuccia(' + idx + ')" style="margin: 0; width: 100%; background: ' + (cart.colore || '#0284c7') + '; color: white; border: none; padding: 20px 30px; font-size: 1.2rem; font-weight: bold; border-radius: 12px; cursor: pointer; box-shadow: 0 4px rgba(0,0,0,0.3);">' +
            cart.titolo +
            '</button>';
    });

    // Contenitore scorrevole: con tanti giochi si può scorrere col dito
    slot.innerHTML =
        '<div style="width: 100%; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; background: #0f172a; display: flex; flex-direction: column;">' +
        '<div style="margin: auto; text-align: center; padding: 20px; display: flex; flex-direction: column; gap: 20px; align-items: center;">' +
        '<h1 style="color: #38bdf8; font-size: 2.5rem; margin-bottom: 5px;">🎮 Progetto Console</h1>' +
        '<p style="color: #94a3b8; font-size: 1.2rem; margin-bottom: 15px;">Seleziona la cartuccia da inserire nello slot:</p>' +
        '<div style="display: flex; flex-direction: column; gap: 12px; align-items: stretch; width: 100%; max-width: 420px;">' +
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

// Avvia automaticamente il caricamento all'apertura della pagina
scansionaCartucce();
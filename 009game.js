// --- CARTUCCIA 009: PESCATORE&TELEPATICO ---
// Taboo digitale per due dispositivi non collegati tra loro: il Pescatore pesca e mostra le carte,
// il Telepatico inserisce il numero della carta e la parola indovinata. Si comunica a voce.

window.UGOConsole.registerCartridge({
    id: 9,
    titolo: "9. Pescatore&Telepatico",
    colore: "#be123c",
    avvia: function() {
        const slot = document.getElementById('cartridge-slot');
        let alive = true; // diventa false quando si esce dal gioco

        const DURATA = 120; // secondi di un match (prima versione)

        // ===================== LE CARTE =====================
        // Formato: "PAROLA|vietata 1|vietata 2|vietata 3". Il numero della carta è la posizione nell'elenco (0001, 0002, ...).
        const CARTE_RAW = [
            "ABACO|numeri|conti|palline",
            "ABETE|natale|pino|albero",
            "ACCAPPATOIO|doccia|asciugamano|acqua",
            "ACCIAIO|ferro|metallo|duro",
            "ACQUA|pioggia|mare|bere",
            "ACQUEDOTTI|archi|romani|bere",
            "AGAVE|fiore|aloe|unico",
            "AGNELLO|animale|pasqua|sacrificio",
            "AGOSTO|mese|dodici|anno",
            "ALBA|tramonto|sole|oriente",
            "ALGA|mare|pianta|scoglio",
            "ALI|uccello|volare|angelo",
            "ALITO|bocca|respiro|fresco",
            "ALLUCE|dito|piede|pollice",
            "AMICO|tesoro|compagno|persona",
            "AMORE|emozione|cuore|sentimento",
            "ANDROID|sistema operativo|smartphone|windows",
            "ANELLO|dito|fede|gioiello",
            "ANGELO|Lucifero|Bibbia|ali",
            "ANIMALE|vegetale|vivente|essere",
            "APE|miele|insetto|volare",
            "APRILE|mese|dodici|anno",
            "AQUILA|uccello|rapace|predatore",
            "ARCOBALENO|colori|luce|pioggia",
            "ARIA|vento|ossigeno|vita",
            "ARMADIO|vestiti|mobile|stanza",
            "ARMI|guerra|pistola|coltello",
            "ARTIGLIO|gatto|felino|zampa",
            "ASTRONAUTA|NAVICELLA|spazio|luna",
            "AZIENDA|lavoro|fabbrica|società",
            "BALCONE|ringhiera|finestra|palazzo",
            "BAR|caffè|cappuccino|cornetto",
            "BAMBINO|anni|piccolo|uomo",
            "BANANA|frutta|dolce|gialla",
            "BANCO|scuola|libri|quaderni",
            "BANCOMAT|soldi|pagare|carta",
            "BARBA|peli|faccia|guance",
            "BASILICO|foglia|sugo|pesto",
            "BERNOCCOLO|testa|colpo|gonfiore",
            "BERSAGLIO|freccette|centro|mira",
            "BIBLIOTECA|libri|volumi|prestito",
            "BICCHIERE|acqua|bere|tavola",
            "BICICLETTA|pedali|ruota|sterzo",
            "BIDET|bagno|igiene|gabinetto",
            "BIGLIA|pallina|vetro|rotolare",
            "BINOCOLO|esploratori|guardare|occhi",
            "BIPEDE|uomo|due|zampe",
            "BIRRA|bevanda|alcol|aperitivo",
            "BOCCA|denti|lingua|faccia",
            "BORRACCIA|acqua|bottiglia|bere",
            "BORSA|scuola|donna|accessorio",
            "BRACCIALE|polso|gioiello|collana",
            "BRACCIO|mano|gamba|corpo",
            "BRISCOLA|carte|gioco|carico",
            "BROCCOLO|pianta|verdura|cibo",
            "BRODO|bere|mangiare|cibo",
            "BUGIA|verità|raccontare|mentire",
            "BURRO|condimento|latte|grasso",
            "BUSTA|spesa|sacchetto|plastica",
            "CAFFÈ|mattina|bere|svegliare",
            "CALABRIA|regione|Cosenza|mare",
            "CALCIO|palla|goal|sport",
            "CALCOLO|matematica|numeri|aritmetica",
            "CALDO|freddo|tiepido|temperatura",
            "CALLI|mano|lavoro|duro",
            "CALZINO|piede|scarpa|cotone",
            "CAMPANIA|regione|Napoli|Avellino",
            "CAMINO|fuoco|legna|casa",
            "CANCELLINO|lavagna|scrivere|scuola",
            "CANE|abbaiare|guinzaglio|animale",
            "CANTANTE|musica|voce|strumento",
            "CAPELLI|testa|parrucchiere|acconciatura",
            "CASA|appartamento|palazzo|villa",
            "CASSETTO|mobile|comodino|segreto",
            "CASTELLO|fiaba|favola|principessa",
            "CARRELLO|spesa|ruote|pesi",
            "CARTA|foglio|alberi|scrivere",
            "CAVIGLIA|piede|gamba|articolazione",
            "CENA|pranzo|sera|mangiare",
            "CEDRO|albero|pino|sempreverde",
            "CERVO|corna|parco|cavallo",
            "CESTO|contenitore|cibo|cappuccetto",
            "CHIOCCIOLA|lumaca|guscio|lenta",
            "CHIODO|martello|ferro|attaccare",
            "CHITARRA|strumento|corde|musica",
            "CIELO|alto|azzurro|sole",
            "CINEMA|film|atlantic|pop corn",
            "CINGHIALE|maiale|selvatico|animale",
            "CIPRESSO|cimitero|albero|pino",
            "CITTÀ|Roma|Napoli|Milano",
            "CLESSIDRA|tempo|scorrere|sabbia",
            "COLAZIONE|mattina|mangiare|latte",
            "COLLANA|gioiello|bracciale|orecchini",
            "COLLINA|montagna|pianura|altezza",
            "COLTELLO|forchetta|cucchiaio|mangiare",
            "COMPUTER|schermo|videogiochi|tastiera",
            "COMUNIONE|chiesa|ostia|prima",
            "COPERTA|lenzuolo|letto|caldo",
            "CORAGGIO|fegato|paura|forte",
            "CORDA|fune|legare|saltare",
            "CORNA|animale|cervo|ariete",
            "CORSA|gambe|sport|velocità",
            "COZZA|impepata|vongole|mare",
            "CRAVATTA|giacca|camicia|uomo",
            "CREPUSCOLO|alba|tramonto|sole",
            "CUCINA|casa|stanza|cibo",
            "CUCCHIAIO|forchetta|coltello|mangiare",
            "CULLA|bambino|letto|dormire",
            "CUSCINO|letto|testa|dormire",
            "DADO|sei|facce|numeri",
            "DAMA|gioco|scacchiera|donna",
            "DENARO|soldi|monete|acquistare",
            "DENTE|bocca|osso|carie",
            "DIARIO|scrivere|calendario|ricordare",
            "DICEMBRE|mese|dodici|anno",
            "DIGA|fiume|lago|acqua",
            "DINOSAURI|estinti|giurassico|meteorite",
            "DITTATORE|capo|governare|democrazia",
            "DITO|mano|unghia|indicare",
            "DIVANO|sedersi|comodo|televisione",
            "DOLCE|zucchero|cornetto|caramelle",
            "DOMENICA|settimana|sette|giorno",
            "DONNA|femmina|maschio|uomo",
            "DONDOLO|sedia|altalena|gioco",
            "DONO|regalo|compleanno|epifania",
            "DRACULA|vampiro|conte|transilvania",
            "DRAGO|fuoco|volare|fantastico",
            "ECLISSI|sole|luna|nascondersi",
            "ECO|voce|montagna|ritornare",
            "EDICOLA|giornali|carte|figurine",
            "EDIFICIO|casa|palazzo|architetto",
            "EGITTO|Nilo|piramidi|geroglifici",
            "ELASTICO|molla|cucina|deformare",
            "ELEZIONI|voto|politico|maggiorenni",
            "ELEFANTE|proboscide|zoo|pachiderma",
            "ELETTRICITÀ|corrente|spina|presa",
            "ELFO|bosco|nano|fate",
            "ELICOTTERO|aereo|volare|cielo",
            "EMAIL|posta|indirizzo|lettera",
            "EMPORIO|cinese|negozio|comprare",
            "ENCICLOPEDIA|libri|ricerche|parole",
            "ENIGMA|risolvere|indovinello|difficile",
            "EPISODIO|serie|puntata|televisione",
            "ERA|tempo|storici|linea del tempo",
            "ERBA|verde|pianta|prato",
            "ERGASTOLO|prigione|pena|vita",
            "ESERCITO|guerra|soldati|militari",
            "ESERCIZIO|compiti|scuola|ginnastica",
            "FACEBOOK|social|profilo|telefono",
            "FALCE|strumento|grano|mietere",
            "FAMIGLIA|padre|madre|figli",
            "FANTASMA|spettro|formaggino|paura",
            "FARFALLA|ali|insetto|volare",
            "FARINA|cereali|grano|pasta",
            "FARMACIA|medicine|dottore|curare",
            "FAVOLA|fiaba|leggere|raccontare",
            "FAZZOLETTO|naso|muco|soffiare",
            "FEBBRAIO|mese|dodici|anno",
            "FELICITÀ|emozione|bello|gioia",
            "FICO|frutto|dolce|india",
            "FIFA|paura|ansia|calcio",
            "FIGLIO|padre|madre|famiglia",
            "FINESTRA|affacciarsi|vetro|casa",
            "FIORE|prato|margherita|ape",
            "FIUME|acqua|scorrere|Tevere",
            "FOGLIA|albero|verde|autunno",
            "FOGLIO|carta|quaderno|libro",
            "FORCHETTA|coltello|cucchiaio|posate",
            "FORMA|geometria|quadrato|triangolo",
            "FORMAGGIO|latte|derivato|mangiare",
            "FORMICA|animale|insetto|grillo",
            "FREDDO|caldo|tiepido|temperatura",
            "FRISBEE|gioco|disco|lanciare",
            "FRUTTIVENDOLO|banane|pesce|mele",
            "FUNERALE|morte|chiesa|bara",
            "FUNGO|vegetale|animale|porcini",
            "FUOCO|incendio|fiamma|pompiere",
            "GALLO|gallina|pulcino|pollame",
            "GARAGE|automobile|macchina|moto",
            "GAS|aria|ossigeno|materia",
            "GATTO|miagolare|fusa|topo",
            "GAVETTA|scout|cibo|piatti",
            "GECO|rettile|lucertola|fortuna",
            "GELATO|dolce|freddo|gusti",
            "GENNAIO|mese|anno|dodici",
            "GENERO|figlia|padre|marito",
            "GESSETTO|lavagna|scrivere|scuola",
            "GHIACCIO|acqua|freddo|freezer",
            "GIACCA|vestito|pantaloni|cravatta",
            "GIOCATTOLO|gioco|bambino|regalo",
            "GIOCO|bambino|divertimento|palla",
            "GIORNO|luce|oggi|notte",
            "GIOVE|dei|pianeti|zeus",
            "GIOVEDÌ|settimana|sette|giorno",
            "GIUGNO|mese|dodici|anno",
            "GOOGLE|motore di ricerca|azienda|internet",
            "GOAL|calcio|rete|pallone",
            "GREGGE|pecore|pastore|recinto",
            "GUANTO|mano|dita|freddo",
            "GUERRA|armi|soldati|mondiale",
            "GUSCIO|noce|chiocciola|lumaca",
            "HALLOWEEN|maschera|ottobre|paura",
            "HABITAT|naturale|ambiente|viventi",
            "HACKER|esperto|computer|informatico",
            "HAMBURGER|burgerking|McDonalds|carne",
            "HOTEL|vacanza|appartamento|camera",
            "IDRAULICO|tubi|acqua|bagno",
            "IMBUTO|liquidi|bottiglia|vino",
            "IMPEGNO|studio|costanza|dovere",
            "INCHIOSTRO|penna|calamaio|scrivere",
            "INCUBO|sogno|notte|paura",
            "INDICE|dito|mano|libro",
            "INNO|stadio|Mameli|italiano",
            "INSALATA|lattuga|pomodori|cibo",
            "INSETTO|animale|invertebrato|fiore",
            "IO|me|pronome personale|egoismo",
            "ISOLA|mare|oceano|terra",
            "ISTRICE|animale|aculei|mammifero",
            "JEANS|pantaloni|blu|cotone",
            "JEEP|macchina|auto|marca",
            "JUDO|sport|karate|kimono",
            "KARAOKE|cantare|feste|parole",
            "KARATE|katà|calci|pugni",
            "KEBAB|carne|piadina|fast food",
            "KETCHUP|salsa|patatine|pomodoro",
            "KIMONO|karate|giappone|vestito",
            "KIWI|frutta|verde|cibo",
            "KOALA|eucalipto|animale|australia",
            "KUNG FU|karate|judo|kimono",
            "LABBRA|bocca|rosse|bacio",
            "LACCI|scarpa|nodo|fiocco",
            "LAGO|acqua|fiume|Garda",
            "LAMA|coltello|taglio|spada",
            "LAMPADA|luce|buio|casa",
            "LANA|gomitolo|tessuto|cotone",
            "LATTE|liquido|bere|colazione",
            "LAVA|vulcano|fuoco|rossa",
            "LAVANDINO|lavare|mani|sapone",
            "LAVAGNA|scuola|gesso|maestro",
            "LAZIO|regione|Roma|Italia",
            "LEGGE|avvocato|poliziotto|regole",
            "LEGNO|albero|fuoco|carta",
            "LEONE|felino|criniera|ruggire",
            "LETTERA|email|carta|alfabeto",
            "LETTO|materasso|cuscino|dormire",
            "LIBELLULA|insetto|fiume|lago",
            "LIBRO|leggere|pagine|romanzo",
            "LINGUA|leccare|parlare|bocca",
            "LISTA|elenco|spesa|parole",
            "LIVIDO|ematoma|sangue|macchia",
            "LINUX|sistema operativo|windows|android",
            "LOGICA|ragionamento|matematica|pensiero",
            "LOTTA|guerra|battaglia|botte",
            "LUCE|sole|lampada|torcia",
            "LUCERTOLA|rettile|geco|coda",
            "LUGLIO|mese|dodici|anno",
            "LUMACA|chiocciola|guscio|animale",
            "LUNA|sole|stelle|cielo",
            "LUNEDÌ|settimana|sette|giorno",
            "LUTTO|morte|nero|funerale",
            "MACCHINA|Lorenzo|100|10 anni",
            "MAESTRO|insegnante|scuola|professore",
            "MAGGIO|mese|dodici|anno",
            "MAGMA|vulcano|lava|roccia",
            "MAGO|magia|bacchetta|Harry Potter",
            "MAIALE|porco|animale|mangiare",
            "MANGA|fumetto|libro|giornalino",
            "MANIGLIA|porta|aprire|mano",
            "MANO|dita|pollice|braccio",
            "MARE|acqua|onde|pesci",
            "MARGHERITA|fiore|prato|pianta",
            "MARTE|pianeta|terra|sole",
            "MARTEDÌ|settimana|sette|giorno",
            "MARZO|mese|dodici|anno",
            "MATITA|scrivere|disegnare|legno",
            "MATTINA|sera|pomeriggio|giorno",
            "MECCANICO|auto|mestiere|officina",
            "MELA|frutta|medico|Eva",
            "MELONE|anguria|frutta|estate",
            "MENTA|foglia|odore|caramelle",
            "MENTOS|caramella|golia|menta",
            "METAFORA|poesia|versi|strofe",
            "MERCOLEDÌ|settimana|sette|giorno",
            "MIELE|api|dolce|orso",
            "MONTAGNA|pianura|collina|mare",
            "MOSCA|insetto|ali|volare",
            "MOTORE|mezzo di trasporto|automobile|benzina",
            "MUFFA|umidità|cibo|fungo",
            "MURO|casa|stanza|mattoni",
            "MUSICA|canzoni|cantante|strumenti",
            "MUMMIA|egiziani|bende|Halloween",
            "MUSCHIO|vegetale|umido|campagna",
            "NANO|piccolo|basso|persona",
            "NASO|olfatto|sensi|faccia",
            "NAVE|barca|mare|oceano",
            "NESPOLA|frutto|albero|cibo",
            "NATALE|albero|vacanze|babbo",
            "NEVE|acqua|sciare|montagna",
            "NIDO|uccello|uovo|passerotto",
            "NIPOTE|nonno|zio|figlio",
            "NOCE|frutta|guscio|rompere",
            "NOIA|sentimento|emozione|stato d’animo",
            "NONNO|nipote|padre|famiglia",
            "NOTA|musica|pentagramma|pianoforte",
            "NOTIZIA|telegiornale|mondo|avvenimenti",
            "NOTTE|giorno|buio|stelle",
            "NOVEMBRE|mese|dodici|anno",
            "NUORA|figlio|moglie|parente",
            "NUTELLA|colazione|cioccolato|pane",
            "NUVOLA|acqua|cielo|pioggia",
            "OBELISCO|piazza|egiziani|monumento",
            "OCA|gioco|animale|uccello",
            "OCCHIALI|vedere|miopia|lente",
            "OCCHIO|vista|sensi|organo",
            "OCEANO|mare|Pacifico|Atlantico",
            "OFFESA|parola|violenza|parlare",
            "OLIO|oliva|liquido|condimento",
            "OLIVA|ulivo|frutto|bacca",
            "OMBELICO|corpo|pancia|cordone",
            "OMBRA|luce|nero|sole",
            "OMBRELLO|pioggia|ripararsi|sole",
            "ORECCHINI|collana|bracciale|gioielli",
            "OROLOGIO|tempo|lancette|polso",
            "ORSO|animale|caverna|miele",
            "ORTICA|pianta|spine|prurito",
            "ORO|metallo|gioielli|giallo",
            "OROSCOPO|segni|dodici|futuro",
            "OSPEDALE|medici|malattia|cure",
            "OSPITE|casa|letto|cena",
            "OSTRICA|cruda|limone|mitili",
            "OTAMATONE|Giappone|strumento|musica",
            "OTTOBRE|mese|dodici|anno",
            "PACE|guerra|accordo|bene",
            "PADRE|madre|genitore|figlio",
            "PANE|farina|impasto|forno",
            "PANINO|pane|companatico|prosciutto",
            "PANNA|montata|gelato|fragole",
            "PARENTE|figlio|genitore|nonno",
            "PECCATO|regola|confessione|pietra",
            "PENNA|inchiostro|scrivere|carta",
            "PENTOLA|cuocere|cucinare|uovo",
            "PELI|mammiferi|capelli|pelle",
            "PEPERONE|ortaggio|cibo|contorno",
            "PIADINA|prosciutto|crepes|speck",
            "PIANETI|spazio|Terra|Sole",
            "PIATTO|posate|cibo|tavola",
            "PIAZZA|strada|larga|città",
            "PIDOCCHIO|testa|capelli|scuola",
            "PIEDE|scarpa|gamba|alluce",
            "PIETRA|roccia|lanciare|età",
            "PILLOLA|medicina|compressa|curare",
            "PINO|pigna|pinoli|abete",
            "PINOLO|seme|pino|pigna",
            "PIOGGIA|acqua|cielo|nuvole",
            "PIPISTRELLO|mammifero|volare|bat-man",
            "PISCINA|acqua|nuoto|costume",
            "PISOLINO|sonno|dormire|letto",
            "PISTA|pattinaggio|ghiaccio|ballo",
            "PISTOLA|sparare|proiettili|assassino",
            "PIZZA|Napoli|pomodoro|margherita",
            "POESIA|versi|strofe|metafore",
            "POLLICE|dito|mano|like",
            "POLPO|mare|animale|insalata",
            "POLTRONA|chiacchiere|divano|sedersi",
            "POLVERE|sporcizia|spazzare|pulire",
            "POMERIGGIO|mattina|sera|giornata",
            "POMODORO|ortaggio|cibo|rosso",
            "POMPIERE|vigile del fuoco|caserma|incendio",
            "PORTA|casa|stanza|camera",
            "PORTAFOGLI|soldi|banconote|monete",
            "PRANZO|cena|tavola|mangiare",
            "PRINCIPE|re|castello|nobile",
            "PROBLEMA|risolvere|difficoltà|matematica",
            "PROFESSORE|scuola|insegnare|maestro",
            "PROFUMO|odore|puzza|gas",
            "PRURITO|zanzara|ortica|grattare",
            "PULCE|animale|piccolo|cani",
            "PULLMAN|autobus|ruota|benzina",
            "PUPAZZO|peluche|letto|bambino",
            "QUADERNO|scuola|fogli|libro",
            "QUADRATO|figura|geometria|rettangolo",
            "QUADRIFOGLIO|fortuna|erba|prato",
            "QUADRIMESTRE|scuola|pagella|maestra",
            "QUADRO|muro|disegno|pittore",
            "QUAGLIA|uccello|mangiare|ristorante",
            "QUARESIMA|pasqua|quaranta|carne",
            "QUARTIERE|città|quadraro|torpignattare",
            "QUERCIA|albero|ghianda|pianta",
            "QUOZIENTE|divisione|operazione|intellettivo",
            "RABBIA|emozione|sentimento|scontro",
            "RAGNO|tela|catturare|aracnide",
            "RAMO|albero|foglie|fiori",
            "RANA|stagno|animale|gracidare",
            "RATTO|topo|cavia|paura",
            "RE|regina|capo|castello",
            "RECINTO|gregge|pecore|staccionata",
            "REGINA|re|castello|principessa",
            "REMO|barca|vela|mare",
            "RESTO|soldi|pagare|prezzo",
            "RETTILE|serpente|dinosauri|animali",
            "RIGHELLO|misurare|centimetri|linea",
            "RISATA|denti|bocca|allegria",
            "RISO|chicco|pasta|cibo",
            "RISTORANTE|cibo|tavolo|cameriere",
            "ROSPO|rana|anfibio|stagno",
            "ROSSO|colore|sangue|fuoco",
            "RUGA|vecchio|anziano|pelle",
            "RUGBY|palla|ovale|meta",
            "RUGGINE|ferro|acqua|rosso",
            "RUGGITO|leone|tigre|verso",
            "RUOTA|cerchio|rotolare|macchina",
            "SABATO|settimana|sette|giorno",
            "SAGITTARIO|segno|oroscopo|arco",
            "SALIVA|sputo|bocca|acqua",
            "SALMONE|pesce|fiume|affumicato",
            "SALTO|gambe|correre|vivace",
            "SALE|mare|cucina|zucchero",
            "SAPONE|mani|lavare|acqua",
            "SAPORE|lingua|gusto|cibo",
            "SCACCHIERA|gioco|dama|pedine",
            "SCARAFAGGIO|blatta|insetto|zampe",
            "SCARPE|piedi|camminare|tacco",
            "SCHEDA|scuola|compito|esercizio",
            "SCHELETRO|ossa|cranio|pirati",
            "SCHERMO|dispositivi|telefono|televisione",
            "SCIARPA|gola|collo|inverno",
            "SCOPA|carte|spazzare|pavimento",
            "SCORPIONE|animale|veleno|aracnide",
            "SCOUT|gavette|campeggio|tenda",
            "SCUOLA|elementare|imparare|media",
            "SERPENTE|rettile|vipera|strisciare",
            "SETTEMBRE|mese|dodici|anno",
            "SICILIA|regione|isola|Palermo",
            "SMARTPHONE|telefono|cellulare|dispositivo",
            "SOFFITTO|casa|muro|mattoni",
            "SOGGIORNO|casa|stanza|divani",
            "SOGNO|dormire|notte|mente",
            "SOLE|luce|cielo|caldo",
            "SPAGHETTI|salsa|pasta|farina",
            "SPECCHIO|riflesso|bagno|immagine",
            "SPIAGGIA|sabbia|mare|estate",
            "SPORT|attività|salute|movimento",
            "STADIO|calcio|partita|sport",
            "STELLA|notte|luce|cielo",
            "STIVALI|scarpe|piedi|alti",
            "STORIA|racconto|studio|materia",
            "SUONO|orecchio|rumore|sentire",
            "SUORA|religione|dio|donna",
            "SUPERMAN|supereroi|mantello|poteri",
            "TABACCO|sigarette|fumare|vizio",
            "TABLET|dito|schermo|dispositivo",
            "TAPPETO|pavimento|piedi|casa",
            "TATTO|5 sensi|dita|toccare",
            "TATUAGGIO|disegno|corpo|inchiostro",
            "TAVOLO|sedie|pranzo|tovaglia",
            "TELEFONO|smartphone|chiamate|messaggi",
            "TELEGRAM|whatsapp|messaggi|comunicare",
            "TELEVISIONE|schermo|film|cartoni animati",
            "TELLINE|cozze|mitili|bivalvi",
            "TESORO|pirati|gioielli|valore",
            "TESTA|capo|orecchio|corpo",
            "TENDA|finestra|campeggio|balcone",
            "TENNIS|sport|palla|rete",
            "TETTO|casa|tegole|riparo",
            "TIEPIDO|caldo|freddo|temperatura",
            "TOPO|ratto|cavia|paura",
            "TORNADO|aria|pericolo|spirale",
            "TORO|mucca|corna|corrida",
            "TORTA|dolce|zucchero|pan di spagna",
            "TOVAGLIOLO|tavola|piatto|pulire",
            "TRAMONTO|alba|sole|occidente",
            "TSUNAMI|maremoto|acqua|terremoto",
            "UCCELLO|animale|ali|volare",
            "UDITO|cinque|sensi|orecchio",
            "UFO|alieni|cielo|spazio",
            "UKULELE|chitarra|strumento|musica",
            "ULIVO|albero|frutto|olio",
            "ULTIMO|primo|ordine|fine",
            "ULULATO|lupo|verso|luna",
            "UMANO|essere|noi|sapiens",
            "UMIDITÀ|acqua|muffa|pioggia",
            "UNGHIA|dito|mano|grattare",
            "UNICORNO|cavallo|favole|animale",
            "UOVO|gallina|pollame|cibo",
            "URAGANO|vento|aria|distruzione",
            "USIGNOLO|voce|canto|delicato",
            "USURAIO|soldi|prestito|interessi",
            "UVA|vino|vite|frutto",
            "VACCA|mucca|toro|latte",
            "VACCINO|siringa|ospedale|influenza",
            "VAMPIRO|Dracula|Halloween|sangue",
            "VELENO|vipera|pericolo|sostanza",
            "VECCHIO|anziano|persona|età",
            "VELA|remi|barca|mare",
            "VENE|sangue|corpo|cuore",
            "VENERDÌ|settimana|sette|giorno",
            "VENTILATORE|aria|vento|caldo",
            "VENTO|aria|pioggia|Eolo",
            "VERITÀ|bugia|mentire|dire",
            "VESPA|ape|insetto|animale",
            "VETRO|trasparente|bottiglia|bicchiere",
            "VICOLO|strada|piccolo|piedi",
            "VINO|uva|alcolico|feste",
            "VIRTÙ|vizio|dote|positivo",
            "VITA|genitori|terra|malattie",
            "VIZIO|virtù|fumo|alcol",
            "VOLANTE|macchina|guidare|girare",
            "VONGOLE|cozze|mare|pasta",
            "VORTICE|aria|acqua|pericolo",
            "VULCANO|lava|Vesuvio|eruzione",
            "WATER|sciacquone|gabinetto|toilet",
            "WAFER|dolci|biscotti|cioccolato",
            "WALKIE-TALKIE|telefono|radio|parlare",
            "WHATSAPP|social|chat|telefono",
            "WINDOWS|sistema operativo|computer|android",
            "WINDSURF|sport|vela|mare",
            "XILOFONO|strumento|musica|bacchette",
            "YO-YO|gioco|filo|rotondo",
            "YOGA|sport|tappetino|meditazione",
            "YOGURT|latte|cucchiaino|merenda",
            "ZABAIONE|uovo|zucchero|dolce",
            "ZAINO|borsa|scuola|libri",
            "ZAMPA|animali|arti|muoversi",
            "ZANNA|animale|denti|elefante",
            "ZANZARA|animale|prurito|grattare",
            "ZATTERA|mare|barca|legno",
            "ZAPPA|contadino|strumento|coltivare",
            "ZEBRA|bianco|nero|Juventus",
            "ZECCA|pulce|pelle|animale",
            "ZENZERO|casa|biscotti|dolce",
            "ZERBINO|tappeto|porta|casa",
            "ZERO|numero|cifra|matematica",
            "ZIO|fratello|padre|nipote",
            "ZOCCOLO|cavallo|scarpa|piede",
            "ZOPPO|gamba|ferita|claudicante",
            "ZUCCA|Halloween|frutto|candela",
            "ZUPPA|cibo|cucchiaio|legumi",
            "ZUCCHERO|dolce|sale|bianco"
        ];
        const CARTE = CARTE_RAW.map(function(r) {
            const p = r.split('|');
            return { parola: p[0], taboo: p.slice(1) };
        });
        function codiceDi(i) { return ('0000' + (i + 1)).slice(-4); }

        // La sessione (mazzo già pescato e storico dei match) resta in memoria finché la pagina è aperta,
        // anche se si esce dal gioco e si rientra.
        if (!window.__ptSessione || window.__ptSessione.n !== CARTE.length) {
            window.__ptSessione = { n: CARTE.length, usate: {}, storico: [], matchN: 0 };
        }
        const S = window.__ptSessione;

        // ===================== COMPATIBILITÀ: pezzi di CSS con i prefissi per i browser vecchi =====================
        const FLEX = "display:-webkit-flex;display:flex;";
        const COL = "-webkit-flex-direction:column;flex-direction:column;";
        const ROW = "-webkit-flex-direction:row;flex-direction:row;";
        const CEN = "-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;";
        const BETW = "-webkit-justify-content:space-between;justify-content:space-between;-webkit-align-items:center;align-items:center;";
        const fl = function(v) { return "-webkit-flex:" + v + ";flex:" + v + ";"; };

        slot.innerHTML = `
            <div id="pt-container">
                <div id="pt-bar">
                    <div id="pt-role">Pescatore&amp;Telepatico</div>
                    <button type="button" id="pt-snd" aria-label="Suoni">&#128266;</button>
                    <button type="button" id="pt-swap">&#8644; Ruolo</button>
                </div>

                <div id="pt-body">
                    <!-- ============ PESCATORE ============ -->
                    <div id="pf-view" class="pt-hide">
                        <div id="pf-stage">
                            <div id="pf-idle" class="pf-panel">
                                <div class="pf-big">Premi il pulsante per pescare una carta</div>
                            </div>
                            <div id="pf-num" class="pf-panel pt-hide">
                                <div class="pf-cap">Comunica a voce questo numero al Telepatico</div>
                                <div id="pf-numval">0000</div>
                            </div>
                            <div id="pf-card" class="pt-hide">
                                <div id="pf-wordbox"><div id="pf-word"></div></div>
                                <div id="pf-taboos"></div>
                                <div id="pf-cid"></div>
                            </div>
                            <div id="pf-fine" class="pf-panel pt-hide">
                                <div class="pf-big">Hai pescato tutte le carte del mazzo!</div>
                            </div>
                        </div>
                        <button type="button" id="pf-btn">PESCA UNA CARTA</button>
                    </div>

                    <!-- ============ TELEPATICO ============ -->
                    <div id="tp-view" class="pt-hide">
                        <div id="tp-left">
                            <div id="tp-hud">
                                <div class="tp-h">Match <b id="tp-match">1</b></div>
                                <div class="tp-h tp-timebox"><b id="tp-time">120</b> s</div>
                                <div class="tp-h">Punti <b id="tp-score">0</b></div>
                                <button type="button" id="tp-histbtn">Storico</button>
                            </div>
                            <div id="tp-fcode" class="tp-field tp-on">
                                <div class="tp-lab">CODICE</div>
                                <div id="tp-code" class="tp-val">&#8211;&#8211;&#8211;&#8211;</div>
                            </div>
                            <div id="tp-fword" class="tp-field">
                                <div class="tp-lab">PAROLA</div>
                                <div id="tp-word" class="tp-val"></div>
                            </div>
                            <div id="tp-msg"></div>
                            <button type="button" id="tp-pass">PASSO &minus;1</button>
                        </div>

                        <div id="tp-keys">
                            <div id="tp-numpad">
                                <div class="tp-row"><button type="button" class="tp-key" data-k="1">1</button><button type="button" class="tp-key" data-k="2">2</button><button type="button" class="tp-key" data-k="3">3</button></div>
                                <div class="tp-row"><button type="button" class="tp-key" data-k="4">4</button><button type="button" class="tp-key" data-k="5">5</button><button type="button" class="tp-key" data-k="6">6</button></div>
                                <div class="tp-row"><button type="button" class="tp-key" data-k="7">7</button><button type="button" class="tp-key" data-k="8">8</button><button type="button" class="tp-key" data-k="9">9</button></div>
                                <div class="tp-row"><button type="button" class="tp-key tp-del" data-k="DEL">&#9003;</button><button type="button" class="tp-key" data-k="0">0</button><button type="button" class="tp-key tp-ok" data-k="OK">OK</button></div>
                            </div>
                            <div id="tp-qwerty" class="pt-hide">
                                <div class="tp-row"><button type="button" class="tp-key tp-l" data-k="Q">Q</button><button type="button" class="tp-key tp-l" data-k="W">W</button><button type="button" class="tp-key tp-l" data-k="E">E</button><button type="button" class="tp-key tp-l" data-k="R">R</button><button type="button" class="tp-key tp-l" data-k="T">T</button><button type="button" class="tp-key tp-l" data-k="Y">Y</button><button type="button" class="tp-key tp-l" data-k="U">U</button><button type="button" class="tp-key tp-l" data-k="I">I</button><button type="button" class="tp-key tp-l" data-k="O">O</button><button type="button" class="tp-key tp-l" data-k="P">P</button></div>
                                <div class="tp-row tp-row2"><button type="button" class="tp-key tp-l" data-k="A">A</button><button type="button" class="tp-key tp-l" data-k="S">S</button><button type="button" class="tp-key tp-l" data-k="D">D</button><button type="button" class="tp-key tp-l" data-k="F">F</button><button type="button" class="tp-key tp-l" data-k="G">G</button><button type="button" class="tp-key tp-l" data-k="H">H</button><button type="button" class="tp-key tp-l" data-k="J">J</button><button type="button" class="tp-key tp-l" data-k="K">K</button><button type="button" class="tp-key tp-l" data-k="L">L</button></div>
                                <div class="tp-row"><button type="button" class="tp-key tp-l" data-k="Z">Z</button><button type="button" class="tp-key tp-l" data-k="X">X</button><button type="button" class="tp-key tp-l" data-k="C">C</button><button type="button" class="tp-key tp-l" data-k="V">V</button><button type="button" class="tp-key tp-l" data-k="B">B</button><button type="button" class="tp-key tp-l" data-k="N">N</button><button type="button" class="tp-key tp-l" data-k="M">M</button><button type="button" class="tp-key tp-l tp-del tp-wide" data-k="DEL">&#9003;</button></div>
                                <div class="tp-row"><button type="button" class="tp-key tp-l tp-space" data-k="SP">SPAZIO</button><button type="button" class="tp-key tp-l tp-ok tp-wide" data-k="OK">OK</button></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ============ SCHERMATE SOPRA IL GIOCO ============ -->
                <div id="pt-menu" class="pt-overlay">
                    <div class="pt-title">Pescatore<span>&amp;</span>Telepatico</div>
                    <p>Il Taboo digitale per <b>due dispositivi</b>: uno fa il Pescatore, l'altro il Telepatico. Gli schermi non sono collegati: vi parlate a voce.</p>
                    <p class="pt-small"><b>Pescatore:</b> pesca una carta e dettane il numero a 4 cifre. Poi mostra la carta e fai indovinare la parola <b>senza dire le parole vietate</b>.
                    Se la carta va scartata, dillo a voce e pesca la prossima.</p>
                    <p class="pt-small"><b>Telepatico:</b> scrivi il numero che ti detta il Pescatore e premi OK, poi scrivi la parola che pensi sia.
                    Hai <b>120 secondi</b>: <b>+1</b> parola indovinata, <b>0</b> tentativo errato, <b>&minus;1</b> carta scartata (tasto PASSO). Maiuscole, accenti e plurali non contano; i sinonimi sì.</p>
                    <button type="button" class="pt-rolebtn pt-r1" data-role="pescatore">SONO IL PESCATORE</button>
                    <button type="button" class="pt-rolebtn pt-r2" data-role="telepatico">SONO IL TELEPATICO</button>
                    <button type="button" class="pt-link" id="pt-reset">Azzera la sessione (mazzo e storico)</button>
                </div>

                <div id="pt-ready" class="pt-overlay pt-hide">
                    <div class="pt-title" id="pt-readytitle">Match 1</div>
                    <p>Quando il Pescatore è pronto premi VIA: partono <b>120 secondi</b>.</p>
                    <button type="button" class="btn-start" id="pt-go">VIA!</button>
                </div>

                <div id="pt-hist" class="pt-overlay pt-hide">
                    <h2>Storico dei match</h2>
                    <div id="pt-histlist" class="pt-box"></div>
                    <button type="button" class="btn-start" id="pt-histclose">Chiudi</button>
                </div>

                <div id="pt-end" class="pt-overlay pt-hide">
                    <h2 id="pt-endtitle">Match concluso!</h2>
                    <div id="pt-endscore"></div>
                    <div id="pt-endbox" class="pt-box"></div>
                    <div class="pt-endbtns">
                        <button type="button" class="btn-start" id="pt-next">NUOVO MATCH</button>
                        <button type="button" class="btn-start pt-alt" id="pt-chrole">Cambia ruolo</button>
                    </div>
                </div>
            </div>
        `;

        const oldStyle = document.getElementById('style-cartuccia-9');
        if (oldStyle) oldStyle.remove();
        const styleCart = document.createElement('style');
        styleCart.id = 'style-cartuccia-9';
        styleCart.innerHTML = `
            /* Contenitore ancorato ai 4 lati dello slot: altezza sempre definita, anche sui browser vecchi */
            #pt-container { position: absolute; top: 0; right: 0; bottom: 0; left: 0; ${FLEX}${COL}
                padding: 8px; padding-bottom: 12px; box-sizing: border-box; background: #0f172a; color: #f8fafc; overflow: hidden;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .pt-hide { display: none !important; }

            #pt-bar { ${fl("0 0 auto")}${FLEX}${BETW} width: 100%; max-width: 760px; margin: 0 auto 6px auto; box-sizing: border-box; }
            #pt-role { ${fl("1 1 0px")} min-width: 0; font-weight: bold; color: #fda4af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                font-size: 3vh; font-size: clamp(0.85rem, 3vh, 1.15rem); }
            #pt-snd, #pt-swap, #tp-histbtn { background: #334155; border: none; color: #fff; border-radius: 8px; padding: 6px 10px;
                margin-left: 6px; cursor: pointer; touch-action: manipulation; font-size: 0.85rem; white-space: nowrap; }

            #pt-body { ${fl("1 1 0px")} min-height: 0; width: 100%; max-width: 760px; margin: 0 auto; ${FLEX}${COL} }

            /* ---------- PESCATORE ---------- */
            #pf-view { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL} }
            #pf-stage { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL}${CEN} margin-bottom: 8px; position: relative; }
            .pf-panel { ${FLEX}${COL}${CEN} width: 100%; text-align: center; padding: 8px; box-sizing: border-box; }
            .pf-big { font-weight: bold; color: #e2e8f0; line-height: 1.3; font-size: 4vh; font-size: clamp(1.2rem, 4vh, 2rem); }
            .pf-cap { color: #94a3b8; margin-bottom: 8px; font-size: 2.6vh; font-size: clamp(0.95rem, 2.8vh, 1.3rem); }
            #pf-numval { font-weight: 900; color: #fbbf24; letter-spacing: 0.1em; text-shadow: 0 0 18px rgba(251,191,36,0.4);
                font-size: 16vh; font-size: min(16vh, 26vw); white-space: nowrap; }
            #pf-card { ${FLEX}${COL} width: 100%; max-width: 470px; height: 100%; max-height: 560px; box-sizing: border-box;
                background: #ffffff; border: 6px solid #be123c; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 22px rgba(0,0,0,0.5); position: relative; }
            #pf-wordbox { ${fl("1.2 1 0px")} min-height: 0; ${FLEX}${CEN} background: #be123c; padding: 4px 8px; }
            #pf-word { color: #fff; font-weight: 900; letter-spacing: 1px; text-align: center; white-space: nowrap; max-width: 100%; }
            #pf-taboos { ${fl("2.2 1 0px")} min-height: 0; ${FLEX}${COL} color: #1e293b; padding: 4px 0; }
            .pf-t { ${fl("1 1 0px")} min-height: 0; ${FLEX}${CEN} font-weight: bold; text-transform: uppercase; white-space: nowrap; overflow: hidden;
                padding: 0 10px; border-top: 1px solid #e2e8f0; }
            .pf-t:first-child { border-top: none; }
            #pf-cid { position: absolute; right: 10px; bottom: 4px; font-size: 0.8rem; color: #94a3b8; font-weight: bold; }
            #pf-btn { ${fl("0 0 auto")} width: 100%; border: none; border-radius: 14px; background: #be123c; color: #fff; font-weight: bold;
                cursor: pointer; touch-action: manipulation; box-shadow: 0 4px #881337; padding: 0 10px;
                height: 14vh; min-height: 58px; max-height: 120px; font-size: 3.2vh; font-size: clamp(1rem, 3.2vh, 1.5rem); }
            #pf-btn:active { background: #9f1239; }

            /* ---------- TELEPATICO ---------- */
            #tp-view { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL} }
            #tp-left { ${fl("0 0 auto")} ${FLEX}${COL} }
            #tp-hud { ${FLEX}${BETW} background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 5px 10px; margin-bottom: 6px;
                font-weight: bold; font-size: 2.8vh; font-size: clamp(0.85rem, 2.8vh, 1.15rem); }
            .tp-h b { color: #38bdf8; }
            .tp-timebox b { color: #f43f5e; font-size: 1.25em; }
            #tp-hud #tp-histbtn { margin-left: 0; }
            .tp-field { ${FLEX}${BETW} background: #020617; border: 2px solid #334155; border-radius: 10px; padding: 0 12px; margin-bottom: 6px;
                height: 7.5vh; min-height: 40px; max-height: 58px; box-sizing: border-box; opacity: 0.55; }
            .tp-field.tp-on { border-color: #fbbf24; opacity: 1; box-shadow: 0 0 10px rgba(251,191,36,0.35); }
            .tp-field.ok { border-color: #22c55e; }
            .tp-field.ko { border-color: #ef4444; }
            .tp-lab { color: #94a3b8; font-weight: bold; font-size: 1.9vh; font-size: clamp(0.65rem, 1.9vh, 0.85rem); margin-right: 10px; }
            .tp-val { ${fl("1 1 0px")} min-width: 0; text-align: right; font-weight: 800; color: #00ffcc; letter-spacing: 3px; white-space: nowrap;
                overflow: hidden; font-size: 4vh; font-size: clamp(1.1rem, 4vh, 1.8rem); }
            #tp-msg { min-height: 2.4vh; margin-bottom: 4px; text-align: center; font-weight: bold; color: #fbbf24; line-height: 1.2;
                font-size: 2.2vh; font-size: clamp(0.75rem, 2.2vh, 1rem); }
            #tp-msg.ok { color: #4ade80; }
            #tp-msg.ko { color: #f87171; }
            #tp-pass { width: 100%; border: none; border-radius: 10px; background: #7f1d1d; color: #fecaca; font-weight: bold; cursor: pointer;
                touch-action: manipulation; margin-bottom: 6px; height: 6.5vh; min-height: 38px; max-height: 54px;
                font-size: 2.6vh; font-size: clamp(0.85rem, 2.6vh, 1.15rem); }
            #tp-pass:active { background: #991b1b; }

            #tp-keys { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL} }
            #tp-numpad, #tp-qwerty { ${fl("1 1 0px")} min-height: 0; ${FLEX}${COL} width: 100%; max-width: 520px; margin: 0 auto; }
            .tp-row { ${fl("1 1 0px")} min-height: 0; ${FLEX}${ROW} margin-bottom: 6px; }
            .tp-row:last-child { margin-bottom: 0; }
            .tp-row2 { padding: 0 5%; }
            .tp-key { ${fl("1 1 0px")} min-width: 0; margin: 0 6px 0 0; padding: 0; background: #334155; color: #fff; border: none; border-radius: 9px;
                font-weight: bold; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent;
                font-size: 4.6vh; font-size: clamp(1.1rem, 4.6vh, 1.8rem); }
            .tp-key:last-child { margin-right: 0; }
            .tp-key:active { background: #475569; }
            .tp-l { font-size: 3.4vh; font-size: min(3.4vh, 5.2vw); }
            .tp-del { background: #64748b; }
            .tp-ok { background: #22c55e; }
            .tp-ok:active { background: #16a34a; }
            .tp-wide { ${fl("1.6 1 0px")} }
            .tp-space { ${fl("4 1 0px")} font-size: 2.2vh; }

            /* ---------- SCHERMATE ---------- */
            .pt-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.97); z-index: 10;
                ${FLEX}${COL}${CEN} padding: 14px; box-sizing: border-box; text-align: center; overflow-y: auto; }
            .pt-overlay > * { margin-top: 6px; margin-bottom: 6px; }
            .pt-overlay h2 { color: #fda4af; margin: 0; font-size: 4.4vh; font-size: clamp(1.4rem, 4.8vh, 2.1rem); }
            .pt-overlay p { color: #94a3b8; max-width: 520px; line-height: 1.4; margin-top: 4px; margin-bottom: 4px;
                font-size: 2.5vh; font-size: clamp(0.88rem, 2.6vh, 1.1rem); }
            .pt-overlay p.pt-small { font-size: 2.2vh; font-size: clamp(0.8rem, 2.3vh, 1rem); color: #cbd5e1; text-align: left; }
            .pt-title { font-weight: 900; color: #fb7185; letter-spacing: 1px; text-shadow: 0 0 10px rgba(251,113,133,0.4);
                font-size: 5.4vh; font-size: clamp(1.7rem, 6vh, 2.5rem); }
            .pt-title span { color: #fbbf24; }
            .pt-rolebtn { width: 100%; max-width: 420px; border: none; border-radius: 14px; color: #fff; font-weight: bold; cursor: pointer;
                touch-action: manipulation; padding: 0 10px; height: 8.5vh; min-height: 46px; max-height: 72px; box-shadow: 0 4px rgba(0,0,0,0.4);
                font-size: 2.8vh; font-size: clamp(1rem, 3vh, 1.35rem); }
            .pt-rolebtn:active { -webkit-transform: translateY(3px); transform: translateY(3px); box-shadow: none; }
            .pt-r1 { background: #be123c; }
            .pt-r2 { background: #0e7490; }
            .pt-link { background: none; border: none; color: #94a3b8; text-decoration: underline; cursor: pointer; font-size: 0.85rem; padding: 6px; }
            .pt-overlay .btn-start { background: #be123c; box-shadow: 0 4px #881337; }
            .pt-overlay .btn-start.pt-alt { background: #52525b; box-shadow: 0 4px #3f3f46; }
            .pt-box { width: 100%; max-width: 560px; max-height: 48%; overflow-y: auto; -webkit-overflow-scrolling: touch;
                background: rgba(30,41,59,0.85); border-radius: 10px; padding: 8px 12px; box-sizing: border-box; text-align: left;
                color: #cbd5e1; line-height: 1.45; font-size: 0.92rem; }
            #pt-endscore { font-weight: 900; color: #22c55e; font-size: 7vh; font-size: clamp(2.2rem, 8vh, 3.4rem); }
            .pt-endbtns { ${FLEX}${ROW} -webkit-flex-wrap: wrap; flex-wrap: wrap; ${CEN} }
            .pt-endbtns .btn-start { margin: 4px 5px; }
            .pt-sec { color: #fbbf24; font-weight: bold; margin: 8px 0 3px 0; }
            .pt-mrow { padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
            .pt-mrow.pt-cur { color: #fff; font-weight: bold; }
            .pt-pos { color: #4ade80; font-weight: bold; }
            .pt-neg { color: #f87171; font-weight: bold; }

            /* Schermo più largo che alto: pescatore a tutto campo, telepatico con tastiera a destra */
            @media (orientation: landscape) and (max-height: 560px) {
                #tp-view { ${ROW} -webkit-flex-direction: row; flex-direction: row; }
                #tp-left { ${fl("1 1 0px")} margin-right: 10px; }
                #tp-keys { ${fl("1.25 1 0px")} }
                #pf-numval { font-size: 22vh; }
            }
        `;
        document.head.appendChild(styleCart);

        // ===================== UTILITÀ =====================
        function el(id) { return document.getElementById(id); }
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function mostra(id) { const e = el(id); if (e) e.classList.remove('pt-hide'); }
        function nascondi(id) { const e = el(id); if (e) e.classList.add('pt-hide'); }
        function trovaConAttr(target, attr) {
            let n = target;
            while (n && n !== slot) {
                if (n.getAttribute && n.getAttribute(attr) !== null) return n;
                n = n.parentNode;
            }
            return null;
        }
        // Adatta il testo alla larghezza disponibile (parte da maxPx e scende fino a minPx)
        function adattaTesto(e, maxPx, minPx, larghezza) {
            let s = maxPx;
            e.style.fontSize = s + 'px';
            while (s > minPx && e.scrollWidth > larghezza) {
                s -= 2;
                e.style.fontSize = s + 'px';
            }
        }

        // ===================== CONFRONTO DELLE PAROLE =====================
        // Si ignorano maiuscole/minuscole, accenti, spazi e trattini; singolare e plurale valgono uguali; i sinonimi no.
        function senzaAccenti(s) {
            return s.replace(/[àáâãä]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
                    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/ç/g, 'c').replace(/ñ/g, 'n');
        }
        function norm(s) { return senzaAccenti(String(s).toLowerCase()).replace(/[^a-z0-9]/g, ''); }
        const IRREGOLARI = [['uovo', 'uova'], ['dito', 'dita'], ['braccio', 'braccia'], ['labbro', 'labbra'], ['osso', 'ossa'],
            ['corno', 'corna'], ['ginocchio', 'ginocchia'], ['ciglio', 'ciglia'], ['muro', 'mura'], ['lenzuolo', 'lenzuola'],
            ['dio', 'dei'], ['uomo', 'uomini'], ['bue', 'buoi'], ['ala', 'ali'], ['paio', 'paia']];
        function forme(w) {
            const out = [w];
            const n = w.length;
            if (n < 3) return out;
            const ult = w.charAt(n - 1);
            const base = w.slice(0, -1);
            const agg = function(x) { if (out.indexOf(x) === -1) out.push(x); };
            if (ult === 'o') {
                agg(base + 'i');
                if (/[cg]$/.test(base)) agg(base + 'hi');
                if (/i$/.test(base)) agg(base);              // figlio -> figli
            } else if (ult === 'a') {
                agg(base + 'e'); agg(base + 'i');
                if (/[cg]$/.test(base)) agg(base + 'he');    // amica -> amiche
                if (/[cg]ia$/.test(w)) agg(w.slice(0, -2) + 'e'); // arancia -> arance
            } else if (ult === 'e') {
                agg(base + 'i'); agg(base + 'a');
                if (/ch$/.test(base)) agg(base.slice(0, -2) + 'ca'); // banche -> banca
                if (/gh$/.test(base)) agg(base.slice(0, -2) + 'ga');
                if (/[cg]$/.test(base)) agg(base + 'ia');    // arance -> arancia
            } else if (ult === 'i') {
                agg(base + 'o'); agg(base + 'a'); agg(base + 'e');
                if (/ch$/.test(base)) agg(base.slice(0, -2) + 'co'); // amichi -> amico
                if (/gh$/.test(base)) agg(base.slice(0, -2) + 'go');
            }
            for (let i = 0; i < IRREGOLARI.length; i++) {
                if (w === IRREGOLARI[i][0]) agg(IRREGOLARI[i][1]);
                if (w === IRREGOLARI[i][1]) agg(IRREGOLARI[i][0]);
            }
            return out;
        }
        function uguali(a, b) {
            const A = norm(a), B = norm(b);
            if (!A || !B) return false;
            if (A === B) return true;
            return forme(A).indexOf(B) !== -1 || forme(B).indexOf(A) !== -1;
        }

        // ===================== AUDIO =====================
        let audioCtx = null;
        let suoniOn = true;
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
                g.gain.setValueAtTime(volume, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + durata);
                osc.connect(g);
                g.connect(audioCtx.destination);
                osc.start(t);
                osc.stop(t + durata + 0.02);
            } catch (e) {}
        }
        function suonoGiusto() { nota(987.77, 0, 0.12, 'square', 0.12); nota(1318.51, 0.08, 0.3, 'square', 0.12); }
        function suonoErrore() { nota(150, 0, 0.3, 'sawtooth', 0.18); nota(100, 0.1, 0.25, 'sawtooth', 0.15); }
        function suonoPasso() { nota(300, 0, 0.12, 'triangle', 0.15); nota(200, 0.1, 0.25, 'triangle', 0.15); }
        function suonoOk() { nota(660, 0, 0.1, 'sine', 0.12); nota(880, 0.08, 0.15, 'sine', 0.12); }
        function suonoTic() { nota(900, 0, 0.05, 'sine', 0.06); }
        function suonoPesca() { nota(520, 0, 0.08, 'triangle', 0.12); nota(780, 0.07, 0.12, 'triangle', 0.12); }
        function suonoFine() { nota(392, 0, 0.18, 'triangle', 0.15); nota(330, 0.18, 0.18, 'triangle', 0.15); nota(262, 0.36, 0.5, 'triangle', 0.15); }

        // ===================== STATO =====================
        let ruolo = null;            // 'pescatore' | 'telepatico'
        const timeouts = [];
        function schedule(fn, ms) { timeouts.push(setTimeout(function() { if (alive) fn(); }, ms)); }

        function aggiornaConsole() {
            if (!window.UGOConsole) return;
            const nomeRuolo = ruolo === 'pescatore' ? 'Pescatore' : ruolo === 'telepatico' ? 'Telepatico' : '';
            window.UGOConsole.setTitle(nomeRuolo ? "Pescatore&Telepatico · " + nomeRuolo : "Pescatore&Telepatico");
            if (window.UGOConsole.setTimerLabel) window.UGOConsole.setTimerLabel("Tempo");
            if (ruolo === 'telepatico' && M) {
                window.UGOConsole.setScore(M.punti);
                window.UGOConsole.setTimer((M.attivo ? Math.max(0, restante) : DURATA) + "s");
            } else {
                window.UGOConsole.setScore("--");
                window.UGOConsole.setTimer("--");
            }
        }

        // ===================== PESCATORE =====================
        let pfStato = 'idle';        // 'idle' | 'num' | 'carta' | 'fine'
        let pfIndice = -1;

        function contaUsate() { return Object.keys(S.usate).length; }

        function pfRender() {
            nascondi('pf-idle'); nascondi('pf-num'); nascondi('pf-card'); nascondi('pf-fine');
            const btn = el('pf-btn');
            if (pfStato === 'idle') {
                mostra('pf-idle');
                btn.textContent = "PESCA UNA CARTA";
            } else if (pfStato === 'num') {
                mostra('pf-num');
                el('pf-numval').textContent = codiceDi(pfIndice);
                btn.textContent = "HO DETTATO IL NUMERO: MOSTRA LA CARTA";
            } else if (pfStato === 'carta') {
                const c = CARTE[pfIndice];
                mostra('pf-card');
                el('pf-word').textContent = c.parola;
                const tb = el('pf-taboos');
                tb.innerHTML = '';
                c.taboo.forEach(function(t) {
                    const d = document.createElement('div');
                    d.className = 'pf-t';
                    d.textContent = t;
                    tb.appendChild(d);
                });
                el('pf-cid').textContent = "N° " + codiceDi(pfIndice);
                btn.textContent = "CARTA FINITA: PESCA LA PROSSIMA";
                // adatta i testi alle misure reali della carta
                const card = el('pf-card');
                const larg = Math.max(60, card.clientWidth - 24);
                const alto = card.clientHeight || 400;
                adattaTesto(el('pf-word'), Math.max(24, Math.min(64, Math.floor(alto * 0.13))), 14, larg);
                const righe = tb.children;
                for (let i = 0; i < righe.length; i++) {
                    adattaTesto(righe[i], Math.max(16, Math.min(34, Math.floor(alto * 0.075))), 11, larg);
                }
            } else {
                mostra('pf-fine');
                btn.textContent = "RIMESCOLA IL MAZZO";
            }
            aggiornaConsole();
        }

        function pfPesca() {
            const liberi = [];
            for (let i = 0; i < CARTE.length; i++) if (!S.usate[i]) liberi.push(i);
            if (liberi.length === 0) { pfStato = 'fine'; pfRender(); return; }
            pfIndice = liberi[rnd(0, liberi.length - 1)];
            S.usate[pfIndice] = true;       // da ora non esce più, in nessun match, finché la pagina resta aperta
            pfStato = 'num';
            suonoPesca();
            pfRender();
        }

        function pfAzione() {
            initAudio();
            if (pfStato === 'idle' || pfStato === 'carta') pfPesca();
            else if (pfStato === 'num') { pfStato = 'carta'; suonoOk(); pfRender(); }
            else { S.usate = {}; pfStato = 'idle'; pfRender(); }   // mazzo finito: rimescola
        }

        // ===================== TELEPATICO =====================
        let M = null;                // match corrente
        let fase = 'menu';           // 'menu' | 'attesa' | 'codice' | 'parola' | 'fine'
        let codice = "";
        let parola = "";
        let cartaCorrente = -1;
        let timerId = null;
        let fineTempo = 0;
        let restante = DURATA;
        let msgTimeout = null;
        let ultimoPasso = 0;

        function tpMsg(testo, classe, ms) {
            const m = el('tp-msg');
            m.textContent = testo;
            m.className = classe || "";
            if (msgTimeout) clearTimeout(msgTimeout);
            if (ms) msgTimeout = setTimeout(function() { if (alive) { m.textContent = ""; m.className = ""; } }, ms);
        }
        function lampeggia(id, ok) {
            const f = el(id);
            f.classList.add(ok ? 'ok' : 'ko');
            schedule(function() { f.classList.remove('ok', 'ko'); }, 350);
        }

        function tpRender() {
            const fc = el('tp-fcode'), fw = el('tp-fword');
            el('tp-code').textContent = codice + "––––".slice(codice.length);
            const w = el('tp-word');
            w.textContent = parola;
            if (parola.length > 12) adattaTesto(w, 28, 12, w.clientWidth || 200); else w.style.fontSize = '';
            if (fase === 'parola') {
                fc.classList.remove('tp-on'); fw.classList.add('tp-on');
                nascondi('tp-numpad'); mostra('tp-qwerty');
            } else {
                fw.classList.remove('tp-on');
                if (fase === 'codice') fc.classList.add('tp-on'); else fc.classList.remove('tp-on');
                mostra('tp-numpad'); nascondi('tp-qwerty');
            }
            el('tp-match').textContent = M ? M.n : 1;
            el('tp-score').textContent = M ? M.punti : 0;
            el('tp-time').textContent = (M && M.attivo) ? Math.max(0, restante) : DURATA;
            aggiornaConsole();
        }

        function tpNuovoMatch() {
            M = { n: S.matchN + 1, punti: 0, giuste: [], passate: [], errori: 0, usati: {}, attivo: false };
            fase = 'attesa';
            codice = ""; parola = ""; cartaCorrente = -1; restante = DURATA;
            nascondi('pt-end'); nascondi('pt-hist');
            el('pt-readytitle').textContent = "Match " + M.n;
            mostra('pt-ready');
            tpMsg("", "", 0);
            tpRender();
        }

        function tpVia() {
            initAudio();
            S.matchN = M.n;
            M.attivo = true;
            fase = 'codice';
            codice = ""; parola = "";
            nascondi('pt-ready');
            fineTempo = Date.now() + DURATA * 1000;
            restante = DURATA;
            if (timerId) clearInterval(timerId);
            timerId = setInterval(tpTick, 250);
            tpMsg("Scrivi il numero della carta e premi OK", "", 0);
            tpRender();
        }

        function tpTick() {
            if (!M || !M.attivo) return;
            const r = Math.max(0, Math.ceil((fineTempo - Date.now()) / 1000));
            if (r !== restante) {
                restante = r;
                el('tp-time').textContent = r;
                if (r > 0 && r <= 10) suonoTic();
                aggiornaConsole();
            }
            if (r <= 0) tpFineMatch();
        }

        function tpValidaCodice() {
            if (codice.length !== 4) { suonoErrore(); tpMsg("Servono 4 cifre (es. 0054)", "ko", 1800); lampeggia('tp-fcode', false); return; }
            const n = parseInt(codice, 10);
            if (n < 1 || n > CARTE.length) {
                suonoErrore(); tpMsg("Questo numero non esiste: riprova", "ko", 2200); lampeggia('tp-fcode', false);
                codice = ""; tpRender(); return;
            }
            if (M.usati[n]) {
                suonoErrore(); tpMsg("Questa carta è già stata usata in questo match", "ko", 2200); lampeggia('tp-fcode', false);
                codice = ""; tpRender(); return;
            }
            cartaCorrente = n - 1;
            fase = 'parola';
            parola = "";
            suonoOk();
            tpMsg("Codice " + codice + " valido: scrivi la parola", "ok", 2000);
            tpRender();
        }

        function tpProvaParola() {
            if (parola === "") return;
            const carta = CARTE[cartaCorrente];
            const n = cartaCorrente + 1;
            if (uguali(parola, carta.parola)) {
                M.punti++;
                M.usati[n] = true;
                M.giuste.push(carta.parola);
                suonoGiusto();
                lampeggia('tp-fword', true);
                tpMsg("Indovinata! +1", "ok", 1600);
                fase = 'codice'; codice = ""; parola = ""; cartaCorrente = -1;
            } else {
                M.errori++;
                suonoErrore();
                lampeggia('tp-fword', false);
                tpMsg("Non è questa: riprova (0 punti)", "ko", 1800);
                parola = "";
            }
            tpRender();
        }

        function tpPasso() {
            if (!M || !M.attivo || (fase !== 'codice' && fase !== 'parola')) return;
            const ora = Date.now();
            if (ora - ultimoPasso < 300) return;     // protezione dal doppio tocco
            ultimoPasso = ora;
            M.punti--;
            if (cartaCorrente >= 0) {
                M.usati[cartaCorrente + 1] = true;
                M.passate.push({ codice: codiceDi(cartaCorrente), parola: CARTE[cartaCorrente].parola });
            } else {
                M.passate.push({ codice: codice.length === 4 ? codice : "", parola: "" });
            }
            suonoPasso();
            tpMsg("Carta scartata: −1", "ko", 1600);
            fase = 'codice'; codice = ""; parola = ""; cartaCorrente = -1;
            tpRender();
        }

        function tpTasto(k) {
            if (!M || !M.attivo) return;
            initAudio();
            if (fase === 'codice') {
                if (k === 'OK') tpValidaCodice();
                else if (k === 'DEL') { codice = codice.slice(0, -1); tpRender(); }
                else if (/^[0-9]$/.test(k) && codice.length < 4) { codice += k; tpRender(); }
            } else if (fase === 'parola') {
                if (k === 'OK') tpProvaParola();
                else if (k === 'DEL') { parola = parola.slice(0, -1); tpRender(); }
                else if (k === 'SP') { if (parola.length > 0 && parola.length < 20) { parola += ' '; tpRender(); } }
                else if (/^[A-Z]$/.test(k) && parola.length < 20) { parola += k; tpRender(); }
            }
        }

        function htmlPunti(n) { return '<span class="' + (n < 0 ? 'pt-neg' : 'pt-pos') + '">' + (n > 0 ? '+' + n : n) + '</span>'; }

        function righeStorico(evidenzia) {
            if (S.storico.length === 0) return '<div class="pt-mrow">Nessun match concluso finora.</div>';
            let h = '';
            S.storico.forEach(function(m) {
                h += '<div class="pt-mrow' + (m.n === evidenzia ? ' pt-cur' : '') + '">Match ' + m.n + ': ' + htmlPunti(m.punti) +
                     ' punti <span style="color:#94a3b8;">(' + m.giuste.length + ' indovinate, ' + m.passate.length + ' scartate, ' + m.errori + ' errori)</span></div>';
            });
            return h;
        }

        function tpFineMatch() {
            if (!M || !M.attivo) return;
            M.attivo = false;
            fase = 'fine';
            if (timerId) { clearInterval(timerId); timerId = null; }
            restante = 0;
            S.storico.push({ n: M.n, punti: M.punti, giuste: M.giuste.slice(), passate: M.passate.slice(), errori: M.errori });
            suonoFine();

            el('pt-endtitle').textContent = "Tempo scaduto! Match " + M.n;
            el('pt-endscore').innerHTML = htmlPunti(M.punti) + ' <span style="font-size:0.4em;color:#94a3b8;font-weight:normal;">punti</span>';
            let h = '<div class="pt-sec">Parole indovinate (' + M.giuste.length + ')</div>';
            h += M.giuste.length ? '<div>' + M.giuste.join(', ') + '</div>' : '<div>Nessuna</div>';
            h += '<div class="pt-sec">Carte scartate (' + M.passate.length + ')</div>';
            if (M.passate.length) {
                h += '<div>' + M.passate.map(function(p) { return p.parola ? p.parola + ' (' + p.codice + ')' : '(carta senza codice)'; }).join(', ') + '</div>';
            } else h += '<div>Nessuna</div>';
            h += '<div class="pt-sec">Tentativi sbagliati: ' + M.errori + '</div>';
            h += '<div class="pt-sec">Storico dei match</div>' + righeStorico(M.n);
            el('pt-endbox').innerHTML = h;
            mostra('pt-end');
            tpRender();
        }

        // ===================== RUOLI E MENU =====================
        function fermaMatch() {
            if (timerId) { clearInterval(timerId); timerId = null; }
            if (M) M.attivo = false;
        }

        function scegliRuolo(r) {
            initAudio();
            ruolo = r;
            nascondi('pt-menu');
            if (r === 'pescatore') {
                nascondi('tp-view'); mostra('pf-view');
                el('pt-role').textContent = "Pescatore";
                pfStato = 'idle';
                pfRender();
            } else {
                nascondi('pf-view'); mostra('tp-view');
                el('pt-role').textContent = "Telepatico";
                tpNuovoMatch();
            }
            aggiornaConsole();
        }

        function tornaAlMenu() {
            fermaMatch();
            ruolo = null; fase = 'menu';
            nascondi('pf-view'); nascondi('tp-view');
            nascondi('pt-ready'); nascondi('pt-end'); nascondi('pt-hist');
            el('pt-role').textContent = "Pescatore&Telepatico";
            mostra('pt-menu');
            aggiornaConsole();
        }

        let swapConferma = false;
        function swapClick() {
            if (ruolo === 'telepatico' && M && M.attivo && !swapConferma) {
                swapConferma = true;
                el('pt-swap').textContent = "Interrompere?";
                schedule(function() { swapConferma = false; el('pt-swap').innerHTML = "&#8644; Ruolo"; }, 2500);
                return;
            }
            swapConferma = false;
            el('pt-swap').innerHTML = "&#8644; Ruolo";
            tornaAlMenu();
        }

        let resetConferma = false;
        function resetClick() {
            const b = el('pt-reset');
            if (!resetConferma) {
                resetConferma = true;
                b.textContent = "Sicuro? Tocca di nuovo per azzerare";
                schedule(function() { resetConferma = false; b.textContent = "Azzera la sessione (mazzo e storico)"; }, 3000);
                return;
            }
            resetConferma = false;
            S.usate = {}; S.storico = []; S.matchN = 0;
            b.textContent = "Sessione azzerata";
            schedule(function() { b.textContent = "Azzera la sessione (mazzo e storico)"; }, 2000);
        }

        function apriStorico() {
            if (!S) return;
            el('pt-histlist').innerHTML = righeStorico(-1) +
                (M && M.attivo ? '<div class="pt-mrow pt-cur">Match ' + M.n + ' (in corso): ' + htmlPunti(M.punti) + ' punti</div>' : '');
            mostra('pt-hist');
        }

        // ===================== EVENTI =====================
        el('pt-menu').addEventListener('click', function(e) {
            const b = trovaConAttr(e.target, 'data-role');
            if (b) scegliRuolo(b.getAttribute('data-role'));
        });
        el('pt-reset').addEventListener('click', resetClick);
        el('pt-swap').addEventListener('click', swapClick);
        el('pt-snd').addEventListener('click', function() {
            suoniOn = !suoniOn;
            this.innerHTML = suoniOn ? '&#128266;' : '&#128263;';
            if (suoniOn) initAudio();
        });
        el('pf-btn').addEventListener('click', pfAzione);
        el('tp-keys').addEventListener('click', function(e) {
            const b = trovaConAttr(e.target, 'data-k');
            if (b) tpTasto(b.getAttribute('data-k'));
        });
        el('tp-pass').addEventListener('click', tpPasso);
        el('tp-histbtn').addEventListener('click', apriStorico);
        el('pt-histclose').addEventListener('click', function() { nascondi('pt-hist'); });
        el('pt-go').addEventListener('click', tpVia);
        el('pt-next').addEventListener('click', tpNuovoMatch);
        el('pt-chrole').addEventListener('click', tornaAlMenu);

        // Tastiera fisica (sui dispositivi touch non compare mai la tastiera del sistema: non ci sono campi di testo)
        if (window.__ptKeyHandler) window.removeEventListener('keydown', window.__ptKeyHandler);
        window.__ptKeyHandler = function(e) {
            if (!alive || !document.getElementById('pt-container')) return;
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            const k = e.key;
            if (ruolo === 'pescatore') {
                if (k === 'Enter') { pfAzione(); e.preventDefault(); }
                return;
            }
            if (ruolo !== 'telepatico' || !M || !M.attivo) return;
            const overlayAperto = !el('pt-hist').classList.contains('pt-hide');
            if (overlayAperto) return;
            if (fase === 'codice') {
                if (/^[0-9]$/.test(k)) { tpTasto(k); e.preventDefault(); }
                else if (k === 'Backspace') { tpTasto('DEL'); e.preventDefault(); }
                else if (k === 'Enter') { tpTasto('OK'); e.preventDefault(); }
            } else if (fase === 'parola') {
                if (k.length === 1 && /[a-zA-Zàèéìòùç]/.test(k)) { tpTasto(senzaAccenti(k.toLowerCase()).toUpperCase()); e.preventDefault(); }
                else if (k === ' ') { tpTasto('SP'); e.preventDefault(); }
                else if (k === 'Backspace') { tpTasto('DEL'); e.preventDefault(); }
                else if (k === 'Enter') { tpTasto('OK'); e.preventDefault(); }
            }
        };
        window.addEventListener('keydown', window.__ptKeyHandler);

        const onResize = function() { if (ruolo === 'pescatore' && pfStato === 'carta') pfRender(); };
        window.addEventListener('resize', onResize);

        // ===================== PULIZIA ALL'USCITA =====================
        if (window.UGOConsole.onExit) {
            window.UGOConsole.onExit(function() {
                alive = false;
                fermaMatch();
                if (msgTimeout) clearTimeout(msgTimeout);
                timeouts.forEach(function(id) { clearTimeout(id); });
                window.removeEventListener('keydown', window.__ptKeyHandler);
                window.removeEventListener('resize', onResize);
                try { if (audioCtx && audioCtx.close) audioCtx.close(); } catch (e) {}
                audioCtx = null;
                const st = document.getElementById('style-cartuccia-9');
                if (st) st.remove();
            });
        }

        aggiornaConsole();
        // __TEST_HOOK__
    }
});

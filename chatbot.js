/* ═══════════════════════════════════════════════════════════════
   PALACE CHATBOT — chatbot.js
   Rule-based assistant per Agenzia Immobiliare Palace · Conselve
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Contatore messaggi: ogni N risposte mostriamo un CTA soffice ── */
    let msgCount = 0;
    const CTA_EVERY = 4; // ogni 4 risposte bot inseriamo un invito al contatto

    /* ════════════════════════════════════════════════
       BASE DI CONOSCENZA
    ════════════════════════════════════════════════ */
    const KB = [
        {
            tags: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hei', 'buon'],
            reply: ['Ciao! 👋 Sono l\'assistente virtuale di <strong>Agenzia Immobiliare Palace</strong>. Come posso aiutarti oggi?'],
            chips: ['Voglio vendere casa', 'Quanto costa la vostra agenzia?', 'Dove siete?']
        },
        {
            tags: ['vendere', 'vendita', 'vendo', 'voglio vendere', 'mettere in vendita'],
            reply: [
                'Perfetto! Vendere casa con noi è semplice e senza stress. Il nostro metodo si articola in <strong>4 fasi</strong>:<br><br>1️⃣ <strong>Valutazione</strong> reale di mercato<br>2️⃣ <strong>Studio</strong> della documentazione<br>3️⃣ <strong>Marketing</strong> professionale (foto, video, MLS)<br>4️⃣ <strong>Negoziazione</strong> fino all\'atto notarile<br><br>In media vendiamo in <strong>35 giorni</strong>, e il 90% degli incarichi va a buon fine. 🏆'
            ],
            chips: ['Come funziona la valutazione?', 'Quanto tempo ci vuole?', 'Quali zone coprite?']
        },
        {
            tags: ['comprare', 'acquistare', 'cerco casa', 'acquisto'],
            reply: [
                'Siamo qui per aiutarti anche nell\'acquisto! Selezioniamo solo acquirenti qualificati e li seguiamo in ogni fase, dalla ricerca dell\'immobile giusto fino alla firma dal notaio. Un solo referente ti accompagna dall\'inizio alla fine. 🤝'
            ],
            chips: ['Quali zone coprite?', 'Quanto ci vuole per acquistare?', 'Contattaci']
        },
        {
            tags: ['valutazione', 'valutare', 'quanto vale', 'prezzo', 'stima'],
            reply: [
                'La nostra valutazione è <strong>gratuita e senza impegno</strong>. Non usiamo stime automatiche — analizziamo le vere compravendite avvenute nella tua zona e la concorrenza reale sul mercato. Nessuna promessa gonfiata: solo dati reali. 📊'
            ],
            chips: ['Come la richiedete?', 'In quanto tempo?', 'È gratuita?']
        },
        {
            tags: ['gratuita', 'gratis', 'costo', 'quanto costa', 'commissione', 'provvigione', 'tariffa', 'prezzo agenzia'],
            reply: [
                'La valutazione iniziale è <strong>sempre gratuita e senza impegno</strong>. Per quanto riguarda le nostre commissioni, variano in base alla tipologia e al valore dell\'immobile. Per un preventivo preciso e personalizzato ti invitiamo a contattarci direttamente.'
            ],
            chips: ['Chiamaci ora', 'Contattaci via mail', 'Come funziona il metodo?']
        },
        {
            tags: ['tempo', 'quanto ci vuole', 'veloce', 'rapido', 'giorni', 'settimane', 'mesi'],
            reply: [
                'La nostra media è di soli <strong>35 giorni</strong> sul mercato, contro i 90-120 giorni tipici di altre agenzie. <br><br>Il record? Alcune case vendute in soli <strong>3 giorni</strong>! ⚡ Ovviamente i tempi variano a seconda dell\'immobile e del mercato locale, ma il nostro metodo è progettato per massimizzare la velocità senza sacrificare il prezzo.'
            ],
            chips: ['Come ottenete questi risultati?', 'Vendita a Conselve', 'Contattaci']
        },
        {
            tags: ['zona', 'zone', 'dove', 'conselve', 'padova', 'monselice', 'albignasego', 'battaglia', 'barbarano'],
            reply: [
                'Operiamo principalmente a <strong>Conselve</strong> e in tutto il <strong>Padovano</strong>: Monselice, Albignasego, Battaglia Terme, Barbarano Vicentino e dintorni. 📍<br><br>Sei in una zona diversa? Contattaci lo stesso, valutiamo caso per caso!'
            ],
            chips: ['Come contattarvi?', 'Voglio una valutazione', 'Chi siete?']
        },
        {
            tags: ['team', 'chi siete', 'chi sono', 'staff', 'persone', 'chi lavora', 'loredana', 'matteo', 'bryan', 'michael', 'martina'],
            reply: [
                'Il nostro team è composto da <strong>5 professionisti</strong> scelti per competenza e passione:<br><br>👩‍💼 <strong>Loredana Codogno</strong> — Titolare<br>👨‍💼 <strong>Matteo Lion</strong> — Titolare & Senior Advisor<br>👨‍💼 <strong>Bryan Lorenzo</strong> — Collaboratore<br>👨‍💼 <strong>Michael Lorenzo</strong> — Collaboratore<br>👩‍💼 <strong>Martina Bovo</strong> — Coordinatrice<br><br>Con oltre <strong>20 anni di esperienza</strong> nel mercato locale. 🏆'
            ],
            chips: ['Dove si trova l\'agenzia?', 'Come vendete?', 'Contattaci']
        },
        {
            tags: ['esperienza', 'anni', 'storia', 'fondato', 'quando', 'da quando'],
            reply: [
                'Siamo attivi da oltre <strong>20 anni</strong> nel mercato immobiliare del Padovano. In questo tempo abbiamo seguito più di <strong>2.000 clienti soddisfatti</strong> e concluso oltre <strong>500 pratiche con successo</strong>. L\'esperienza conta — e i nostri numeri lo dimostrano. 💪'
            ],
            chips: ['Quali risultati ottenete?', 'Chi siete?', 'Contattatemi']
        },
        {
            tags: ['risultati', 'numeri', 'statistiche', 'dati', 'successo', 'percentuale', 'record'],
            reply: [
                'I nostri numeri parlano chiaro:<br><br>⏱ <strong>35 giorni</strong> in media sul mercato<br>🏠 <strong>90%</strong> degli incarichi venduti<br>💰 <strong>+2,1%</strong> in più rispetto al prezzo richiesto<br>👥 <strong>2.000+</strong> clienti soddisfatti<br><br>Non stime — dati reali delle nostre compravendite. ✅'
            ],
            chips: ['Come lo fate?', 'Voglio vendere', 'Contattaci']
        },
        {
            tags: ['recensione', 'recensioni', 'opinioni', 'google', 'feedback', 'testimonianza'],
            reply: [
                'Su Google abbiamo una valutazione di <strong>5.0 / 5</strong> ⭐⭐⭐⭐⭐ con decine di recensioni reali. Leggi cosa dicono i nostri clienti:<br><br><em>"CONSIGLIATISSIMO!! Personale competente, disponibile e onesta."</em> — Samuel C.<br><br><em>"Profesionali, cordiali e sempre reperibili."</em> — Simone R.'
            ],
            chips: ['Voglio vendere', 'Chi siete?', 'Contattatemi']
        },
        {
            tags: ['contatto', 'contattare', 'contattarvi', 'telefonare', 'chiamare', 'scrivere', 'mail', 'email', 'numero'],
            reply: [
                '📞 <strong>Telefono</strong>: <a href="tel:+390499501631" style="color:var(--blue-light);font-weight:700">049 950 1631</a><br>✉️ <strong>Email / Form</strong>: <a href="/#contatti" style="color:var(--blue-light);font-weight:700">compila il form</a> sulla homepage<br><br>Rispondiamo a ogni messaggio <strong>personalmente</strong>, senza pressione commerciale. Il primo colloquio è sempre gratuito.'
            ],
            chips: ['Grazie!', 'Voglio una valutazione', 'Orari di apertura']
        },
        {
            tags: ['orario', 'orari', 'apertura', 'aperto', 'disponibile', 'quando'],
            reply: [
                'Siamo disponibili <strong>dal lunedì al venerdì</strong>, dalle <strong>9:00 alle 18:00</strong>. 📅<br><br>Puoi anche lasciarci un messaggio tramite il form e ti ricontattiamo al più presto!'
            ],
            chips: ['Contattaci ora', 'Voglio vendere', 'Dove siete?']
        },
        {
            tags: ['home staging', 'staging', 'fotografie', 'foto', 'video', 'marketing', 'promozione', 'portali'],
            reply: [
                'Il nostro piano marketing è completo:<br><br>📸 <strong>Foto professionali</strong> di alta qualità<br>🎬 <strong>Video d\'impatto</strong> per valorizzare ogni ambiente<br>🏠 <strong>Home staging</strong> per presentare al meglio<br>📱 <strong>Social media</strong> e <strong>portali immobiliari</strong> principali<br>🤝 <strong>Rete MLS</strong> con altri professionisti<br>🗓 <strong>Open Day</strong> coordinati<br><br>Ogni immobile riceve il suo piano personalizzato. 🎯'
            ],
            chips: ['Tempi di vendita?', 'Costo servizio?', 'Contattaci']
        },
        {
            tags: ['documento', 'documentazione', 'conformità', 'catasto', 'urbanistica', 'rogito', 'notaio'],
            reply: [
                'Ci occupiamo noi di tutto! Raccogliamo e verifichiamo tutta la documentazione necessaria: <strong>conformità urbanistica e catastale</strong>, documenti d\'identità, APE e tutto ciò che serve per arrivare al rogito senza sorprese. 📋<br><br>Il nostro obiettivo è una vendita sicura e senza intoppi.'
            ],
            chips: ['Come funziona il metodo?', 'Contattaci', 'Tempi?']
        },
        {
            tags: ['guida', 'guide', 'materiale', 'consigli', 'informazioni', 'documentazione gratuita'],
            reply: [
                'Abbiamo preparato delle <strong>guide gratuite</strong> per aiutarti a vendere casa al meglio:<br><br>📖 Come il prezzo di partenza influenza il risultato<br>📖 L\'Effetto Novità: come sfruttarlo a tuo favore<br>📖 Home Staging: valorizza prima di vendere<br>📖 La pre-qualifica dell\'acquirente<br><br>Le trovi nella sezione <a href="/materiale.html" style="color:var(--blue-light);font-weight:700">Materiale Informativo</a>!'
            ],
            chips: ['Voglio vendere', 'Contattaci', 'Chi siete?']
        },
        {
            tags: ['grazie', 'ok', 'capito', 'perfetto', 'ottimo', 'bene', 'certo', 'esatto'],
            reply: [
                'Prego! 😊 Sono qui se hai altre domande. Ricorda che puoi contattarci direttamente — il nostro team risponde sempre personalmente.',
                'Figurati! Se vuoi sapere altro sono qui. 🙌'
            ],
            chips: ['Voglio vendere', 'Contattatemi', 'Orari di apertura']
        },
        {
            tags: ['addio', 'arrivederci', 'a presto', 'ciao ciao', 'bye'],
            reply: ['A presto! 👋 Siamo qui quando vuoi. In bocca al lupo con la tua casa!'],
            chips: []
        }
    ];

    /* ── Default quando non si trova nulla ── */
    const DEFAULT_REPLIES = [
        'Bella domanda! 🤔 Per una risposta precisa ti consiglio di contattarci direttamente — il nostro team ti risponderà subito.',
        'Non sono sicuro di aver capito bene. Puoi riformulare? Oppure <a href="/#contatti" style="color:var(--blue-light)">contattaci direttamente</a> per parlarci di persona.',
        'Per questa informazione specifica ti suggerisco di <a href="/#contatti" style="color:var(--blue-light)">compilare il nostro form</a> o chiamarci — sarà più veloce e preciso! 😊'
    ];

    /* ── CTA soft (appaiono ogni CTA_EVERY messaggi) ── */
    const CTA_MESSAGES = [
        '<br><small style="opacity:.7">💡 Se preferisci parlare con noi direttamente, <a href="/#contatti" style="color:var(--blue-light)">scrivici qui</a> o chiama il nostro ufficio.</small>',
        '<br><small style="opacity:.7">📞 Hai domande specifiche sul tuo immobile? <a href="/#contatti" style="color:var(--blue-light)">Contattaci</a>, la prima consulenza è gratuita.</small>',
        '<br><small style="opacity:.7">✉️ Vuoi una valutazione gratuita? <a href="/#contatti" style="color:var(--blue-light)">Lasciaci i tuoi dati</a> e ti richiamiamo noi.</small>'
    ];

    /* ════════════════════════════════════════════════
       MOTORE DI RISPOSTA
    ════════════════════════════════════════════════ */
    function findReply(text) {
        const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let bestMatch = null;
        let bestScore = 0;

        for (const entry of KB) {
            let score = 0;
            for (const tag of entry.tags) {
                if (lower.includes(tag)) score += tag.length; // pesare tag più lunghi
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = entry;
            }
        }

        if (bestMatch && bestScore >= 3) return bestMatch;
        return null;
    }

    function getReply(text) {
        const match = findReply(text);
        if (match) {
            const reply = match.reply[Math.floor(Math.random() * match.reply.length)];
            const chips = match.chips || [];
            return { reply, chips };
        }
        return {
            reply: DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)],
            chips: ['Voglio vendere', 'Contattatemi', 'Chi siete?']
        };
    }

    /* ════════════════════════════════════════════════
       COSTRUZIONE WIDGET
    ════════════════════════════════════════════════ */
    function buildWidget() {
        const style = document.createElement('style');
        style.textContent = `
      /* ── Chatbot widget ── */
      #palace-chat-fab {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9000;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        border: none;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(59,130,246,.45);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
        outline: none;
      }
      #palace-chat-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(59,130,246,.6); }
      #palace-chat-fab svg { width: 28px; height: 28px; fill: #fff; transition: opacity .2s; }
      #palace-chat-fab .fab-close { display: none; }
      #palace-chat-fab.is-open .fab-open  { display: none; }
      #palace-chat-fab.is-open .fab-close { display: block; }
      #palace-chat-fab .fab-badge {
        position: absolute;
        top: -4px; right: -4px;
        width: 18px; height: 18px;
        border-radius: 50%;
        background: #ef4444;
        border: 2px solid #fff;
        font-size: 10px;
        font-weight: 800;
        color: #fff;
        display: flex; align-items: center; justify-content: center;
        animation: badge-pop .4s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes badge-pop { from { transform: scale(0); } to { transform: scale(1); } }

      #palace-chat-window {
        position: fixed;
        bottom: 100px;
        right: 28px;
        z-index: 8999;
        width: 360px;
        max-width: calc(100vw - 40px);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 24px 72px rgba(5,8,30,.45);
        display: flex;
        flex-direction: column;
        background: #0d1640;
        border: 1px solid rgba(59,130,246,.25);
        transform: scale(.9) translateY(20px);
        opacity: 0;
        pointer-events: none;
        transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .3s;
        max-height: min(580px, calc(100vh - 140px));
      }
      #palace-chat-window.is-open {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      /* Header */
      .pchat-header {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
      .pchat-avatar {
        width: 40px; height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,.15);
        border: 2px solid rgba(255,255,255,.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
      .pchat-header-info { flex: 1; min-width: 0; }
      .pchat-header-name { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.2; }
      .pchat-header-status { font-size: 11px; color: rgba(255,255,255,.6); }
      .pchat-header-status::before {
        content: '';
        display: inline-block;
        width: 7px; height: 7px;
        border-radius: 50%;
        background: #22c55e;
        margin-right: 5px;
        vertical-align: middle;
      }

      /* Messages */
      .pchat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scrollbar-width: thin;
        scrollbar-color: rgba(59,130,246,.3) transparent;
      }
      .pchat-messages::-webkit-scrollbar { width: 4px; }
      .pchat-messages::-webkit-scrollbar-track { background: transparent; }
      .pchat-messages::-webkit-scrollbar-thumb { background: rgba(59,130,246,.3); border-radius: 4px; }

      .pchat-bubble {
        max-width: 88%;
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.55;
        animation: bubble-in .3s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes bubble-in { from { opacity:0; transform: translateY(10px) scale(.95); } to { opacity:1; transform: none; } }
      .pchat-bubble--bot {
        background: rgba(30,58,138,.6);
        border: 1px solid rgba(59,130,246,.2);
        color: rgba(255,255,255,.92);
        border-bottom-left-radius: 4px;
        align-self: flex-start;
      }
      .pchat-bubble--bot a { color: #60a5fa; }
      .pchat-bubble--user {
        background: #3b82f6;
        color: #fff;
        border-bottom-right-radius: 4px;
        align-self: flex-end;
      }
      .pchat-typing {
        display: flex; gap: 5px;
        align-items: center;
        padding: 10px 14px;
        background: rgba(30,58,138,.6);
        border: 1px solid rgba(59,130,246,.2);
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        width: fit-content;
        align-self: flex-start;
      }
      .pchat-typing span {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: rgba(255,255,255,.5);
        animation: typing-dot 1.2s infinite ease-in-out;
      }
      .pchat-typing span:nth-child(2) { animation-delay: .2s; }
      .pchat-typing span:nth-child(3) { animation-delay: .4s; }
      @keyframes typing-dot { 0%,60%,100% { opacity:.3; transform: scale(.8); } 30% { opacity:1; transform: scale(1); } }

      /* Chips */
      .pchat-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 16px 10px;
        flex-shrink: 0;
      }
      .pchat-chip {
        padding: 6px 12px;
        border-radius: 100px;
        border: 1px solid rgba(59,130,246,.4);
        background: rgba(59,130,246,.12);
        color: #93c5fd;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: background .2s, color .2s, transform .15s;
        white-space: nowrap;
      }
      .pchat-chip:hover { background: rgba(59,130,246,.28); color: #fff; transform: translateY(-1px); }

      /* Input */
      .pchat-input-row {
        display: flex;
        gap: 8px;
        padding: 12px 16px 16px;
        flex-shrink: 0;
        border-top: 1px solid rgba(59,130,246,.15);
      }
      .pchat-input {
        flex: 1;
        background: rgba(255,255,255,.07);
        border: 1px solid rgba(59,130,246,.25);
        border-radius: 12px;
        padding: 10px 14px;
        color: #fff;
        font-size: 13px;
        font-family: inherit;
        outline: none;
        transition: border-color .2s;
      }
      .pchat-input::placeholder { color: rgba(255,255,255,.35); }
      .pchat-input:focus { border-color: #3b82f6; }
      .pchat-send {
        width: 40px; height: 40px;
        border-radius: 10px;
        background: #3b82f6;
        border: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background .2s, transform .15s;
      }
      .pchat-send:hover { background: #2563eb; transform: scale(1.05); }
      .pchat-send svg { width: 18px; height: 18px; fill: #fff; }

      @media (max-width: 480px) {
        #palace-chat-window { right: 12px; bottom: 90px; width: calc(100vw - 24px); }
        #palace-chat-fab { right: 16px; bottom: 20px; }
      }
    `;
        document.head.appendChild(style);

        /* FAB button */
        const fab = document.createElement('button');
        fab.id = 'palace-chat-fab';
        fab.setAttribute('aria-label', 'Apri chat assistente');
        fab.innerHTML = `
      <svg class="fab-open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
      <svg class="fab-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <span class="fab-badge">1</span>
    `;
        document.body.appendChild(fab);

        /* Chat window */
        const win = document.createElement('div');
        win.id = 'palace-chat-window';
        win.setAttribute('role', 'dialog');
        win.setAttribute('aria-label', 'Chat assistente Palace');
        win.innerHTML = `
      <div class="pchat-header">
        <div class="pchat-avatar">🏠</div>
        <div class="pchat-header-info">
          <div class="pchat-header-name">Assistente Palace</div>
          <div class="pchat-header-status">Online · risposta immediata</div>
        </div>
      </div>
      <div class="pchat-messages" id="pchat-msgs"></div>
      <div class="pchat-chips" id="pchat-chips"></div>
      <div class="pchat-input-row">
        <input class="pchat-input" id="pchat-input" type="text" placeholder="Scrivi un messaggio…" autocomplete="off" maxlength="200" />
        <button class="pchat-send" id="pchat-send" aria-label="Invia">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
        document.body.appendChild(win);

        return { fab, win };
    }

    /* ════════════════════════════════════════════════
       LOGICA WIDGET
    ════════════════════════════════════════════════ */
    function init() {
        const { fab, win } = buildWidget();
        const msgs = document.getElementById('pchat-msgs');
        const chipsEl = document.getElementById('pchat-chips');
        const input = document.getElementById('pchat-input');
        const sendBtn = document.getElementById('pchat-send');
        const badge = fab.querySelector('.fab-badge');

        let isOpen = false;
        let firstOpen = true;

        /* ── Toggle ── */
        function toggle() {
            isOpen = !isOpen;
            fab.classList.toggle('is-open', isOpen);
            win.classList.toggle('is-open', isOpen);
            fab.setAttribute('aria-label', isOpen ? 'Chiudi chat' : 'Apri chat assistente');
            if (isOpen) {
                badge.remove();
                input.focus();
                if (firstOpen) {
                    firstOpen = false;
                    setTimeout(() => addBotMsg(
                        'Ciao! 👋 Sono l\'assistente virtuale di <strong>Agenzia Palace</strong>. Posso aiutarti con informazioni su vendita, valutazione, metodo e molto altro. Come posso esserti utile?',
                        ['Voglio vendere casa', 'Come funziona la valutazione?', 'Chi siete?']
                    ), 400);
                }
                scrollDown();
            }
        }

        fab.addEventListener('click', toggle);
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) toggle(); });

        /* ── Aggiungi bolla bot ── */
        function addBotMsg(html, chips = []) {
            const div = document.createElement('div');
            div.className = 'pchat-bubble pchat-bubble--bot';
            div.innerHTML = html;
            msgs.appendChild(div);
            renderChips(chips);
            scrollDown();
        }

        /* ── Indicatore di scrittura ── */
        function showTyping(ms = 900) {
            return new Promise(resolve => {
                const t = document.createElement('div');
                t.className = 'pchat-typing';
                t.innerHTML = '<span></span><span></span><span></span>';
                msgs.appendChild(t);
                scrollDown();
                setTimeout(() => { t.remove(); resolve(); }, ms);
            });
        }

        /* ── Chips ── */
        function renderChips(chips) {
            chipsEl.innerHTML = '';
            chips.forEach(label => {
                const btn = document.createElement('button');
                btn.className = 'pchat-chip';
                btn.textContent = label;
                btn.addEventListener('click', () => sendMsg(label));
                chipsEl.appendChild(btn);
            });
        }

        /* ── Scroll ── */
        function scrollDown() {
            setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
        }

        /* ── Invia messaggio ── */
        async function sendMsg(text) {
            text = text.trim();
            if (!text) return;

            chipsEl.innerHTML = '';

            // Bolla utente
            const userDiv = document.createElement('div');
            userDiv.className = 'pchat-bubble pchat-bubble--user';
            userDiv.textContent = text;
            msgs.appendChild(userDiv);
            input.value = '';
            scrollDown();

            // Risposta
            await showTyping(700 + Math.random() * 500);
            msgCount++;

            const { reply, chips } = getReply(text);

            // CTA soft ogni N messaggi
            let fullReply = reply;
            if (msgCount > 0 && msgCount % CTA_EVERY === 0) {
                const cta = CTA_MESSAGES[Math.floor(Math.random() * CTA_MESSAGES.length)];
                fullReply += cta;
            }

            addBotMsg(fullReply, chips);
        }

        sendBtn.addEventListener('click', () => sendMsg(input.value));
        input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(input.value); });

        /* ── Chip di benvenuto iniziale ── */
        renderChips(['Voglio vendere', 'Valutazione gratuita', 'Chi siete?']);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

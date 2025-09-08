export default {
  title: "Come Giocare",
  subtitle: "Impara come padroneggiare il gioco giornaliero di indovinare le immagini!",
  objective: {
    title: "Obiettivo",
    description: "Indovina l'anno in cui è stata scattata una fotografia. Hai 5 tentativi per indovinarla!"
  },
  howItWorks: {
    title: "Come Funziona",
    step1: "Osserva attentamente la fotografia per cercare indizi sul periodo storico.",
    step2: "Inserisci la tua ipotesi per l'anno in cui è stata scattata la foto.",
    step3: "Ricevi feedback: 'Più alto' se l'anno effettivo è successivo, 'Più basso' se è precedente.",
    step4: "Usa il feedback per restringere il prossimo tentativo. L'intervallo valido si aggiusterà automaticamente!"
  },
  smartRange: {
    title: "Sistema di Intervallo Intelligente",
    description: "Dopo ogni tentativo, il gioco restringe intelligentemente gli anni possibili per aiutarti:",
    example: {
      title: "Esempio",
      step1: "Indovini 1950, risposta è 'Più alto' → Nuovo intervallo: 1951-2025",
      step2: "Indovini 1980, risposta è 'Più basso' → Nuovo intervallo: 1951-1979",
      step3: "Indovini 1965, risposta è 'Corretto!' → Hai vinto!"
    }
  },
  tips: {
    title: "Consigli",
    tip1: "Cerca stili di abbigliamento, architettura, auto e tecnologia nella foto",
    tip2: "Inizia con un'ipotesi di fascia media per restringere rapidamente le possibilità",
    tip3: "Fai attenzione alla qualità della foto - le foto più vecchie tendono ad essere in bianco e nero o seppia"
  }
} as const
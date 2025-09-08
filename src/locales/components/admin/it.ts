export default {
  dashboard: {
    title: "Dashboard Amministratore",
    subtitle: "Gestisci immagini giornaliere e contenuti di gioco",
    stats: {
      totalImages: "Immagini Totali",
      scheduled: "Programmate", 
      unscheduled: "Non Programmate",
      gamesPlayed: "Partite Giocate"
    },
    todayImage: {
      title: "Immagine di Oggi",
      subtitle: "Immagine attuale per {date}",
      noImage: "Nessuna immagine impostata per oggi",
      setRandom: "Imposta Immagine Casuale",
      chooseSpecific: "Scegli Immagine Specifica",
      year: "Anno: {year}",
      gamesPlayed: "Partite giocate: {count}"
    },
    quickActions: {
      title: "Azioni Rapide",
      uploadNew: "Carica Nuova Immagine",
      scheduleImages: "Programma Immagini"
    },
    recentImages: {
      title: "Immagini Recenti",
      noScheduled: "Nessuna immagine programmata",
      year: "Anno {year}"
    }
  },
  images: {
    title: "Gestione Immagini", 
    subtitle: "Carica, programma e gestisci immagini giornaliere",
    upload: {
      title: "Carica Nuova Immagine",
      subtitle: "Aggiungi una nuova immagine alla collezione",
      button: "Carica Nuova Immagine"
    },
    scheduled: {
      title: "Immagini Programmate ({count})",
      subtitle: "Immagini programmate per date specifiche",
      noImages: "Nessuna immagine programmata",
      today: "Oggi",
      past: "Passato",
      year: "Anno: {year}",
      games: "Partite: {count}",
      setToday: "Imposta per Oggi"
    },
    unscheduled: {
      title: "Immagini Non Programmate ({count})",
      subtitle: "Immagini non ancora programmate per alcuna data",
      noImages: "Nessuna immagine non programmata",
      year: "Anno: {year}",
      setToday: "Imposta per Oggi"
    },
    bulk: {
      title: "Programma in Blocco Immagini Casuali",
      subtitle: "Programma automaticamente immagini casuali per più giorni",
      startDate: "Data di Inizio",
      days: "Numero di Giorni",
      button: "Programma in Blocco ({count} disponibili)",
      success: "Programmate {count} immagini"
    },
    tabs: {
      upload: "Carica",
      scheduled: "Programmate", 
      unscheduled: "Non Programmate",
      bulk: "Azioni in Blocco"
    }
  },
  forms: {
    upload: {
      title: "Carica Nuova Immagine",
      subtitle: "Aggiungi una nuova immagine alla collezione giornaliera",
      cloudinaryUrl: {
        label: "URL Cloudinary",
        placeholder: "https://res.cloudinary.com/...",
        description: "L'URL dell'immagine dal tuo account Cloudinary",
        error: "Inserisci un URL valido"
      },
      year: {
        label: "Anno",
        description: "L'anno in cui è stata scattata questa foto",
        minError: "L'anno deve essere dopo il 1800",
        maxError: "L'anno non può essere nel futuro"
      },
      description: {
        label: "Descrizione (Opzionale)",
        placeholder: "Breve descrizione dell'immagine...",
        description: "Una breve descrizione del contenuto dell'immagine"
      },
      button: "Carica Immagine",
      success: "Immagine caricata con successo",
      error: "Caricamento immagine fallito"
    },
    edit: {
      title: "Modifica Immagine",
      subtitle: "Aggiorna dettagli immagine e programmazione", 
      date: {
        label: "Data Programmata",
        description: "La data in cui questa immagine dovrebbe essere presente",
        error: "Formato data non valido"
      },
      description: {
        label: "Descrizione (Opzionale)",
        placeholder: "Breve descrizione dell'immagine...",
        description: "Una breve descrizione del contenuto dell'immagine"
      },
      saveButton: "Salva Modifiche",
      deleteButton: "Elimina Immagine",
      deleteTitle: "Elimina Immagine",
      deleteDescription: "Sei sicuro di voler eliminare questa immagine? Questa azione non può essere annullata.",
      cancel: "Annulla",
      delete: "Elimina",
      updateSuccess: "Immagine aggiornata con successo",
      updateError: "Aggiornamento immagine fallito",
      deleteSuccess: "Immagine eliminata con successo", 
      deleteError: "Eliminazione immagine fallita",
      deleteBlocked: "Impossibile eliminare immagine con progressi di gioco esistenti",
      year: "Anno: {year}",
      gamesPlayed: "Partite giocate: {count}"
    }
  },
  actions: {
    edit: "Modifica",
    delete: "Elimina",
    schedule: "Programma",
    confirmDelete: "Sei sicuro di voler eliminare questa immagine?"
  }
} as const
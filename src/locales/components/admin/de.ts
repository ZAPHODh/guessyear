export default {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Tägliche Bilder und Spielinhalte verwalten",
    stats: {
      totalImages: "Bilder insgesamt",
      scheduled: "Geplant", 
      unscheduled: "Ungeplant",
      gamesPlayed: "Gespielte Spiele"
    },
    todayImage: {
      title: "Heutiges Bild",
      subtitle: "Aktuelles Bild für {date}",
      noImage: "Kein Bild für heute festgelegt",
      setRandom: "Zufälliges Bild festlegen",
      chooseSpecific: "Spezifisches Bild wählen",
      year: "Jahr: {year}",
      gamesPlayed: "Gespielte Spiele: {count}"
    },
    quickActions: {
      title: "Schnellaktionen",
      uploadNew: "Neues Bild hochladen",
      scheduleImages: "Bilder planen"
    },
    recentImages: {
      title: "Aktuelle Bilder",
      noScheduled: "Keine geplanten Bilder",
      year: "Jahr {year}"
    }
  },
  images: {
    title: "Bildverwaltung", 
    subtitle: "Tägliche Bilder hochladen, planen und verwalten",
    upload: {
      title: "Neues Bild hochladen",
      subtitle: "Ein neues Bild zur Sammlung hinzufügen",
      button: "Neues Bild hochladen"
    },
    scheduled: {
      title: "Geplante Bilder ({count})",
      subtitle: "Für bestimmte Daten geplante Bilder",
      noImages: "Keine geplanten Bilder",
      today: "Heute",
      past: "Vergangenheit",
      year: "Jahr: {year}",
      games: "Spiele: {count}",
      setToday: "Als heute festlegen"
    },
    unscheduled: {
      title: "Ungeplante Bilder ({count})",
      subtitle: "Noch nicht für ein Datum geplante Bilder",
      noImages: "Keine ungeplanten Bilder",
      year: "Jahr: {year}",
      setToday: "Als heute festlegen"
    },
    bulk: {
      title: "Mehrere zufällige Bilder planen",
      subtitle: "Automatisch zufällige Bilder für mehrere Tage planen",
      startDate: "Startdatum",
      days: "Anzahl Tage",
      button: "Massenplanung ({count} verfügbar)",
      success: "{count} Bilder geplant"
    },
    tabs: {
      upload: "Hochladen",
      scheduled: "Geplant", 
      unscheduled: "Ungeplant",
      bulk: "Massenaktionen"
    }
  },
  forms: {
    upload: {
      title: "Neues Bild hochladen",
      subtitle: "Ein neues Bild zur täglichen Sammlung hinzufügen",
      cloudinaryUrl: {
        label: "Cloudinary URL",
        placeholder: "https://res.cloudinary.com/...",
        description: "Die URL des Bildes aus Ihrem Cloudinary-Konto",
        error: "Bitte geben Sie eine gültige URL ein"
      },
      year: {
        label: "Jahr",
        description: "Das Jahr, in dem dieses Foto aufgenommen wurde",
        minError: "Jahr muss nach 1800 liegen",
        maxError: "Jahr kann nicht in der Zukunft liegen"
      },
      description: {
        label: "Beschreibung (Optional)",
        placeholder: "Kurze Beschreibung des Bildes...",
        description: "Eine kurze Beschreibung des Bildinhalts"
      },
      button: "Bild hochladen",
      success: "Bild erfolgreich hochgeladen",
      error: "Fehler beim Hochladen des Bildes"
    },
    edit: {
      title: "Bild bearbeiten",
      subtitle: "Bilddetails und Planung aktualisieren", 
      date: {
        label: "Geplantes Datum",
        description: "Das Datum, an dem dieses Bild vorgestellt werden soll",
        error: "Ungültiges Datumsformat"
      },
      description: {
        label: "Beschreibung (Optional)",
        placeholder: "Kurze Beschreibung des Bildes...",
        description: "Eine kurze Beschreibung des Bildinhalts"
      },
      saveButton: "Änderungen speichern",
      deleteButton: "Bild löschen",
      deleteTitle: "Bild löschen",
      deleteDescription: "Sind Sie sicher, dass Sie dieses Bild löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      cancel: "Abbrechen",
      delete: "Löschen",
      updateSuccess: "Bild erfolgreich aktualisiert",
      updateError: "Fehler beim Aktualisieren des Bildes",
      deleteSuccess: "Bild erfolgreich gelöscht", 
      deleteError: "Fehler beim Löschen des Bildes",
      deleteBlocked: "Bild mit vorhandenem Spielfortschritt kann nicht gelöscht werden",
      year: "Jahr: {year}",
      gamesPlayed: "Gespielte Spiele: {count}"
    }
  },
  actions: {
    edit: "Bearbeiten",
    delete: "Löschen",
    schedule: "Planen",
    confirmDelete: "Sind Sie sicher, dass Sie dieses Bild löschen möchten?"
  }
} as const
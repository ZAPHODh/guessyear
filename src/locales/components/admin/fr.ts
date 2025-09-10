export default {
  dashboard: {
    title: "Tableau de Bord Admin",
    subtitle: "Gérer les images quotidiennes et le contenu du jeu",
    stats: {
      totalImages: "Total Images",
      scheduled: "Programmées", 
      unscheduled: "Non Programmées",
      gamesPlayed: "Parties Jouées"
    },
    todayImage: {
      title: "Image d'Aujourd'hui",
      subtitle: "Image actuelle pour le {date}",
      noImage: "Aucune image définie pour aujourd'hui",
      setRandom: "Définir une Image Aléatoire",
      chooseSpecific: "Choisir une Image Spécifique",
      year: "Année : {year}",
      gamesPlayed: "Parties jouées : {count}"
    },
    quickActions: {
      title: "Actions Rapides",
      uploadNew: "Télécharger une Nouvelle Image",
      scheduleImages: "Programmer les Images"
    },
    recentImages: {
      title: "Images Récentes",
      noScheduled: "Aucune image programmée",
      year: "Année {year}"
    }
  },
  images: {
    title: "Gestion des Images", 
    subtitle: "Télécharger, programmer et gérer les images quotidiennes",
    upload: {
      title: "Télécharger une Nouvelle Image",
      subtitle: "Ajouter une nouvelle image à la collection",
      button: "Télécharger une Nouvelle Image"
    },
    scheduled: {
      title: "Images Programmées ({count})",
      subtitle: "Images programmées pour des dates spécifiques",
      noImages: "Aucune image programmée",
      today: "Aujourd'hui",
      past: "Passé",
      year: "Année : {year}",
      games: "Parties : {count}",
      setToday: "Définir pour Aujourd'hui"
    },
    unscheduled: {
      title: "Images Non Programmées ({count})",
      subtitle: "Images pas encore programmées pour une date",
      noImages: "Aucune image non programmée",
      year: "Année : {year}",
      setToday: "Définir pour Aujourd'hui"
    },
    bulk: {
      title: "Programmation Automatique d'Images Aléatoires",
      subtitle: "Programmer automatiquement des images aléatoires pour plusieurs jours",
      startDate: "Date de Début",
      days: "Nombre de Jours",
      button: "Programmation Automatique ({count} disponibles)",
      success: "{count} images programmées"
    },
    tabs: {
      upload: "Télécharger",
      scheduled: "Programmées", 
      unscheduled: "Non Programmées",
      bulk: "Actions Groupées"
    }
  },
  forms: {
    upload: {
      title: "Télécharger une Nouvelle Image",
      subtitle: "Ajouter une nouvelle image à la collection quotidienne",
      cloudinaryUrl: {
        label: "URL Cloudinary",
        placeholder: "https://res.cloudinary.com/...",
        description: "L'URL de l'image depuis votre compte Cloudinary",
        error: "Veuillez entrer une URL valide"
      },
      year: {
        label: "Année",
        description: "L'année où cette photo a été prise",
        minError: "L'année doit être postérieure à 1800",
        maxError: "L'année ne peut pas être dans le futur"
      },
      description: {
        label: "Description (Optionnel)",
        placeholder: "Brève description de l'image...",
        description: "Une brève description du contenu de l'image"
      },
      tip: {
        label: "Conseil (Optionnel)",
        placeholder: "Conseil utile pour deviner l'année...",
        description: "Un indice pour aider les joueurs à deviner l'année correcte"
      },
      button: "Télécharger l'Image",
      success: "Image téléchargée avec succès",
      error: "Échec du téléchargement de l'image"
    },
    edit: {
      title: "Modifier l'Image",
      subtitle: "Mettre à jour les détails et la programmation de l'image", 
      date: {
        label: "Date Programmée",
        description: "La date à laquelle cette image doit être mise en vedette",
        error: "Format de date invalide"
      },
      description: {
        label: "Description (Optionnel)",
        placeholder: "Brève description de l'image...",
        description: "Une brève description du contenu de l'image"
      },
      tip: {
        label: "Conseil (Optionnel)",
        placeholder: "Conseil utile pour deviner l'année...",
        description: "Un indice pour aider les joueurs à deviner l'année correcte"
      },
      saveButton: "Sauvegarder les Modifications",
      deleteButton: "Supprimer l'Image",
      deleteTitle: "Supprimer l'Image",
      deleteDescription: "Êtes-vous sûr de vouloir supprimer cette image ? Cette action ne peut pas être annulée.",
      cancel: "Annuler",
      delete: "Supprimer",
      updateSuccess: "Image mise à jour avec succès",
      updateError: "Échec de la mise à jour de l'image",
      deleteSuccess: "Image supprimée avec succès", 
      deleteError: "Échec de la suppression de l'image",
      deleteBlocked: "Impossible de supprimer l'image avec un progrès de jeu existant",
      year: "Année : {year}",
      gamesPlayed: "Parties jouées : {count}"
    }
  },
  multiLanguage: {
    languages: {
      english: "Anglais",
      portuguese: "Portugais", 
      french: "Français",
      spanish: "Espagnol",
      german: "Allemand",
      italian: "Italien"
    },
    languagesCount: "langues"
  },
  actions: {
    edit: "Modifier",
    delete: "Supprimer",
    schedule: "Programmer",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette image ?"
  }
} as const
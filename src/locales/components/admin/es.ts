export default {
  dashboard: {
    title: "Panel de Administración",
    subtitle: "Gestionar imágenes diarias y contenido del juego",
    stats: {
      totalImages: "Total de Imágenes",
      scheduled: "Programadas", 
      unscheduled: "No Programadas",
      gamesPlayed: "Juegos Jugados"
    },
    todayImage: {
      title: "Imagen de Hoy",
      subtitle: "Imagen actual para {date}",
      noImage: "No hay imagen establecida para hoy",
      setRandom: "Establecer Imagen Aleatoria",
      chooseSpecific: "Elegir Imagen Específica",
      year: "Año: {year}",
      gamesPlayed: "Juegos jugados: {count}"
    },
    quickActions: {
      title: "Acciones Rápidas",
      uploadNew: "Subir Nueva Imagen",
      scheduleImages: "Programar Imágenes"
    },
    recentImages: {
      title: "Imágenes Recientes",
      noScheduled: "No hay imágenes programadas",
      year: "Año {year}"
    }
  },
  images: {
    title: "Gestión de Imágenes", 
    subtitle: "Subir, programar y gestionar imágenes diarias",
    upload: {
      title: "Subir Nueva Imagen",
      subtitle: "Agregar una nueva imagen a la colección",
      button: "Subir Nueva Imagen"
    },
    scheduled: {
      title: "Imágenes Programadas ({count})",
      subtitle: "Imágenes programadas para fechas específicas",
      noImages: "No hay imágenes programadas",
      today: "Hoy",
      past: "Pasado",
      year: "Año: {year}",
      games: "Juegos: {count}",
      setToday: "Establecer como Hoy"
    },
    unscheduled: {
      title: "Imágenes No Programadas ({count})",
      subtitle: "Imágenes aún no programadas para ninguna fecha",
      noImages: "No hay imágenes sin programar",
      year: "Año: {year}",
      setToday: "Establecer como Hoy"
    },
    bulk: {
      title: "Programar Imágenes Aleatorias en Lote",
      subtitle: "Programar automáticamente imágenes aleatorias para múltiples días",
      startDate: "Fecha de Inicio",
      days: "Número de Días",
      button: "Programar en Lote ({count} disponibles)",
      success: "Programadas {count} imágenes"
    },
    tabs: {
      upload: "Subir",
      scheduled: "Programadas", 
      unscheduled: "No Programadas",
      bulk: "Acciones en Lote"
    }
  },
  forms: {
    upload: {
      title: "Subir Nueva Imagen",
      subtitle: "Agregar una nueva imagen a la colección diaria",
      cloudinaryUrl: {
        label: "URL de Cloudinary",
        placeholder: "https://res.cloudinary.com/...",
        description: "La URL de la imagen desde tu cuenta de Cloudinary",
        error: "Por favor ingresa una URL válida"
      },
      year: {
        label: "Año",
        description: "El año en que se tomó esta foto",
        minError: "El año debe ser posterior a 1800",
        maxError: "El año no puede ser futuro"
      },
      description: {
        label: "Descripción (Opcional)",
        placeholder: "Breve descripción de la imagen...",
        description: "Una breve descripción del contenido de la imagen"
      },
      button: "Subir Imagen",
      success: "Imagen subida exitosamente",
      error: "Error al subir imagen"
    },
    edit: {
      title: "Editar Imagen",
      subtitle: "Actualizar detalles de imagen y programación", 
      date: {
        label: "Fecha Programada",
        description: "La fecha en que esta imagen debe aparecer",
        error: "Formato de fecha inválido"
      },
      description: {
        label: "Descripción (Opcional)",
        placeholder: "Breve descripción de la imagen...",
        description: "Una breve descripción del contenido de la imagen"
      },
      saveButton: "Guardar Cambios",
      deleteButton: "Eliminar Imagen",
      deleteTitle: "Eliminar Imagen",
      deleteDescription: "¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      delete: "Eliminar",
      updateSuccess: "Imagen actualizada exitosamente",
      updateError: "Error al actualizar imagen",
      deleteSuccess: "Imagen eliminada exitosamente", 
      deleteError: "Error al eliminar imagen",
      deleteBlocked: "No se puede eliminar imagen con progreso de juego existente",
      year: "Año: {year}",
      gamesPlayed: "Juegos jugados: {count}"
    }
  },
  actions: {
    edit: "Editar",
    delete: "Eliminar",
    schedule: "Programar",
    confirmDelete: "¿Estás seguro de que quieres eliminar esta imagen?"
  }
} as const
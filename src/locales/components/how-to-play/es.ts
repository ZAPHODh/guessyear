export default {
  title: "Cómo Jugar",
  subtitle: "¡Aprende cómo dominar el juego diario de adivinar imágenes!",
  objective: {
    title: "Objetivo",
    description: "Adivina el año en que se tomó una fotografía. ¡Tienes 5 intentos para acertar!"
  },
  howItWorks: {
    title: "Cómo Funciona",
    step1: "Observa cuidadosamente la fotografía en busca de pistas sobre la época.",
    step2: "Ingresa tu suposición del año en que se tomó la foto.",
    step3: "Obtén retroalimentación: 'Más alto' si el año real es posterior, 'Más bajo' si es anterior.",
    step4: "Usa la retroalimentación para afinar tu siguiente suposición. ¡El rango válido se ajustará automáticamente!"
  },
  smartRange: {
    title: "Sistema de Rango Inteligente",
    description: "Después de cada suposición, el juego reduce inteligentemente los años posibles para ayudarte:",
    example: {
      title: "Ejemplo",
      step1: "Adivinas 1950, la respuesta es 'Más alto' → Nuevo rango: 1951-2025",
      step2: "Adivinas 1980, la respuesta es 'Más bajo' → Nuevo rango: 1951-1979",
      step3: "Adivinas 1965, la respuesta es '¡Correcto!' → ¡Ganaste!"
    }
  },
  tips: {
    title: "Consejos",
    tip1: "Busca estilos de ropa, arquitectura, automóviles y tecnología en la foto",
    tip2: "Comienza con una suposición de rango medio para reducir rápidamente las posibilidades",
    tip3: "Presta atención a la calidad de la foto: las fotos más antiguas tienden a ser en blanco y negro o sepia"
  },
  readyToPlay: "¡Listo para jugar!"
} as const
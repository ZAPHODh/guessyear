import { success } from "zod";

export default {
  title: "Usamos cookies",
  description: "Usamos cookies esenciales para hacer que nuestro sitio funcione. También nos gustaría establecer cookies opcionales para ayudarnos a mejorar nuestro sitio web y analizar patrones de uso.",
  required: "Requeridas",
  weUse: "Usamos cookies para mejorar tu experiencia.",
  learnMore: "Saber más",
  privacyPolicy: "Política de Privacidad",

  acceptAll: "Aceptar Todo",
  rejectAll: "Rechazar Todo",
  customize: "Personalizar",
  savePreferences: "Guardar Preferencias",
  cancel: "Cancelar",
  back: "Volver",


  toast: {
    failed: "Error al guardar preferencias de cookies",
    success: "Preferencias de cookies guardadas exitosamente"
  },

  essential: {
    title: "Cookies Esenciales",
    description: "Estas cookies son necesarias para el funcionamiento del sitio web y no se pueden desactivar. Normalmente solo se establecen en respuesta a acciones realizadas por ti que equivalen a una solicitud de servicios.",
    required: "Siempre Activas"
  },

  performance: {
    title: "Cookies de Rendimiento",
    description: "Estas cookies nos permiten contar visitas y fuentes de tráfico para que podamos medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a entender cómo los visitantes usan nuestro sitio web."
  },

  functional: {
    title: "Cookies Funcionales",
    description: "Estas cookies permiten al sitio web proporcionar funcionalidad mejorada y personalización. Pueden ser establecidas por nosotros o por proveedores terceros cuyos servicios hemos añadido a nuestras páginas."
  },

  marketing: {
    title: "Cookies de Marketing",
    description: "Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Pueden ser utilizadas por esas empresas para construir un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios."
  },

  compliance: {
    gdpr: "🇪🇺 Cumple con GDPR - Tienes el derecho de controlar tus datos",
    ccpa: "🇺🇸 Cumple con CCPA - Los residentes de California pueden optar por no vender sus datos",
    lgpd: "🇧🇷 Cumple con LGPD - Tus datos están protegidos bajo la ley brasileña"
  },

  settings: {
    title: "Preferencias de Cookies",
    description: "Gestiona tus preferencias de cookies. Puedes habilitar o deshabilitar diferentes tipos de cookies abajo. Ten en cuenta que deshabilitar algunos tipos de cookies puede impactar tu experiencia del sitio y los servicios que podemos ofrecer."
  },

  legal: {
    dataController: "Controlador de Datos",
    retention: "Mantenemos el consentimiento de cookies por 12 meses",
    withdraw: "Puedes retirar tu consentimiento en cualquier momento visitando esta página de configuración",
    contact: "Para preguntas sobre cookies, contáctanos en",
    rights: "Bajo GDPR, LGPD y CCPA, tienes derechos incluyendo acceso, rectificación, eliminación y portabilidad de datos"
  }
} as const;
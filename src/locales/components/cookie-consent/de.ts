import { success } from "zod";

export default {
  title: "Wir verwenden Cookies",
  description: "Wir verwenden wichtige Cookies, damit unsere Website funktioniert. Wir möchten auch optionale Cookies setzen, um unsere Website zu verbessern und Nutzungsmuster zu analysieren.",
  required: "Erforderlich",
  weUse: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.",
  learnMore: "Mehr erfahren",
  privacyPolicy: "Datenschutzerklärung",

  acceptAll: "Alle akzeptieren",
  rejectAll: "Alle ablehnen",
  customize: "Anpassen",
  savePreferences: "Einstellungen speichern",
  cancel: "Abbrechen",
  back: "Zurück",


  toast: {
    failed: "Fehler beim Speichern der Cookie-Einstellungen",
    success: "Cookie-Einstellungen erfolgreich gespeichert"
  },

  essential: {
    title: "Wichtige Cookies",
    description: "Diese Cookies sind für das Funktionieren der Website notwendig und können nicht deaktiviert werden. Sie werden normalerweise nur als Reaktion auf Aktionen gesetzt, die Sie durchführen und die einer Anfrage für Dienste entsprechen.",
    required: "Immer aktiv"
  },

  performance: {
    title: "Leistungs-Cookies",
    description: "Diese Cookies ermöglichen es uns, Besuche und Verkehrsquellen zu zählen, damit wir die Leistung unserer Website messen und verbessern können. Sie helfen uns zu verstehen, wie Besucher unsere Website nutzen."
  },

  functional: {
    title: "Funktionale Cookies",
    description: "Diese Cookies ermöglichen es der Website, erweiterte Funktionalität und Personalisierung zu bieten. Sie können von uns oder von Drittanbietern gesetzt werden, deren Dienste wir zu unseren Seiten hinzugefügt haben."
  },

  marketing: {
    title: "Marketing-Cookies",
    description: "Diese Cookies können über unsere Website von unseren Werbepartnern gesetzt werden. Sie können von diesen Unternehmen verwendet werden, um ein Profil Ihrer Interessen zu erstellen und Ihnen relevante Werbung auf anderen Websites zu zeigen."
  },

  compliance: {
    gdpr: "🇪🇺 DSGVO-konform - Sie haben das Recht, Ihre Daten zu kontrollieren",
    ccpa: "🇺🇸 CCPA-konform - Kalifornische Einwohner können sich vom Datenverkauf abmelden",
    lgpd: "🇧🇷 LGPD-konform - Ihre Daten sind unter brasilianischem Recht geschützt"
  },

  settings: {
    title: "Cookie-Einstellungen",
    description: "Verwalten Sie Ihre Cookie-Einstellungen. Sie können verschiedene Arten von Cookies unten aktivieren oder deaktivieren. Beachten Sie, dass die Deaktivierung einiger Cookie-Arten Ihre Erfahrung mit der Website und die Dienste, die wir anbieten können, beeinträchtigen kann."
  },

  legal: {
    dataController: "Datenverantwortlicher",
    retention: "Wir speichern die Cookie-Einverständnis für 12 Monate",
    withdraw: "Sie können Ihr Einverständnis jederzeit widerrufen, indem Sie diese Einstellungsseite besuchen",
    contact: "Für Fragen zu Cookies kontaktieren Sie uns unter",
    rights: "Unter DSGVO, LGPD und CCPA haben Sie Rechte einschließlich Zugang, Berichtigung, Löschung und Datenübertragbarkeit"
  }
} as const;
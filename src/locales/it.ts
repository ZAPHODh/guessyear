import header from './components/header/it';
import auth from './components/auth/it';
import shared from './components/shared/it';
import emails from './components/emails/it';
import footer from './components/footer/it';
import terms from './components/terms/it';
import privacy from './components/privacy/it';
import contact from './components/contact/it';
import help from './components/help/it';
import daily from './components/daily/it';
import lobby from './components/lobby/it';
import cookieConsent from './components/cookie-consent/it';
import howToPlay from './components/how-to-play/it';
import admin from './components/admin/it';
import settings from './components/settings/it';

export default {
    header,
    auth,
    shared,
    emails,
    footer,
    terms,
    privacy,
    contact,
    help,
    daily,
    lobby,
    cookieConsent,
    howToPlay,
    admin,
    settings,
    metadata: {
        keywords: [
            "Loqano",
            "Gioco di Datazione Foto", 
            "Gioco Anno Immagine",
            "Foto d'Epoca",
            "Immagini Storiche",
            "Quiz Fotografico",
            "Sfida Fotografica",
            "Datazione Immagini",
            "Gioco Foto Storiche",
            "Quiz Anno Immagine",
        ],
        daily: {
            title: "Sfida Foto Giornaliera - Loqano",
            description: "Gioca alla sfida fotografica giornaliera di oggi su Loqano! Guarda un'immagine d'epoca e indovina in quale anno è stata scattata. Nuova sfida ogni giorno con foto storiche da tutto il mondo."
        }
    }
} as const
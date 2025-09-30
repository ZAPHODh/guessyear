import header from './components/header/de';
import auth from './components/auth/de';
import shared from './components/shared/de';
import emails from './components/emails/de';
import footer from './components/footer/de';
import terms from './components/terms/de';
import privacy from './components/privacy/de';
import contact from './components/contact/de';
import help from './components/help/de';
import daily from './components/daily/de';
import lobby from './components/lobby/de';
import cookieConsent from './components/cookie-consent/de';
import howToPlay from './components/how-to-play/de';
import admin from './components/admin/de';

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
    metadata: {
        keywords: [
            "Loqano",
            "Foto-Dating-Spiel", 
            "Bild-Jahr-Spiel",
            "Vintage-Fotos",
            "Historische Bilder",
            "Foto-Quiz",
            "Foto-Herausforderung",
            "Bild-Dating",
            "Historisches Foto-Spiel",
            "Bild-Jahr-Quiz",
        ],
        daily: {
            title: "Tägliche Foto-Herausforderung - Loqano",
            description: "Spielen Sie die heutige tägliche Foto-Herausforderung auf Loqano! Betrachten Sie ein Vintage-Bild und erraten Sie, in welchem Jahr es aufgenommen wurde. Jeden Tag neue Herausforderung mit historischen Fotos aus aller Welt."
        }
    }
} as const
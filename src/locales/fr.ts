import header from './components/header/fr';
import auth from './components/auth/fr';
import shared from './components/shared/fr';
import emails from './components/emails/fr';
import footer from './components/footer/fr';
import terms from './components/terms/fr';
import privacy from './components/privacy/fr';
import contact from './components/contact/fr';
import help from './components/help/fr';
import daily from './components/daily/fr';
import cookieConsent from './components/cookie-consent/fr';
import howToPlay from './components/how-to-play/fr';

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
    cookieConsent,
    howToPlay,
    metadata: {
        keywords: [
            "Loqano",
            "Jeu de Datation de Photos", 
            "Jeu d'Année d'Image",
            "Photos Vintage",
            "Images Historiques",
            "Quiz de Photos",
            "Défi Photo",
            "Datation d'Images",
            "Jeu de Photos Historiques",
            "Quiz d'Année de Photo",
        ],
        daily: {
            title: "Défi Photo Quotidien - Loqano",
            description: "Jouez au défi photo quotidien d'aujourd'hui sur Loqano ! Regardez une image vintage et devinez en quelle année elle a été prise. Nouveau défi chaque jour avec des photos historiques du monde entier."
        }
    }
} as const
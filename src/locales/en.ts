import header from './components/header/en';
import auth from './components/auth/en';
import shared from './components/shared/en';
import emails from './components/emails/en';
import footer from './components/footer/en';
import terms from './components/terms/en';
import privacy from './components/privacy/en';
import contact from './components/contact/en';
import help from './components/help/en';
import daily from './components/daily/en';
import lobby from './components/lobby/en';
import cookieConsent from './components/cookie-consent/en';
import howToPlay from './components/how-to-play/en';
import admin from './components/admin/en';
import settings from './components/settings/en';
import profileDialog from './components/profile-dialog/en';
import profile from './components/profile/en';

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
    profileDialog,
    profile,
    metadata: {
        keywords: [
            "Loqano",
            "Photo Dating Game", 
            "Image Year Game",
            "Vintage Photos",
            "Historical Images",
            "Photo Quiz",
            "Year Dating Game",
            "Photo Challenge",
            "Image Dating",
            "Historical Photo Game",
            "Picture Year Quiz",
        ],
        daily: {
            title: "Daily Photo Challenge - Loqano",
            description: "Play today's daily photo challenge on Loqano! Look at a vintage image and guess what year it was taken. New challenge every day with historical photos from around the world."
        }
    }
} as const
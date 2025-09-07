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
import cookieConsent from './components/cookie-consent/en';
import howToPlay from './components/how-to-play/en';

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
            "Guess the Year",
            "Photo Dating Game", 
            "Image Year Game",
            "Vintage Photos",
            "Historical Images",
            "Photo Quiz",
            "Year Guessing Game",
            "Photo Challenge",
            "Image Dating",
            "Historical Photo Game",
            "Picture Year Quiz",
        ],
        daily: {
            title: "Daily Photo Challenge - Guess the Year",
            description: "Play today's daily photo challenge! Look at a vintage image and guess what year it was taken. New challenge every day with historical photos from around the world."
        }
    }
} as const
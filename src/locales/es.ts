import header from './components/header/es';
import auth from './components/auth/es';
import shared from './components/shared/es';
import emails from './components/emails/es';
import footer from './components/footer/es';
import terms from './components/terms/es';
import privacy from './components/privacy/es';
import contact from './components/contact/es';
import help from './components/help/es';
import daily from './components/daily/es';
import lobby from './components/lobby/es';
import cookieConsent from './components/cookie-consent/es';
import howToPlay from './components/how-to-play/es';
import admin from './components/admin/es';
import settings from './components/settings/es';
import profileDialog from './components/profile-dialog/es';
import profile from './components/profile/es';

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
            "Juego de Fechar Fotos", 
            "Juego de Año de Imagen",
            "Fotos Vintage",
            "Imágenes Históricas",
            "Quiz de Fotos",
            "Desafío de Fotos",
            "Datación de Imágenes",
            "Juego de Fotos Históricas",
            "Quiz de Año de Fotos",
        ],
        daily: {
            title: "Desafío Diario de Fotos - Loqano",
            description: "¡Juega el desafío diario de fotos de hoy en Loqano! Mira una imagen vintage y adivina en qué año fue tomada. Nuevo desafío todos los días con fotos históricas de todo el mundo."
        }
    }
} as const
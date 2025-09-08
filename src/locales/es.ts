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
import cookieConsent from './components/cookie-consent/es';
import howToPlay from './components/how-to-play/es';
import admin from './components/admin/es';

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
    admin,
    metadata: {
        keywords: [
            "Adivina el Año",
            "Juego de Fechar Fotos", 
            "Juego de Año de Imagen",
            "Fotos Vintage",
            "Imágenes Históricas",
            "Quiz de Fotos",
            "Juego de Adivinar Año",
            "Desafío de Fotos",
            "Datación de Imágenes",
            "Juego de Fotos Históricas",
            "Quiz de Año de Fotos",
        ],
        daily: {
            title: "Desafío Diario de Fotos - Adivina el Año",
            description: "¡Juega el desafío diario de fotos de hoy! Mira una imagen vintage y adivina en qué año fue tomada. Nuevo desafío todos los días con fotos históricas de todo el mundo."
        }
    }
} as const
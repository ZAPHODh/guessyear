import auth from './components/auth/pt';
import header from './components/header/pt';
import shared from './components/shared/pt';
import emails from './components/emails/pt';
import footer from './components/footer/pt';
import terms from './components/terms/pt';
import privacy from './components/privacy/pt';
import contact from './components/contact/pt';
import help from './components/help/pt';
import daily from './components/daily/pt';
import lobby from './components/lobby/pt';
import cookieConsent from './components/cookie-consent/pt';
import howToPlay from './components/how-to-play/pt';
import admin from './components/admin/pt';
import settings from './components/settings/pt';

export default {
    header,
    auth,
    emails,
    shared,
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
            "Jogo de Datar Fotos",
            "Jogo do Ano da Imagem",
            "Fotos Vintage",
            "Imagens Históricas",
            "Quiz de Fotos",
            "Jogo de Datar Ano",
            "Desafio de Fotos",
            "Datação de Imagens",
            "Jogo de Fotos Históricas",
            "Quiz do Ano da Foto",
        ],
        daily: {
            title: "Desafio Diário de Fotos - Loqano",
            description: "Jogue o desafio diário no Loqano! Veja uma imagem vintage e adivinhe em que ano foi tirada. Novo desafio todos os dias com fotos históricas de todo o mundo."
        }
    }
} as const
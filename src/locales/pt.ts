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
import cookieConsent from './components/cookie-consent/pt';

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
    cookieConsent,
    metadata: {
        keywords: [
            "Adivinhe o Ano",
            "Jogo de Datar Fotos",
            "Jogo do Ano da Imagem",
            "Fotos Vintage",
            "Imagens Históricas",
            "Quiz de Fotos",
            "Jogo de Adivinhar Ano",
            "Desafio de Fotos",
            "Datação de Imagens",
            "Jogo de Fotos Históricas",
            "Quiz do Ano da Foto",
        ],
        daily: {
            title: "Desafio Diário de Fotos - Adivinhe o Ano",
            description: "Jogue o desafio diário de hoje! Veja uma imagem vintage e adivinhe em que ano foi tirada. Novo desafio todos os dias com fotos históricas de todo o mundo."
        }
    }
} as const
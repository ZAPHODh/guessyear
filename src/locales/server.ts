import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
    createI18nServer({
        en: () => import("./en"),
        pt: () => import("./pt"),
        fr: () => import("./fr"),
        es: () => import("./es"),
        de: () => import("./de"),
        it: () => import("./it"),
    });
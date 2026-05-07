import { SCRIPTS, type PaliScript } from "pali_script_convertor"

export const LANGUAGE = {
    en: "en",
    zh: "zh",
    bo: "bo",

}

export const SCRIPT_LABELS: Record<PaliScript, string> = {
    [SCRIPTS.RO]: "Roman",
    [SCRIPTS.SI]: "Sinhala",
    [SCRIPTS.HI]: "Devanagari",
    [SCRIPTS.THAI]: "Thai",
    [SCRIPTS.LAOS]: "Laos",
    [SCRIPTS.MY]: "Myanmar",
    [SCRIPTS.KM]: "Khmer",
    [SCRIPTS.BENG]: "Bengali",
    [SCRIPTS.ASSE]: "Assamese",
    [SCRIPTS.GURM]: "Gurmukhi",
    [SCRIPTS.THAM]: "Tai Tham",
    [SCRIPTS.GUJA]: "Gujarati",
    [SCRIPTS.TELU]: "Telugu",
    [SCRIPTS.KANN]: "Kannada",
    [SCRIPTS.MALA]: "Malayalam",
    [SCRIPTS.BRAH]: "Brahmi",
    [SCRIPTS.TIBT]: "Tibetan",
    [SCRIPTS.CYRL]: "Cyrillic",
}


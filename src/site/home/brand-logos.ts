/**
 * Vehicle-make logos for the homepage brand grid, matched against a facet
 * value's code/name — so "Porsche Cayenne" or "mercedes-benz" resolve without
 * any facet value IDs being hardcoded. SVGs live in /public/brands and come
 * from Simple Icons (CC0, https://simpleicons.org); trademarks belong to their
 * owners and are shown only to identify compatible vehicles.
 *
 * `color` is the brand hex from Simple Icons; omitted where it's near-black or
 * near-white, so the logo falls back to the current text color and stays
 * visible in both themes.
 */
interface BrandLogo {
    file: string;
    color?: string;
}

const LOGOS: Record<string, BrandLogo> = {
    audi: {file: 'audi', color: '#BB0A30'},
    bmw: {file: 'bmw', color: '#0066B1'},
    chevrolet: {file: 'chevrolet', color: '#CD9834'},
    citroen: {file: 'citroen'},
    fiat: {file: 'fiat', color: '#941711'},
    ford: {file: 'ford', color: '#00274E'},
    honda: {file: 'honda', color: '#E40521'},
    hyundai: {file: 'hyundai', color: '#002C5E'},
    jaguar: {file: 'jaguar'},
    jeep: {file: 'jeep'},
    kia: {file: 'kia'},
    landrover: {file: 'landrover', color: '#005A2B'},
    mahindra: {file: 'mahindra', color: '#DD052B'},
    mazda: {file: 'mazda'},
    mercedes: {file: 'mercedes'},
    mg: {file: 'mg', color: '#FF0000'},
    mini: {file: 'mini'},
    nissan: {file: 'nissan', color: '#C3002F'},
    peugeot: {file: 'peugeot'},
    porsche: {file: 'porsche', color: '#B12B28'},
    renault: {file: 'renault', color: '#FFCC33'},
    skoda: {file: 'skoda', color: '#4BA82E'},
    subaru: {file: 'subaru', color: '#013C74'},
    suzuki: {file: 'suzuki', color: '#E30613'},
    tata: {file: 'tata', color: '#486AAE'},
    tesla: {file: 'tesla', color: '#CC0000'},
    toyota: {file: 'toyota', color: '#EB0A1E'},
    volkswagen: {file: 'volkswagen', color: '#151F5D'},
    volvo: {file: 'volvo', color: '#003057'},
};

/** Alternate spellings → LOGOS key. Matched as prefixes of the normalized name. */
const ALIASES: Record<string, string> = {
    mercedesbenz: 'mercedes',
    benz: 'mercedes',
    vw: 'volkswagen',
    rangerover: 'landrover',
    marutisuzuki: 'suzuki',
    maruti: 'suzuki',
};

const normalize = (value: string) =>
    value.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');

// Longest keys first so e.g. "marutisuzuki" wins over "maruti".
const KEYS = [...Object.keys(ALIASES), ...Object.keys(LOGOS)].sort((a, b) => b.length - a.length);

export function getBrandLogo(...candidates: string[]): (BrandLogo & {src: string}) | undefined {
    for (const candidate of candidates) {
        const name = normalize(candidate);
        const key = KEYS.find((k) => name.startsWith(k));
        if (!key) continue;
        const logo = LOGOS[ALIASES[key] ?? key];
        return {...logo, src: `/brands/${logo.file}.svg`};
    }
    return undefined;
}

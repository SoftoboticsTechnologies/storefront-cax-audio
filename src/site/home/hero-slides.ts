/**
 * Homepage hero banners (public/hero/*.webp, 1920x649 with the headline baked
 * into the artwork; made from the source PNGs next to them). A make's slide
 * links to the collection whose slug matches `match` — resolved at build
 * time, no IDs hardcoded — or falls back to a keyword search when the store
 * has no such collection yet. A slide without `match` links to the catalog.
 */
export interface HeroSlideConfig {
    key: 'brand' | 'bmw' | 'mercedes' | 'audi' | 'porsche';
    image: string;
    match?: RegExp;
    searchTerm?: string;
}

export const HERO_SLIDES: HeroSlideConfig[] = [
    {key: 'brand', image: '/hero/cax-audio.webp'},
    {key: 'bmw', image: '/hero/bmw.webp', match: /^bmw$/, searchTerm: 'BMW'},
    {key: 'mercedes', image: '/hero/mercedes.webp', match: /^mercedes-benz$/, searchTerm: 'Mercedes'},
    {key: 'audi', image: '/hero/audi.webp', match: /^audi$/, searchTerm: 'Audi'},
    {key: 'porsche', image: '/hero/porsche.webp', match: /^porsche$/, searchTerm: 'Porsche'},
];

export const HERO_IMAGE_WIDTH = 1920;
export const HERO_IMAGE_HEIGHT = 649;

export function resolveHeroSlideHref(slide: HeroSlideConfig, collectionSlugs: string[]): string {
    const {match, searchTerm} = slide;
    if (!match) return '/search';
    const slug = collectionSlugs.find((s) => match.test(s));
    if (slug) return `/collection/${slug}`;
    return searchTerm ? `/search?q=${encodeURIComponent(searchTerm)}` : '/search';
}

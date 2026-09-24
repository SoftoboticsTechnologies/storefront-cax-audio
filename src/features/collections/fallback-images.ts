/**
 * Fallback collection images (homepage category tiles, collection page hero),
 * used only when a collection has no featured asset in Vendure (upload one
 * there and it wins).
 * Matched on slug keywords — no collection IDs hardcoded — so a renamed or
 * re-created collection keeps its image. Photos are from Wikimedia Commons
 * (CC BY-SA); attribution in /public/categories/CREDITS.txt.
 */
const FALLBACKS: {match: RegExp; file: string}[] = [
    {match: /bmw-1/, file: 'bmw-1-series'},
    {match: /a-class/, file: 'mercedes-a-class'},
    {match: /in-dash|av-player/, file: 'in-dash-head-unit'},
    {match: /electronic/, file: 'car-electronics'},
    {match: /accessor|parts/, file: 'parts-accessories'},
];

export function getCategoryFallbackImage(slug: string): string | undefined {
    const hit = FALLBACKS.find(({match}) => match.test(slug.toLowerCase()));
    return hit && `/categories/${hit.file}.jpg`;
}

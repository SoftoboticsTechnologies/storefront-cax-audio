/**
 * Facet (by code) that powers the homepage vehicle finder and brand grid.
 * Both sections hide themselves when the channel has no facet with this code.
 */
export const HOME_BRAND_FACET_CODE = process.env.NEXT_PUBLIC_HOME_BRAND_FACET_CODE || 'vehicle-brand';

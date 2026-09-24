import {query} from '@/platform/vendure/api';
import {CatalogFacetValuesQuery, FacetByCodeQuery} from './graphql';

export interface CatalogFacet {
    id: string;
    name: string;
    /** All of the facet's values, including those with `count: 0`. */
    values: Array<{id: string; name: string; code: string; count: number}>;
}

/**
 * One facet (looked up by its code, e.g. "vehicle-brand") with every value
 * and its current product count, sorted by count. Returns undefined when the
 * channel has no such facet, so callers can simply not render.
 */
export async function getCatalogFacet(locale: string, facetCode: string): Promise<CatalogFacet | undefined> {
    const [facetResult, countsResult] = await Promise.all([
        query(FacetByCodeQuery, {code: facetCode}, {languageCode: locale}),
        query(CatalogFacetValuesQuery, {}, {languageCode: locale}),
    ]);

    const facet = facetResult.data.facets.items[0];
    if (!facet) return undefined;

    const counts = new Map(
        countsResult.data.search.facetValues.map(({count, facetValue}) => [facetValue.id, count]),
    );

    return {
        id: facet.id,
        name: facet.name,
        values: facet.values
            .map((value) => ({id: value.id, name: value.name, code: value.code, count: counts.get(value.id) ?? 0}))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    };
}

/** URL value for the `facets` search param understood by buildSearchInput. */
export function facetParam(facetId: string, facetValueId: string) {
    return `${facetId}:${facetValueId}`;
}

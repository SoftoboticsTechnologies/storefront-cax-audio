import {query} from '@/platform/vendure/api';
import {ResultOf} from '@/platform/vendure/graphql';
import {GetTopCollectionsQuery} from './graphql';

// Page size used while enumerating the full catalog at build time.
const COLLECTION_PAGE_SIZE = 100;

type TopCollection = ResultOf<typeof GetTopCollectionsQuery>['collections']['items'][number];

/**
 * Every top-level (and child) collection in the catalog, used to prerender
 * collection pages at build time. Static export has no on-demand fallback for
 * a slug that wasn't prerendered, so this must enumerate the full catalog
 * (paginated) rather than relying on a single unpaginated request.
 */
export async function getTopCollections(locale: string): Promise<TopCollection[]> {
    const items: TopCollection[] = [];
    let skip = 0;

    for (;;) {
        const result = await query(GetTopCollectionsQuery, {
            take: COLLECTION_PAGE_SIZE,
            skip,
        }, {languageCode: locale});

        const page = result.data.collections.items;
        items.push(...page);

        if (page.length < COLLECTION_PAGE_SIZE || items.length >= result.data.collections.totalItems) {
            break;
        }
        skip += COLLECTION_PAGE_SIZE;
    }

    return items;
}

/**
 * Top-level collections only, derived from getTopCollections (which returns
 * every collection, children included): a collection is a root when it isn't
 * listed as another collection's child. Used for navigation, where the flat
 * list would repeat children that already appear in their parent's dropdown.
 */
export async function getRootCollections(locale: string): Promise<TopCollection[]> {
    const collections = await getTopCollections(locale);
    const childIds = new Set(collections.flatMap((c) => (c.children ?? []).map((child) => child.id)));
    const roots = collections.filter((c) => !childIds.has(c.id));
    // Guard against a cyclic/odd tree leaving nothing to show.
    return roots.length > 0 ? roots : collections;
}

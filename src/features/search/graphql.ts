import {graphql} from '@/platform/vendure/graphql';
import {ProductCardFragment} from '@/features/products/graphql';

export const SearchProductsQuery = graphql(`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                ...ProductCard
            }
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    }
`, [ProductCardFragment]);

// Catalog-wide facet values (only those with at least one product), used by
// merchandising surfaces like the homepage vehicle finder/brand grid.
export const CatalogFacetValuesQuery = graphql(`
    query CatalogFacetValues {
        search(input: {take: 0, groupByProduct: true}) {
            totalItems
            facetValues {
                count
                facetValue {
                    id
                    name
                    facet {
                        id
                        name
                        code
                    }
                }
            }
        }
    }
`);

// Every value of one facet, including values no product uses yet (search
// facetValues above only returns values with products).
export const FacetByCodeQuery = graphql(`
    query FacetByCode($code: String!) {
        facets(options: {filter: {code: {eq: $code}}, take: 1}) {
            items {
                id
                name
                values {
                    id
                    name
                    code
                }
            }
        }
    }
`);

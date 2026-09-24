// Plain tree types/helpers with no Vendure imports, so client components
// (mobile nav) can use them without pulling the API layer into the bundle.

export interface CollectionNode {
    id: string;
    name: string;
    slug: string;
    children: CollectionNode[];
}

/** Depth-first list of a node's descendants with their depth (1 = direct child), for indented menus. */
export function flattenCollectionTree(nodes: CollectionNode[], depth = 1): {node: CollectionNode; depth: number}[] {
    return nodes.flatMap((node) => [{node, depth}, ...flattenCollectionTree(node.children, depth + 1)]);
}

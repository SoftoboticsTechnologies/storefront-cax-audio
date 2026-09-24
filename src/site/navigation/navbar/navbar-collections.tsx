import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {getCollectionTree} from '@/features/collections/data';
import {flattenCollectionTree} from '@/features/collections/collection-tree';
import {NavigationLink} from '@/site/navigation/navigation-link';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {NavbarLink} from '@/site/navigation/navbar/navbar-link';
import {cn} from '@/lib/utils';

const navItemClassName = 'h-10 px-3 text-[13px] font-semibold uppercase tracking-wide hover:text-primary';

/**
 * Top-level collections; one with children opens a dropdown listing its whole
 * subtree (mirrors the Vendure collection tree), deeper levels indented. The
 * trigger itself isn't a link, so the first entry links to the parent.
 */
export async function NavbarCollections() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Navigation'});

    const tree = await getCollectionTree(locale);

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {tree.map((collection) => {
                    if (collection.children.length === 0) {
                        return (
                            <NavigationMenuItem key={collection.slug}>
                                <NavbarLink href={`/collection/${collection.slug}`} prefetch={false} className={navItemClassName}>
                                    {collection.name}
                                </NavbarLink>
                            </NavigationMenuItem>
                        );
                    }

                    return (
                        <NavigationMenuItem key={collection.slug}>
                            <NavigationMenuTrigger className={`${navItemClassName} bg-transparent hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent data-open:bg-transparent data-popup-open:text-primary`}>
                                {collection.name}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-72 gap-0.5">
                                    <li>
                                        <NavigationMenuLink
                                            className="font-semibold"
                                            render={<NavigationLink href={`/collection/${collection.slug}`} prefetch={false} />}
                                        >
                                            {t('viewAllIn', {name: collection.name})}
                                        </NavigationMenuLink>
                                    </li>
                                    {flattenCollectionTree(collection.children).map(({node, depth}) => (
                                        <li key={node.slug}>
                                            <NavigationMenuLink
                                                className={cn(depth > 1 && 'text-muted-foreground')}
                                                style={{paddingLeft: `${0.5 + depth * 0.75}rem`}}
                                                render={<NavigationLink href={`/collection/${node.slug}`} prefetch={false} />}
                                            >
                                                {node.name}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

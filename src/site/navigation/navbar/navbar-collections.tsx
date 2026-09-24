import Image from 'next/image';
import {getRouteLocale} from '@/platform/i18n/server';
import {getRootCollections} from '@/features/collections/data';
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

const navItemClassName = 'h-10 px-3 text-[13px] font-semibold uppercase tracking-wide hover:text-primary';

export async function NavbarCollections() {
    const locale = await getRouteLocale();

    const collections = await getRootCollections(locale);

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {collections.map((collection) => {
                    const children = collection.children ?? [];
                    if (children.length === 0) {
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
                                <ul className="grid w-56 gap-1">
                                    {children.map((child) => (
                                        <li key={child.slug}>
                                            <NavigationMenuLink
                                                render={
                                                    <NavigationLink href={`/collection/${child.slug}`} prefetch={false} />
                                                }
                                            >
                                                {child.featuredAsset?.preview && (
                                                    <Image
                                                        src={`${child.featuredAsset.preview}?preset=thumb`}
                                                        alt=""
                                                        width={32}
                                                        height={32}
                                                        className="rounded-sm object-cover"
                                                    />
                                                )}
                                                {child.name}
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

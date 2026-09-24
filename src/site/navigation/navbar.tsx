import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {LayoutGrid} from "lucide-react";
import {NavigationLink} from '@/site/navigation/navigation-link';
import {NavbarCollections} from '@/site/navigation/navbar/navbar-collections';
import {NavbarCart} from '@/site/navigation/navbar/navbar-cart';
import {NavbarUser} from '@/site/navigation/navbar/navbar-user';
import {MobileNavWrapper} from '@/site/navigation/navbar/mobile-nav-wrapper';
import {MobileSearch} from '@/site/navigation/navbar/mobile-search';
import {Suspense} from "react";
import {SearchInput} from '@/site/navigation/search-input';
import {NavbarUserSkeleton} from '@/site/navigation/skeletons/navbar-user-skeleton';
import {SearchInputSkeleton} from '@/site/navigation/skeletons/search-input-skeleton';
import {getRouteLocale} from "@/platform/i18n/server";
import {SITE_NAME} from "@/config/metadata";

export async function Navbar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Navigation'});

    // Only the category bar sticks. It's a sibling of <header> rather than a
    // child, since a sticky element can't outlive its parent's box.
    return (
        <>
        <header className="relative z-50 border-b bg-background">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 h-16 md:h-20">
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <Suspense>
                            <MobileNavWrapper />
                        </Suspense>
                        <NavigationLink href="/" className="shrink-0">
                            <Image src="/logo/cax%20audiologo.png" alt={SITE_NAME} width={1914} height={619} className="h-8 min-[360px]:h-9 sm:h-10 md:h-12 w-auto" priority />
                        </NavigationLink>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center">
                        <Suspense fallback={<SearchInputSkeleton />}>
                            <SearchInput/>
                        </Suspense>
                    </div>
                    <div className="flex items-center sm:gap-1 ml-auto md:ml-0 shrink-0">
                        <MobileSearch />
                        <Suspense>
                            <NavbarCart/>
                        </Suspense>
                        <Suspense fallback={<NavbarUserSkeleton />}>
                            <NavbarUser/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </header>
        <nav className="hidden md:block sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/85">
            <div className="container mx-auto px-4 flex items-center gap-2 h-11">
                <NavigationLink
                    href="/search"
                    className="inline-flex items-center gap-2 h-8 rounded-md bg-primary px-3 text-[13px] font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <LayoutGrid className="size-4" aria-hidden />
                    {t('shopAll')}
                </NavigationLink>
                <Suspense>
                    <NavbarCollections/>
                </Suspense>
            </div>
        </nav>
        </>
    );
}

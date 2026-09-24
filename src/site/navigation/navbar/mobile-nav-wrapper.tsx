import {getRouteLocale} from '@/platform/i18n/server';
import {getCollectionTree} from '@/features/collections/data';
import {MobileNav} from '@/site/navigation/navbar/mobile-nav';

export async function MobileNavWrapper() {
    const locale = await getRouteLocale();

    const tree = await getCollectionTree(locale);

    return <MobileNav collections={tree} />;
}

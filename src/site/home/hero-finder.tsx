'use client';

import {useState, type FormEvent} from 'react';
import {Search} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/platform/i18n/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {NativeSelect, NativeSelectOption} from '@/components/ui/native-select';

interface HeroFinderProps {
    /** Vehicle-brand facet; the brand selector is hidden when the channel has none. */
    brandFacet?: {id: string; name: string; values: Array<{id: string; name: string}>};
    categories: Array<{slug: string; name: string}>;
}

/**
 * "Search by vehicle" card. Only builds URLs for existing routes/params —
 * `/collection/[slug]` or `/search` with the `facets` param that
 * buildSearchInput (features/search/search-helpers.ts) already understands.
 */
export function HeroFinder({brandFacet, categories}: HeroFinderProps) {
    const t = useTranslations('Hero.finder');
    const router = useRouter();
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    const findByVehicle = (event: FormEvent) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (brandFacet && brand) params.append('facets', `${brandFacet.id}:${brand}`);
        const query = params.size > 0 ? `?${params}` : '';
        router.push(category ? `/collection/${category}${query}` : `/search${query}`);
    };

    const findByKeyword = (event: FormEvent) => {
        event.preventDefault();
        const term = keyword.trim();
        router.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    };

    const labelClassName = 'text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground';
    const selectClassName = 'w-full [&_select]:h-11 [&_select]:rounded-lg [&_select]:bg-background [&_select]:pl-3.5';

    return (
        <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-xl shadow-foreground/5">
            <form onSubmit={findByVehicle} className="space-y-3">
                <p className={labelClassName}>{t('vehicleTitle')}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {brandFacet && (
                        <NativeSelect
                            aria-label={brandFacet.name}
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className={selectClassName}
                        >
                            <NativeSelectOption value="">{t('anyBrand')}</NativeSelectOption>
                            {brandFacet.values.map((value) => (
                                <NativeSelectOption key={value.id} value={value.id}>{value.name}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                    )}
                    <NativeSelect
                        aria-label={t('categoryLabel')}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${selectClassName} ${brandFacet ? '' : 'sm:col-span-2'}`}
                    >
                        <NativeSelectOption value="">{t('allCategories')}</NativeSelectOption>
                        {categories.map((c) => (
                            <NativeSelectOption key={c.slug} value={c.slug}>{c.name.trim()}</NativeSelectOption>
                        ))}
                    </NativeSelect>
                </div>
                <Button type="submit" size="lg" className="h-11 w-full rounded-lg text-sm font-semibold">
                    <Search className="size-4" />
                    {t('findProducts')}
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t('or')}
                <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={findByKeyword} className="space-y-3">
                <label htmlFor="hero-keyword" className={labelClassName}>{t('keywordTitle')}</label>
                <div className="flex gap-3">
                    <Input
                        id="hero-keyword"
                        type="search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder={t('keywordPlaceholder')}
                        className="h-11 flex-1 rounded-lg bg-background px-3.5"
                    />
                    <Button type="submit" variant="secondary" size="lg" className="h-11 rounded-lg px-5 font-semibold">
                        {t('search')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

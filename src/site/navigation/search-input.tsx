'use client';

import {useState} from 'react';
import {Search} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {SearchOverlay} from '@/site/navigation/navbar/search-overlay';

export function SearchInput() {
    const t = useTranslations('Navigation');
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group relative flex h-11 w-full max-w-xl items-center rounded-full border border-border bg-muted pl-5 pr-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-background"
            >
                <span className="flex-1 truncate text-left">{t('searchProducts')}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                    <Search className="size-4" />
                </span>
            </button>
            <SearchOverlay open={open} onOpenChange={setOpen} />
        </>
    );
}

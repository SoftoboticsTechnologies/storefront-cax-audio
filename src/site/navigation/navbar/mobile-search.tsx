'use client';

import {useState} from 'react';
import {Search} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {SearchOverlay} from '@/site/navigation/navbar/search-overlay';

/** Header search icon below md, where the inline search bar is hidden. */
export function MobileSearch() {
    const t = useTranslations('Navigation');
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label={t('searchProducts')}>
                <Search className="size-5" />
            </Button>
            <SearchOverlay open={open} onOpenChange={setOpen} />
        </>
    );
}

import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {whatsappHref} from '@/config/business';
import {WhatsAppIcon} from '@/components/whatsapp-icon';

/** Site-wide floating "chat on WhatsApp" button (bottom-right). */
export async function WhatsAppButton() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Contact'});

    return (
        <a
            href={whatsappHref(t('whatsappGreeting'))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('chatOnWhatsApp')}
            title={t('chatOnWhatsApp')}
            className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] print:hidden"
        >
            <WhatsAppIcon className="size-7" />
        </a>
    );
}

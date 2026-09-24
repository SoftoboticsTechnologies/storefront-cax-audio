import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {ArrowUpRight, Mail, MapPin, Phone} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {SITE_NAME, buildCanonicalUrl} from '@/config/metadata';
import {BUSINESS, businessAddressLines, mailHref, telHref, whatsappHref} from '@/config/business';
import {SectionHeading} from '@/components/ui/section-heading';
import {WhatsAppIcon} from '@/components/whatsapp-icon';
import {EnquiryForm} from '@/site/contact/enquiry-form';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Contact'});

    return {
        title: t('pageTitle'),
        description: t('metaDescription', {siteName: SITE_NAME, city: BUSINESS.address.city}),
        alternates: {canonical: buildCanonicalUrl('/contact')},
    };
}

interface ContactCardProps {
    icon: ReactNode;
    title: string;
    href: string;
    external?: boolean;
    children: ReactNode;
}

function ContactCard({icon, title, href, external, children}: ContactCardProps) {
    return (
        <a
            href={href}
            {...(external && {target: '_blank', rel: 'noopener noreferrer'})}
            className="group flex gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
        >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xl">{title}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                </div>
                <div className="mt-1 text-sm text-muted-foreground break-words">{children}</div>
            </div>
        </a>
    );
}

export default async function ContactPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Contact'});

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <SectionHeading
                as="h1"
                eyebrow={t('eyebrow')}
                title={t('title')}
                highlight={t('highlight')}
                description={t('description')}
            />

            <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
                <div className="grid content-start gap-4">
                    <ContactCard icon={<MapPin className="size-5"/>} title={t('visit')} href={BUSINESS.googleBusinessUrl} external>
                        <address className="not-italic">
                            {businessAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
                        </address>
                        <span className="mt-2 block font-semibold text-primary">{t('openInMaps')}</span>
                    </ContactCard>
                    <ContactCard icon={<Phone className="size-5"/>} title={t('call')} href={telHref}>
                        {BUSINESS.phoneDisplay}
                    </ContactCard>
                    <ContactCard icon={<WhatsAppIcon className="size-5"/>} title={t('whatsapp')} href={whatsappHref(t('whatsappGreeting'))} external>
                        {BUSINESS.phoneDisplay}
                    </ContactCard>
                    <ContactCard icon={<Mail className="size-5"/>} title={t('email')} href={mailHref()}>
                        {BUSINESS.email}
                    </ContactCard>
                </div>

                <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-xl shadow-foreground/5">
                    <h2 className="font-display text-3xl mb-1">{t('form.title')}</h2>
                    <p className="text-sm text-muted-foreground mb-6">{t('form.subtitle')}</p>
                    <EnquiryForm/>
                </div>
            </div>
        </div>
    );
}

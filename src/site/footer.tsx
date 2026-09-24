import {getRouteLocale} from '@/platform/i18n/server';
import {getRootCollections} from '@/features/collections/data';
import Image from "next/image";
import type {ReactNode} from 'react';
import {NavigationLink} from '@/site/navigation/navigation-link';
import {getTranslations} from 'next-intl/server';
import {SITE_NAME} from '@/config/metadata';
import {BUSINESS, businessAddressLines, mailHref, telHref, whatsappHref} from '@/config/business';
import {WhatsAppIcon} from '@/components/whatsapp-icon';
import {FacebookIcon, GoogleIcon, InstagramIcon, LinkedInIcon, YouTubeIcon} from '@/components/social-icons';
import {ExternalLink, Mail, MapPin, Phone} from 'lucide-react';


const COPYRIGHT_YEAR = 2026;

/** Always shown; a network becomes a link once its URL is set in config/business.ts. */
const SOCIAL_LINKS = [
    {network: 'Facebook', href: BUSINESS.social.facebook, Icon: FacebookIcon},
    {network: 'Instagram', href: BUSINESS.social.instagram, Icon: InstagramIcon},
    {network: 'YouTube', href: BUSINESS.social.youtube, Icon: YouTubeIcon},
    {network: 'LinkedIn', href: BUSINESS.social.linkedin, Icon: LinkedInIcon},
];

const socialButtonClassName = 'flex size-11 items-center justify-center rounded-md border transition-all duration-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]';

const socialBrandClassName: Record<string, string> = {
    Facebook: 'border-[#1877F2]/35 bg-[#1877F2]/8 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/12 hover:text-[#1877F2]',
    Instagram: 'border-[#E4405F]/35 bg-[#E4405F]/8 text-[#E4405F] hover:border-[#E4405F] hover:bg-[#E4405F]/12 hover:text-[#E4405F]',
    YouTube: 'border-[#FF0000]/35 bg-[#FF0000]/8 text-[#FF0000] hover:border-[#FF0000] hover:bg-[#FF0000]/12 hover:text-[#FF0000]',
    LinkedIn: 'border-[#0A66C2]/35 bg-[#0A66C2]/8 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/12 hover:text-[#0A66C2]',
};

const linkClassName = 'hover:text-primary transition-colors';
const contactIconClassName = 'size-5 shrink-0 text-primary';

async function Copyright() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Footer'});

    return (
        <div>
            &copy; {COPYRIGHT_YEAR} {t('copyright', {siteName: SITE_NAME})}
        </div>
    )
}

function ColumnHeading({children}: {children: ReactNode}) {
    return (
        <p className="font-display text-2xl text-navy-foreground mb-7">
            {children}
            <span aria-hidden className="block mt-3 h-1 w-9 rounded-full bg-primary"/>
        </p>
    );
}

export async function Footer() {
    const locale = await getRouteLocale();

    const t = await getTranslations({locale, namespace: 'Footer'});
    const collections = await getRootCollections(locale);

    return (
        <footer className="mt-auto bg-navy text-navy-foreground">
            <div className="h-1 bg-primary" />
            <div className="container mx-auto px-4 pt-14 pb-12">
                {/* Four columns split by hairlines on lg+; stacked with gaps below. */}
                <div className="grid grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_1.35fr] gap-x-8 gap-y-12 lg:gap-0 lg:divide-x lg:divide-white/10">
                    <div className="col-span-2 lg:col-span-1 lg:pl-8 lg:pr-10">
                        <NavigationLink href="/" className="inline-block mb-6">
                            <Image src="/logo/cax%20audiologo.png" alt={SITE_NAME} width={1914} height={619} className="h-16 w-auto" />
                        </NavigationLink>
                        <p className="max-w-xs text-base text-navy-foreground/80 leading-relaxed">
                            {t('description')}
                        </p>
                        <ul className="mt-6 flex gap-3">
                            {SOCIAL_LINKS.map(({network, href, Icon}) => (
                                <li key={network}>
                                    {href ? (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={t('followUs', {network})}
                                            className={`${socialButtonClassName} ${socialBrandClassName[network]}`}
                                        >
                                            <Icon className="size-5"/>
                                        </a>
                                    ) : (
                                        <span
                                            role="img"
                                            aria-label={network}
                                            className={`${socialButtonClassName} ${socialBrandClassName[network]}`}
                                        >
                                            <Icon className="size-5"/>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <a
                            href={BUSINESS.googleBusinessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-6 inline-flex items-center gap-3 text-base text-navy-foreground/80 ${linkClassName}`}
                        >
                            <GoogleIcon className={contactIconClassName} />
                            {t('googleProfile')}
                            <ExternalLink className="size-4 shrink-0 text-primary" aria-hidden />
                        </a>
                    </div>

                    <div className="lg:px-10">
                        <ColumnHeading>{t('categories')}</ColumnHeading>
                        <ul className="space-y-3.5 text-base text-navy-foreground/80">
                            {collections.map((collection) => (
                                <li key={collection.id}>
                                    <NavigationLink
                                        href={`/collection/${collection.slug}`}
                                        prefetch={false}
                                        className={linkClassName}
                                    >
                                        {collection.name}
                                    </NavigationLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:px-10">
                        <ColumnHeading>{t('customer')}</ColumnHeading>
                        <ul className="space-y-3.5 text-base text-navy-foreground/80">
                            <li>
                                <NavigationLink href="/search" className={linkClassName}>
                                    {t('shopAll')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/account/orders" className={linkClassName}>
                                    {t('orders')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/account/profile" className={linkClassName}>
                                    {t('account')}
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/contact" className={linkClassName}>
                                    {t('contactUs')}
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-2 lg:col-span-1 lg:pl-10">
                        <ColumnHeading>{t('contact')}</ColumnHeading>
                        <ul className="space-y-4 text-base text-navy-foreground/80">
                            <li className="flex gap-4">
                                <MapPin className={`${contactIconClassName} mt-0.5`} aria-hidden />
                                <address className="not-italic leading-relaxed">
                                    {businessAddressLines.map((line) => <span key={line} className="block">{line}</span>)}
                                </address>
                            </li>
                            <li>
                                <a href={telHref} className={`flex items-center gap-4 ${linkClassName}`}>
                                    <Phone className={contactIconClassName} aria-hidden />
                                    {BUSINESS.phoneDisplay}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={whatsappHref()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${t('whatsapp')}: ${BUSINESS.phoneDisplay}`}
                                    className={`flex items-center gap-4 ${linkClassName}`}
                                >
                                    <WhatsAppIcon className={contactIconClassName} />
                                    {BUSINESS.phoneDisplay}
                                </a>
                            </li>
                            <li>
                                <a href={mailHref()} className={`flex items-center gap-4 min-w-0 break-words ${linkClassName}`}>
                                    <Mail className={contactIconClassName} aria-hidden />
                                    {BUSINESS.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Thin credit bar on the footer's navy, under a divider inset to the
                container. Right padding on sm+ keeps the logo clear of the fixed
                WhatsApp button (site/whatsapp-button.tsx). */}
            <div className="container mx-auto px-4 text-navy-foreground/55">
                <div className="border-t border-white/10 sm:pr-16 py-2 flex flex-col sm:flex-row items-center justify-between gap-x-4 gap-y-1.5 text-xs font-medium">
                    <Copyright/>
                    <div className="flex items-center gap-2">
                        <span aria-hidden className="hidden sm:inline opacity-50">|</span>
                        <span>{t('poweredBy')}</span>
                        <a
                            href="https://dripfunnel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-80"
                        >
                            <Image
                                src="/logo/Dripfunnel-logo.png"
                                alt="DripFunnel"
                                width={2129}
                                height={367}
                                className="h-4 w-auto"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

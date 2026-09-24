import {BUSINESS} from '@/config/business';
import {SITE_URL} from '@/config/metadata';

/** schema.org LocalBusiness data so search engines can show address/phone/email. */
export function BusinessJsonLd() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'AutoPartsStore',
        name: BUSINESS.name,
        url: SITE_URL,
        logo: new URL('/logo/cax%20audiologo.png', SITE_URL).toString(),
        telephone: `+${BUSINESS.phone}`,
        email: BUSINESS.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS.address.street,
            addressLocality: BUSINESS.address.city,
            postalCode: BUSINESS.address.postalCode,
            addressRegion: BUSINESS.address.region,
            addressCountry: BUSINESS.address.country,
        },
        sameAs: [BUSINESS.googleBusinessUrl],
    };

    return (
        <script
            type="application/ld+json"
            // Escape "<" so the JSON can't close the script tag early.
            dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
        />
    );
}

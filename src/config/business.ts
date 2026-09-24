/**
 * Store contact details, shown in the announcement bar, footer, contact page,
 * floating WhatsApp button and LocalBusiness structured data. Edit here only.
 * Website enquiries go to email and WhatsApp (there's no server to receive a
 * form post under static export — see site/contact/enquiry-form.tsx).
 */
export const BUSINESS = {
    name: 'Cax Audio',
    address: {
        street: '15-9-3, Krishna Nagar, Maharanipeta',
        city: 'Visakhapatnam',
        postalCode: '530002',
        region: 'Andhra Pradesh',
        country: 'IN',
    },
    /** E.164 without the plus sign, as wa.me and tel: links expect. */
    phone: '917222822292',
    phoneDisplay: '+91 72228 22292',
    whatsapp: '917222822292',
    email: 'caxaudio@gmail.com',
    googleBusinessUrl: 'https://share.google/uyZ4VAr2fMfBCZHxC',
    /** Profile URLs for the footer's social buttons. Empty = a static, non-clickable icon. */
    social: {
        facebook: '',
        instagram: '',
        youtube: '',
        linkedin: '',
    },
} as const;

export const businessAddressLines = [
    BUSINESS.address.street,
    `${BUSINESS.address.city} - ${BUSINESS.address.postalCode}, ${BUSINESS.address.region}`,
];

export const telHref = `tel:+${BUSINESS.phone}`;
export const mailHref = (subject?: string, body?: string) => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (body) params.set('body', body);
    const query = params.toString().replace(/\+/g, '%20');
    return `mailto:${BUSINESS.email}${query ? `?${query}` : ''}`;
};
export const whatsappHref = (text?: string) =>
    `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

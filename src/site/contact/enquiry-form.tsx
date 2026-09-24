'use client';

import {useState, type FormEvent} from 'react';
import {Mail} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {WhatsAppIcon} from '@/components/whatsapp-icon';
import {mailHref, whatsappHref} from '@/config/business';

/**
 * Static export has no server to receive a form post, so the enquiry is
 * handed to the visitor's WhatsApp or email app, pre-filled and addressed to
 * the store (config/business.ts). Nothing is stored or sent by the site.
 */
export function EnquiryForm() {
    const t = useTranslations('Contact.form');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [message, setMessage] = useState('');

    const compose = () =>
        [
            t('intro'),
            '',
            `${t('name')}: ${name.trim()}`,
            phone.trim() && `${t('phone')}: ${phone.trim()}`,
            vehicle.trim() && `${t('vehicle')}: ${vehicle.trim()}`,
            '',
            message.trim(),
        ]
            .join('\n')
            // Omitted optional fields leave empty lines; collapse the runs.
            .replace(/\n{3,}/g, '\n\n');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Which of the two submit buttons was pressed (Enter uses the first).
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const text = compose();
        if (submitter?.value !== 'email') {
            window.open(whatsappHref(text), '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = mailHref(t('emailSubject', {name: name.trim()}), text);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="enquiry-name">{t('name')} *</Label>
                    <Input id="enquiry-name" required autoComplete="name" value={name}
                           onChange={(e) => setName(e.target.value)} className="h-11"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="enquiry-phone">{t('phone')}</Label>
                    <Input id="enquiry-phone" type="tel" autoComplete="tel" value={phone}
                           onChange={(e) => setPhone(e.target.value)} className="h-11"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="enquiry-vehicle">{t('vehicle')}</Label>
                <Input id="enquiry-vehicle" placeholder={t('vehiclePlaceholder')} value={vehicle}
                       onChange={(e) => setVehicle(e.target.value)} className="h-11"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="enquiry-message">{t('message')} *</Label>
                <Textarea id="enquiry-message" required rows={5} placeholder={t('messagePlaceholder')} value={message}
                          onChange={(e) => setMessage(e.target.value)}/>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" name="channel" value="whatsapp" size="lg"
                        className="h-11 w-full sm:w-auto sm:flex-1 bg-[#25D366] text-white hover:bg-[#1ebe5a] font-semibold">
                    <WhatsAppIcon className="size-4"/>
                    {t('sendWhatsApp')}
                </Button>
                <Button type="submit" name="channel" value="email" size="lg" variant="outline"
                        className="h-11 w-full sm:w-auto sm:flex-1 font-semibold">
                    <Mail className="size-4"/>
                    {t('sendEmail')}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('note')}</p>
        </form>
    );
}

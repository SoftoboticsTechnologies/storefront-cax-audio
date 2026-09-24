import {Headset, LockKeyhole, ShieldCheck, Truck} from "lucide-react";
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';

const items = [
    {icon: ShieldCheck, key: 'genuine'},
    {icon: Truck, key: 'dispatch'},
    {icon: LockKeyhole, key: 'secure'},
    {icon: Headset, key: 'support'},
] as const;

export async function TrustStrip() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home.trust'});

    return (
        <section className="py-8 md:py-10">
            <ul className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {items.map(({icon: Icon, key}) => (
                    <li
                        key={key}
                        className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/15 bg-card p-5 shadow-lg shadow-primary/5"
                    >
                        {/* Soft concentric arcs in the bottom-right corner. */}
                        <span aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 size-36 rounded-full bg-primary/5 ring-[14px] ring-primary/[0.04]"/>
                        <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                            <Icon className="size-8" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span className="relative min-w-0">
                            <span className="block text-lg font-bold leading-tight">{t(key)}</span>
                            <span className="mt-1 block text-sm leading-snug text-muted-foreground">{t(`${key}Description`)}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

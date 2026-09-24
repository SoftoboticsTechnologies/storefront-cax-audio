'use client';

import {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react';
import {Link} from '@/platform/i18n/navigation';
import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from '@/components/ui/carousel';
import {cn} from '@/lib/utils';
import {HERO_IMAGE_HEIGHT, HERO_IMAGE_WIDTH} from '@/site/home/hero-slides';

const AUTOPLAY_MS = 3500;

export interface HeroCarouselSlide {
    image: string;
    href: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
}

interface HeroCarouselProps {
    slides: HeroCarouselSlide[];
    labels: {previous: string; next: string; goTo: string[]};
}

// Arrows and dots sit over the banner image, not the caption below it. The
// image is full-width at 1920x649, so its height is 33.8vw; the arrows sit at
// ~3/4 of it, and are sized in vw so they stay inside the ~5% margin before
// the artwork's left-hand text. Below md there's no room for them — swipe or
// use the dots.
const arrowClassName =
    'absolute top-[25vw] z-10 hidden md:flex size-[3.3vw] -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

/**
 * Full-width banner carousel with a per-slide caption: loops, advances every
 * 3.5 s, pauses while the pointer or keyboard focus is on it, and doesn't
 * autoplay for visitors who prefer reduced motion. Any manual change restarts
 * the timer.
 */
export function HeroCarousel({slides, labels}: HeroCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [selected, setSelected] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setSelected(api.selectedScrollSnap());
        onSelect();
        api.on('select', onSelect);
        return () => {
            api.off('select', onSelect);
        };
    }, [api]);

    useEffect(() => {
        if (!api || paused || slides.length < 2) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const timer = window.setTimeout(() => api.scrollNext(), AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
        // `selected` restarts the countdown after every slide change, manual or not.
    }, [api, paused, selected, slides.length]);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    return (
        <Carousel
            setApi={setApi}
            opts={{loop: true}}
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
        >
            <CarouselContent className="ml-0">
                {slides.map((slide, index) => (
                    <CarouselItem key={slide.image} className="pl-0">
                        {/* The caption's button is the keyboard target; the image is a
                            pointer-only shortcut to the same page. */}
                        <Link href={slide.href} prefetch={false} tabIndex={-1} className="block bg-black">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                width={HERO_IMAGE_WIDTH}
                                height={HERO_IMAGE_HEIGHT}
                                priority={index === 0}
                                sizes="100vw"
                                className="h-auto w-full"
                            />
                        </Link>
                        <div className="bg-navy text-navy-foreground">
                            <div className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <p className="eyebrow">{slide.eyebrow}</p>
                                    <p className="font-display text-4xl md:text-5xl">{slide.title}</p>
                                    <p className="max-w-xl text-sm md:text-base text-navy-foreground/70">{slide.description}</p>
                                </div>
                                <Link
                                    href={slide.href}
                                    prefetch={false}
                                    className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 md:self-auto"
                                >
                                    {slide.cta}
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden/>
                                </Link>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {slides.length > 1 && (
                <>
                    <button type="button" onClick={scrollPrev} aria-label={labels.previous}
                            className={cn(arrowClassName, 'left-[1.5vw]')}>
                        <ChevronLeft className="size-[45%]" aria-hidden/>
                    </button>
                    <button type="button" onClick={scrollNext} aria-label={labels.next}
                            className={cn(arrowClassName, 'right-[1.5vw]')}>
                        <ChevronRight className="size-[45%]" aria-hidden/>
                    </button>
                    <div className="absolute inset-x-0 top-[calc(33.8vw-1.25rem)] md:top-[calc(33.8vw-1.75rem)] z-10 flex justify-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.image}
                                type="button"
                                onClick={() => api?.scrollTo(index)}
                                aria-label={labels.goTo[index]}
                                aria-current={index === selected}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    index === selected ? 'w-6 bg-primary' : 'w-1.5 bg-white/60 hover:bg-white',
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </Carousel>
    );
}

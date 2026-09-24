'use client';

import type {ReactNode} from "react";
import {ProductCard} from "@/features/products/components/product-card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import {SectionHeading} from "@/components/ui/section-heading";
import {FragmentOf, readFragment} from "@/platform/vendure/graphql";
import {ProductCardFragment} from '@/features/products/graphql';

interface ProductCarouselClientProps {
    title: string;
    eyebrow?: string;
    highlight?: string;
    action?: ReactNode;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
    preloadFirstProduct?: boolean;
}

export function ProductCarousel({title, eyebrow, highlight, action, products, preloadFirstProduct}: ProductCarouselClientProps) {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <SectionHeading eyebrow={eyebrow} title={title} highlight={highlight} action={action} />
                <Carousel
                    opts={{
                        align: "start",
                        loop: products.length > 4,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 md:-ml-5">
                        {products.map((product, index) => (
                            <CarouselItem key={readFragment(ProductCardFragment, product).productId}
                                          className="pl-3 md:pl-5 basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <ProductCard product={product} preload={preloadFirstProduct && index === 0}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-4 size-10 bg-background shadow-md hover:border-primary hover:text-primary"/>
                    <CarouselNext className="hidden md:flex -right-4 size-10 bg-background shadow-md hover:border-primary hover:text-primary"/>
                </Carousel>
            </div>
        </section>
    );
}

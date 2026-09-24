import {ProductGridSkeleton} from '@/features/products/product-grid-skeleton';

export default function CollectionLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb + collection hero banner skeleton */}
            <div className="h-5 w-40 mb-6 animate-pulse bg-muted rounded" />
            <div className="mb-10 min-h-[16rem] md:min-h-[20rem] animate-pulse bg-navy/90 rounded-2xl" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar Skeleton */}
                <aside className="lg:col-span-1">
                    <div className="h-64 animate-pulse bg-muted rounded-lg" />
                </aside>

                {/* Product Grid Skeleton */}
                <div className="lg:col-span-3">
                    <ProductGridSkeleton />
                </div>
            </div>
        </div>
    );
}

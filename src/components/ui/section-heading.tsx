import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    /** Rendered after `title` in the brand accent color. */
    highlight?: string;
    description?: string;
    /** Right-aligned slot, typically a "View all" pill link. */
    action?: ReactNode;
    /** Use on dark (`bg-navy`) sections. */
    inverted?: boolean;
    as?: "h1" | "h2";
    className?: string;
}

export function SectionHeading({
    eyebrow,
    title,
    highlight,
    description,
    action,
    inverted,
    as: Heading = "h2",
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn("mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
            <div className="max-w-2xl space-y-3">
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <Heading className={cn("font-display text-4xl md:text-5xl text-balance", inverted && "text-navy-foreground")}>
                    {title}
                    {highlight && <> <span className="text-primary">{highlight}</span></>}
                </Heading>
                {description && (
                    <p className={cn("leading-relaxed", inverted ? "text-navy-foreground/70" : "text-muted-foreground")}>
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

/** Class list for the outlined pill "View all →" link used beside section headings. */
export const sectionActionClassName =
    "group inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary";

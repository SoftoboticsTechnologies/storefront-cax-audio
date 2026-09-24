"use client";

import {ThemeProvider as NextThemesProvider} from "next-themes";

// next-themes renders an inline <script> that sets the theme class before
// first paint. It runs from the server HTML; when React renders it again in
// the browser, React 19 warns that scripts in components never execute. Mark
// the browser copy inert so React doesn't warn. The library sets
// suppressHydrationWarning on the tag, so the differing `type` is fine.
const scriptProps = typeof window === "undefined" ? undefined : {type: "application/json"};

export function ThemeProvider({children}: {children: React.ReactNode}) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            scriptProps={scriptProps}
        >
            {children}
        </NextThemesProvider>
    );
}

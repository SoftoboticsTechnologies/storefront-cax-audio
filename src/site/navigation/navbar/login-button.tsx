'use client'

import {ComponentProps, useTransition} from "react";
import {logoutAction} from '@/features/authentication/logout';
import {useRouter} from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';
import {User} from 'lucide-react';

interface LoginButtonProps extends ComponentProps<'button'> {
    isLoggedIn: boolean;
}

export function LoginButton({isLoggedIn, ...props}: LoginButtonProps) {
    const t = useTranslations('Navigation');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <button {...props} aria-disabled={isPending}
                onClick={() => {
                    if (isLoggedIn) {
                        startTransition(async () => {
                            await logoutAction()
                            router.push('/')
                        })
                    } else {
                        router.push('/sign-in')
                    }
                }}>
            {isLoggedIn ? t('signOut') : (
                <>
                    {/* Icon-only on small phones so the header row fits at 320px. */}
                    <User className="size-4 sm:hidden" aria-hidden />
                    <span className="sr-only sm:not-sr-only">{t('signIn')}</span>
                </>
            )}
        </button>
    )
}

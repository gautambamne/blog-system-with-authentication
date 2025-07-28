'use client';
import React, { useEffect } from 'react'
import useAuthStore from '../../../store/auth-store';
import { AuthActions } from '@/api-actions/auth-actions';

export default function AuthInitializer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setLogin, setLogout } = useAuthStore();
    useEffect(() => {
        AuthActions.refresh_token()
            .then((data) => {
                setLogin(data)
            }).catch(() => {
                setLogout()
            })
    }, [])
    return (
        <>
            {children}
        </>
    )
}

import React from 'react'
import AuthInitializer from '../base/aurh-initializer';
import { Toaster } from '../ui/sonner';

export default function GlobalInitializer({
    children
} : Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <>
      <AuthInitializer>
          {children}
      </AuthInitializer>
      <Toaster />
    </>
  )
}

// app/login/layout.tsx
import React from 'react';
import '@/app/globals.css'

export default function LoginLayout({ children } : Readonly<{
    children: React.ReactNode;
  }>) {
  return (
        <main>{children}</main>
  );
}
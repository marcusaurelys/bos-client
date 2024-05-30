// app/login/layout.tsx
import React from 'react';
import "../globals.css"; 

export default function LoginLayout({ children } : Readonly<{
    children: React.ReactNode;
  }>) {
  return (
        <main>{children}</main>
  );
}
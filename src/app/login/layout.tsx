// app/login/layout.tsx
import React from 'react';
import "../globals.css"; 

export default function LoginLayout({ children } : Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html>
      <head>
        <title>Login Layout</title>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
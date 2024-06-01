import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionContextWrapper from "@/components/SessionContext";
import { cookies } from "next/headers";
import { getToken } from "@/db/users";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface UserSession {
  name : string,
  role : string,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const sessionToken = cookies().get('session')?.value
  var session : UserSession | null = null
  if(sessionToken != null){
    session = await getToken(sessionToken)
  }
  console.log(session)
  

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextWrapper session={session}>
        {children}
        </SessionContextWrapper>
        
        </body>
    </html>
  );
}

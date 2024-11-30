import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Navbar } from '../components/layout/NavBar';
import '@/styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
}
'use client';
import React, { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import AppWrappers from '../app/AppWrappers';
import { useSession, signIn, signOut } from "next-auth/react"
import { Inter } from 'next/font/google'
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import { Session } from 'next-auth';

import '@/styles/MiniCalendar.css';
import SessionProvider from './SessionProvider';

type Props = {
  children: React.ReactNode;
  session: Session | null;
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  session
} : any ) {
  const pathname = usePathname();
  return (
    <html lang="de">
      <body id={'root'}>
        <SessionProvider session={session}>
          <AppWrappers>
            {/* <ChakraProvider theme={theme}> */}
            {pathname?.includes('register') || pathname?.includes('sign-in') ? (
              children
            ) : (
              <Box>
                <Sidebar routes={routes} />
                <Box
                  pt={{ base: '60px', md: '100px' }}
                  float="right"
                  minHeight="100vh"
                  height="100%"
                  overflow="auto"
                  position="relative"
                  maxHeight="100%"
                  w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                  maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                  transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                  transitionDuration=".2s, .2s, .35s"
                  transitionProperty="top, bottom, width"
                  transitionTimingFunction="linear, linear, ease"
                >
                  <Portal>
                    <Box>
                      <Navbar
                        logoText={'Horizon UI Dashboard PRO'}
                        brandText={getActiveRoute(routes, pathname)}
                        secondary={getActiveNavbar(routes, pathname)}
                      />
                    </Box>
                  </Portal>
                  <Box
                    mx="auto"
                    p={{ base: '20px', md: '30px' }}
                    pe="20px"
                    minH="100vh"
                    pt="50px"
                  >
                    {children}
                    {/* <Component apiKeyApp={apiKey} {...pageProps} /> */}
                  </Box>
                  <Box>
                    <Footer />
                  </Box>
                </Box>
              </Box>
            )}
            {/* </ChakraProvider> */}
          </AppWrappers>
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
}
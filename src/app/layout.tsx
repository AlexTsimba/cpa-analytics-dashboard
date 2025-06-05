import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { ClientOnly } from '@/components/client-only';
import { HeaderStatus } from '@/components/header-status';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Keitaro Tracker | Affiliate Management Dashboard',
  description:
    'Professional affiliate tracking and campaign management platform with real-time analytics, partner management, and conversion optimization tools.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {/* Header */}
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div>
                    <h1 className="text-lg font-medium text-foreground">
                      Affiliate Management Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Professional tracking & campaign optimization
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto px-4">
                  <ClientOnly
                    fallback={
                      <div className="text-xs text-muted-foreground">
                        Last sync: ...
                      </div>
                    }
                  >
                    <HeaderStatus />
                  </ClientOnly>
                  <ThemeToggle />
                </div>
              </header>

              {/* Page Content */}
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

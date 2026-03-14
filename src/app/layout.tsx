import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import Link from "next/link"
import "./globals.css"

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ColdMail AI',
  description: 'Generate personalized cold emails with AI',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <header className="flex items-center justify-between px-6 sm:px-8 h-16 bg-[#0d0a1a] border-b border-purple-900/40 backdrop-blur-sm">

            {/* Left — logo */}
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
              <img src="/favicon-32x32.png" alt="ColdMail AI" className="h-7 w-7 rounded-lg" />
              ColdMail <span className="text-purple-400">AI</span>
            </Link>

            {/* Right — nav + auth */}
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/feedback" className="text-gray-400 hover:text-white text-sm transition-colors">
                Feedback
              </Link>

              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </Show>

              <div className="w-px h-5 bg-purple-800/50" />

              <Show when="signed-out">
                <div className="flex items-center gap-3">
                  <SignInButton>
                    <button className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                      Log in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full transition-colors cursor-pointer">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>

          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
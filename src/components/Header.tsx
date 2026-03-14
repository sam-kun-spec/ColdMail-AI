"use client"

import { useState } from "react"
import Link from "next/link"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-50 bg-[#0d0a1a] border-b border-purple-900/40 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 sm:px-8 h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
          <img src="/favicon-32x32.png" alt="ColdMail AI" className="h-7 w-7 rounded-lg" />
          ColdMail <span className="text-purple-400">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
            About
          </Link>
          <Link href="/feedback" className="text-gray-400 hover:text-white text-sm transition-colors">
            Feedback
          </Link>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
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

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-purple-900/40 bg-[#0d0a1a] px-6 py-4 space-y-4">
          <Link href="/about" onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-400 hover:text-white transition-colors py-2">
            About
          </Link>
          <Link href="/feedback" onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-400 hover:text-white transition-colors py-2">
            Feedback
          </Link>
          <Show when="signed-in">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-400 hover:text-white transition-colors py-2">
              Dashboard
            </Link>
          </Show>
          <div className="h-px w-full bg-purple-900/40" />
          <Show when="signed-out">
            <div className="flex flex-col gap-3 pt-1">
              <SignInButton>
                <button className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors cursor-pointer py-2">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2.5 rounded-full transition-colors cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </header>
  )
}
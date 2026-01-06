"use client"

import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center h-screen bg-background px-4">
      <SignIn />
    </main>
  )
}
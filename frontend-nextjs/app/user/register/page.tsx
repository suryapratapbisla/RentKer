"use client"

import { SignUp } from "@clerk/nextjs"

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <SignUp />
    </main>
  )
}


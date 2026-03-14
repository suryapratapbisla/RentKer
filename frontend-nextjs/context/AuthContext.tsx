"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { useUser, useClerk } from "@clerk/nextjs"
import type { UserResource } from "@clerk/shared/types"

interface Profile {
  _id: string
  name: string
  email?: string
  phone?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: Profile | null
  clerkUser: UserResource | null
  isLoading: boolean
  isAdmin: boolean
  logout: () => Promise<void>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
const ADMIN_EMAILS =
  (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSyncing, setIsSyncing] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!clerkUser) {
      setProfile(null)
      setIsSyncing(false)
      return
    }

    const syncUser = async () => {
      setIsSyncing(true)
      try {
        const fullName = [clerkUser.firstName, clerkUser.lastName]
          .filter(Boolean)
          .join(" ")
          .trim()
        const email = clerkUser.primaryEmailAddress?.emailAddress
        const metadataRole = clerkUser.publicMetadata?.role
        const isAdminEmail = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false
        const shouldBeAdmin = metadataRole === "admin" || isAdminEmail

        const response = await axios.post(`${API_BASE_URL}/api/v1/user/register`, {
          clerk_id: clerkUser.id,
          name: fullName || clerkUser.username || email,
          email,
          phone: clerkUser.primaryPhoneNumber?.phoneNumber,
          role: shouldBeAdmin ? "admin" : undefined,
        })

        if (response.data.user) {
          setProfile({
            _id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone,
            role: shouldBeAdmin ? "admin" : response.data.user.role,
          })
        }
      } catch (error) {
        console.error("Failed to sync user with backend:", error)
      } finally {
        setIsSyncing(false)
      }
    }

    void syncUser()
  }, [clerkUser, isLoaded])

  const logout = async () => {
    await signOut()
    setProfile(null)
  }

  const metadataRole = clerkUser?.publicMetadata?.role
  const isAdmin = profile?.role === "admin" || metadataRole === "admin"

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        clerkUser: clerkUser ?? null,
        isLoading: isSyncing || !isLoaded,
        isAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


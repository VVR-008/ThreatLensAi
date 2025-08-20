"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      // Pre-fill from user context if available
      setFirstName((user as any).firstName || "")
      setLastName((user as any).lastName || "")
      setCompany((user as any).company || "")
    }
  }, [user])

  async function saveProfile() {
    if (!user?.email) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.email}`,
        },
        body: JSON.stringify({ firstName, lastName, company }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update profile")
      setMessage("Profile updated successfully")
    } catch (e: any) {
      setMessage(e.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background matrix-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      <div className="relative z-10">
        <DashboardNavigation />
        {/* Added padding-top pt-24 to push content below fixed navbar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="glass-morphism cyber-border">
            <CardHeader>
              <CardTitle className="font-orbitron">Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveProfile} disabled={saving} className="bg-primary hover:bg-primary/90">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

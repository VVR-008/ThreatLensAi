"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changing, setChanging] = useState(false)
  const [pwMessage, setPwMessage] = useState<string | null>(null)

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [savingTheme, setSavingTheme] = useState(false)
  const [themeMessage, setThemeMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  async function changePassword() {
    if (!user?.email) return
    setChanging(true)
    setPwMessage(null)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.email}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to change password')
      setPwMessage('Password changed successfully')
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (e: any) {
      setPwMessage(e.message || 'Failed to change password')
    } finally {
      setChanging(false)
    }
  }

  async function saveThemePreference() {
    if (!user?.email) return
    setSavingTheme(true)
    setThemeMessage(null)
    try {
      const res = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.email}`,
        },
        body: JSON.stringify({ theme }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save theme')
      setThemeMessage('Theme preference saved')
    } catch (e: any) {
      setThemeMessage(e.message || 'Failed to save theme')
    } finally {
      setSavingTheme(false)
    }
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background matrix-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
      <div className="relative z-10">
        <DashboardNavigation />
        {/* Added padding-top pt-24 to push content below fixed navbar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 space-y-8">
          <Card className="glass-morphism cyber-border">
            <CardHeader>
              <CardTitle className="font-orbitron">Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={changePassword} disabled={changing} className="bg-primary hover:bg-primary/90">
                    {changing ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
                {pwMessage && <p className="text-sm text-muted-foreground">{pwMessage}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism cyber-border">
            <CardHeader>
              <CardTitle className="font-orbitron">Theme</CardTitle>
              <CardDescription>Choose your appearance preference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label>Theme</Label>
                  <div className="mt-2 max-w-xs">
                    <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveThemePreference} disabled={savingTheme} className="bg-primary hover:bg-primary/90">
                    {savingTheme ? 'Saving...' : 'Save Preference'}
                  </Button>
                </div>
                {themeMessage && <p className="text-sm text-muted-foreground">{themeMessage}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

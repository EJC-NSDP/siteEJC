import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { getSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

export function FooterNavigation() {
  const [name, setName] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const [avatarFallback, setAvatarFallback] = useState<string>('')

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      if (session) {
        const fallback = session.user.name[0] + session.user.surname[0]
        setName(`${session.user.name}`)
        if (session.user.avatar_url) {
          setAvatar(session.user.avatar_url)
        }
        setAvatarFallback(fallback.toUpperCase())
      }
    }
    fetchSession()
  }, [])

  async function logout() {
    await signOut()
  }

  return (
    <div className="group flex items-center justify-between rounded-xl px-4 py-3">
      <Link href="/admin/profile">
        <Button variant="ghost" className="p-0">
          <div className="flex items-center gap-4">
            {avatarFallback === '' ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <Avatar>
                <AvatarImage src={avatar} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            {name === '' ? (
              <Skeleton className="h-3 w-32" />
            ) : (
              <span className="text-sm font-light text-zinc-50">{name}</span>
            )}
          </div>
        </Button>
      </Link>
      <Button variant="ghost" onClick={logout}>
        <LogOut className="h-6 w-6 text-zinc-50 hover:opacity-80" />
      </Button>
    </div>
  )
}

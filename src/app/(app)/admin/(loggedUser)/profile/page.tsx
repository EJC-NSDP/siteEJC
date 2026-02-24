'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Album,
  BookUser,
  CarFront,
  ClipboardList,
  Edit,
  FolderOpen,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { ProfileData } from '@/app/api/encontreiro/[id]/profile/get-profile'
import type { CurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import AvatarGroup from '@/components/AvatarGroup'
import { CardLoading } from '@/components/CardLoading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { isBirthdayInCurrentWeek } from '@/utils/birthday'
import { getProfile } from '@/utils/fetch-profile'
import { getInitials } from '@/utils/get-initials'

import { BirthdayCard } from './(sectionComponents)/BirthdayCard'
import { ButtonLabel } from './(sectionComponents)/ButtonLabel'
import { EncontroCard } from './(sectionComponents)/EncontroCard'

async function getCurrentEncontro() {
  const equipe = await api
    .get(`encontro/atual/1/get-current-encontro`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return equipe
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined,
  )
  const [corCirculo, setCorCirculo] = useState<string>('bg-zinc-200')
  const [isBirthday, setIsBirthday] = useState<boolean>(false)

  const { data: currentEncontro } = useQuery<CurrentEncontro>({
    queryFn: async () => await getCurrentEncontro(),
    queryKey: ['currentEnconto'],
  })

  const router = useRouter()

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession()
      if (session) {
        const data: ProfileData = await getProfile(session.user.id)
        setProfileData(data)
        if (data.corCirculo === 'Amarelo') {
          setCorCirculo('bg-yellow-500')
        } else if (data.corCirculo === 'Azul') {
          setCorCirculo('bg-blue-500')
        } else if (data.corCirculo === 'Laranja') {
          setCorCirculo('bg-orange-500')
        } else if (data.corCirculo === 'Verde') {
          setCorCirculo('bg-emerald-500')
        } else if (data.corCirculo === 'Vermelho') {
          setCorCirculo('bg-red-500')
        }
        if (data.dataNascimento) {
          setIsBirthday(isBirthdayInCurrentWeek(data.dataNascimento))
        } else {
          setIsBirthday(false)
        }
      }
    }
    fetchSession()
  }, [])

  if (
    profileData &&
    profileData.equipeEncontro !== 'Não alocado' &&
    !profileData.fichaCadastro
  ) {
    router.replace('/admin/ficha-de-cadastro')
  }

  return (
    <div className="w-full p-4 lg:px-40 lg:py-16">
      {!profileData ? (
        <CardLoading />
      ) : (
        <Card className="w-full rounded-xl border-none">
          <div className={cn('h-8 w-full rounded-t-xl lg:h-36', corCirculo)} />
          <CardTitle className="flex -translate-y-2 px-4 lg:-translate-y-8">
            <div className="flex w-full flex-col items-end justify-between gap-4 lg:flex-row lg:gap-8">
              <div className="flex items-center gap-8 lg:px-8">
                <Button
                  type="button"
                  variant="ghost"
                  className="group relative size-32 overflow-hidden border border-white bg-black p-0 ring-4 ring-white lg:size-44"
                >
                  <Link href="/admin/profile/avatar">
                    <Avatar className="size-32 lg:size-44">
                      <AvatarImage
                        src={profileData.avatarUrl}
                        className="transition-opacity duration-300 group-hover:opacity-50"
                      />
                      <AvatarFallback>
                        {getInitials(profileData.nome)}
                      </AvatarFallback>
                    </Avatar>

                    <Edit className="absolute inset-0 m-auto size-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </Button>
                <div className="flex flex-col font-bold">
                  <h2 className="text-xl text-zinc-800 lg:text-3xl">
                    {profileData.nome}
                  </h2>
                  <span className="text-base text-zinc-500 lg:text-xl">
                    {profileData.numeroEncontro}º EJC
                  </span>
                </div>
              </div>
              {isBirthday && <BirthdayCard isSelf />}
            </div>
          </CardTitle>
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <Card className="w-full border-none bg-zinc-100 p-4 px-2 lg:p-8">
              <CardTitle className="text-2xl font-bold">
                Neste Encontro
              </CardTitle>
              <CardContent className="flex flex-col p-0 py-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-sm text-zinc-400 lg:text-sm">
                        Sua Equipe
                      </h4>
                      <span className="text-xl font-semibold text-zinc-700">
                        {profileData.equipeEncontro}
                      </span>
                    </div>
                    {profileData.equipeEncontro !== 'Não alocado' && (
                      <>
                        <div>
                          <h4 className="text-sm text-zinc-400">Função</h4>
                          <span className="text-xl font-semibold text-zinc-700">
                            {profileData.equipeEncontroCoord
                              ? 'Coordenador(a)'
                              : 'Tropa'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm text-zinc-400">
                            Ficha de cadastro
                          </h4>
                          <span className="text-xl font-semibold text-zinc-700">
                            {profileData.fichaCadastro
                              ? 'Preenchida'
                              : 'Não preenchida'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {profileData.equipeEncontro !== 'Não alocado' && (
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm text-zinc-400">Membros</h4>
                      <div className="flex flex-col gap-4">
                        <AvatarGroup
                          encontreiros={profileData.coordenadores}
                          loose
                        />
                        {profileData.role !== 'DIRIGENTE' && (
                          <AvatarGroup encontreiros={profileData.tropa} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-0">
                <div className="space-y-5">
                  <h4 className="text-xl font-bold lg:text-2xl">
                    Seus acessos
                  </h4>
                  <div className="flex flex-col gap-8 lg:flex-row">
                    {(profileData.role === 'EXTERNA' ||
                      profileData.role === 'DIRIGENTE' ||
                      profileData.role === 'ADMIN') && (
                      <ButtonLabel
                        label="Externa"
                        icon={CarFront}
                        link="/admin/externa"
                      />
                    )}

                    {(profileData.role === 'DIRIGENTE' ||
                      profileData.role === 'ADMIN') && (
                      <ButtonLabel
                        label="Dirigencia"
                        icon={Album}
                        link="/admin/dirigente"
                      />
                    )}

                    {(profileData.role === 'SECRETARIA' ||
                      profileData.role === 'DIRIGENTE' ||
                      profileData.role === 'ADMIN') && (
                      <ButtonLabel
                        label="Secretaria"
                        icon={BookUser}
                        link="/admin/secretaria"
                      />
                    )}

                    {profileData.pastaURL !== '' && (
                      <ButtonLabel
                        label="Pasta Virtual"
                        icon={FolderOpen}
                        link={profileData.pastaURL}
                      />
                    )}

                    {(profileData.pastaURL !== '' ||
                      profileData.role === 'DIRIGENTE' ||
                      profileData.role === 'ADMIN') && (
                      <ButtonLabel
                        label="Minha equipe"
                        icon={Users}
                        link="/admin/minha-equipe"
                      />
                    )}

                    {profileData && (
                      <ButtonLabel
                        label="Ficha de Cadastro"
                        icon={ClipboardList}
                        link="/admin/ficha-de-cadastro"
                      />
                    )}

                    {/* {profileData.equipeEncontroCoord && (
                      <ButtonLabel label="Tropa" icon={Users} link="/" />
                    )} */}
                  </div>
                </div>
              </CardFooter>
            </Card>

            {currentEncontro && currentEncontro.numeroCirculos !== 0 && (
              <EncontroCard currentEncontro={currentEncontro} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { BirthdayCard } from '../(sectionComponents)/BirthdayCard'
import { EncontroCard } from '../(sectionComponents)/EncontroCard'

import type { ProfileData } from '@/app/api/encontreiro/[id]/profile/get-profile'
import AvatarGroup from '@/components/AvatarGroup'
import { CardLoading } from '@/components/CardLoading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { isBirthdayInCurrentWeek } from '@/utils/birthday'
import { getCirculoColor } from '@/utils/fetch-color'
import { getProfileSlug } from '@/utils/fetch-profile'
import { getInitials } from '@/utils/get-initials'

export default async function ProfileSlug(props: {
  params: Promise<{ slug: string }>
}) {
  const profileData: ProfileData = await getProfileSlug(
    (await props.params).slug,
  )

  if (!profileData) return null

  const profileColor = profileData.corCirculo || ''

  const corCirculo = getCirculoColor(profileColor)

  const isBirthday = profileData.dataNascimento
    ? isBirthdayInCurrentWeek(profileData.dataNascimento)
    : false

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
                <Avatar className="group relative size-32 overflow-hidden border border-white bg-black p-0 ring-4 ring-white lg:size-44">
                  <AvatarImage src={profileData.avatarUrl} />
                  <AvatarFallback>
                    {getInitials(profileData.nome)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col font-bold">
                  <h2 className="text-xl text-zinc-800 lg:text-3xl">
                    {profileData.nome}
                  </h2>
                  <span className="text-base text-zinc-500 lg:text-xl">
                    {profileData.numeroEncontro}º EJC
                  </span>
                </div>
              </div>
              {isBirthday && <BirthdayCard />}
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
            </Card>
            <EncontroCard />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

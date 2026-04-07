import type { Role } from '@/enums'

// Define quais roles têm acesso a quais recursos
const roleHierarchy: Record<string, Role[]> = {
  apresentacao_area: ['ADMIN', 'DIRIGENTE', 'APRESENTACAO'],
  dirigente_area: ['ADMIN', 'DIRIGENTE'],
  externa_area: ['ADMIN', 'DIRIGENTE', 'EXTERNA'],
  coordenador_area: ['ADMIN', 'DIRIGENTE', 'COORDENADOR'],
  secretaria_area: ['ADMIN', 'DIRIGENTE', 'SECRETARIA'],
  bp_area: ['ADMIN', 'DIRIGENTE', 'BP'],
}

export function hasRole(userRoles: Role[], required: Role | Role[]): boolean {
  const requiredArr = Array.isArray(required) ? required : [required]
  return requiredArr.some((r) => userRoles.includes(r))
}

export function hasAccess(userRoles: Role[], area: string): boolean {
  const allowed = roleHierarchy[area] ?? []
  return userRoles.some((r) => allowed.includes(r))
}

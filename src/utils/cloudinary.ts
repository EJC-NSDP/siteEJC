export const uploadTypes = {
  cartaz: '1:1',
  capa: '1000:1414',
  profile: '1:1',
} as const

export type TypeUpload = keyof typeof uploadTypes

export function getImageRatio(type: TypeUpload): string {
  return uploadTypes[type]
}

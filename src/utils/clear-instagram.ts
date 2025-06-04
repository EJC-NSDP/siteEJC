export function clearInstagram(instagram: string) {
  return instagram
    .trim()
    .replace(/^@/, '') // remove @ do início
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '') // remove início da URL
    .replace(/\/.*/, '') // remove qualquer coisa após a barra final
}

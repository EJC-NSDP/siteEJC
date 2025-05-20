export function toProper(string: string) {
  return string.substring(0, 1).toUpperCase().concat(string.substring(1))
}

export function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function generateAlphanumId(length: number = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return 'x'.repeat(length).replace(/x/g, () => chars.charAt(Math.floor(Math.random() * chars.length)))
}
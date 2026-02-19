export function generateRandomString(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}

export function generateString(length: number, char: string = 'a'): string {
  if (length <= 0) return '';
  return char.repeat(length);
}

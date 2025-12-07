// String helpers handle character shuffling and escaping for safe HTML rendering.

export {};

declare global {
  interface String {
    shuffle(): string;
  }
}

String.prototype.shuffle = function shuffle(): string {
  const characters = this.split('');

  for (let i = characters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = characters[i];
    characters[i] = characters[j];
    characters[j] = temp;
  }

  return characters.join('');
};

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

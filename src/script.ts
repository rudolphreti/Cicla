import './styles.scss';

declare global {
  interface Window {
    shuffleKeyChars: () => void;
    encryptMessage: () => void;
    decryptMessage: () => void;
    downloadKeyHtml: () => void;
  }

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

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const chunkArray = <T>(values: T[], size = 25): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }

  return chunks;
};

const renderCells = (values: string[], columns: number, render: (value: string, index: number) => string): string =>
  chunkArray(values, columns)
    .map((chunk) =>
      `<tbody><tr>${Array.from({ length: columns }, (_, columnIndex) => {
        const value = chunk[columnIndex];
        return render(value ?? '', columnIndex);
      }).join('')}</tr></tbody>`
    )
    .join('');

const createKeyTableMarkup = (key: string, columns = 20): string => {
  const keyChars = key.split('');

  return chunkArray(keyChars, columns)
    .map((chunk, chunkIndex) => {
      const rowNumberCells = Array.from({ length: columns }, (_, index) => {
        const cellIndex = chunkIndex * columns + index;
        const cellNumber = cellIndex < keyChars.length ? `${cellIndex}` : '';
        return `<td>${cellNumber}</td>`;
      }).join('');

      const characterCells = chunk
        .concat(Array(columns - chunk.length).fill(''))
        .map((character) => {
          const escapedCharacter = character ? escapeHtml(character) : '';
          const classes = escapedCharacter ? '' : 'empty';
          return `<td class="${classes}">${escapedCharacter}</td>`;
        })
        .join('');

      return `<tbody><tr>${rowNumberCells}</tr><tr>${characterCells}</tr></tbody>`;
    })
    .join('');
};

const createMessageTableMarkup = (values: string[], columns = 20): string =>
  renderCells(values, columns, (value) => {
    const escapedValue = value ? escapeHtml(value) : '';
    const classes = escapedValue ? '' : 'empty';
    return `<td class="${classes}">${escapedValue}</td>`;
  });

const createNumberTableWithEmptyCells = (values: string[], columns = 20): string =>
  chunkArray(values, columns)
    .map((chunk) => {
      const numberCells = chunk
        .concat(Array(columns - chunk.length).fill(''))
        .map((value) => {
          const escapedValue = value ? escapeHtml(value) : '';
          const classes = escapedValue ? '' : 'empty';
          return `<td class="${classes}">${escapedValue}</td>`;
        })
        .join('');

      const emptyCells = Array.from({ length: columns }, () => '<td class="empty"></td>').join('');

      return `<tbody><tr>${numberCells}</tr><tr>${emptyCells}</tr></tbody>`;
    })
    .join('');

const buildDownloadableHtml = (key: string, encryptedMessage: string): string => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 1cm; }
  body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; }
  h1, h2 { margin: 16px 1cm 0.4cm 1cm; }
  p { margin: 0 1cm 0.2cm 1cm; }
  pre { margin: 0 1cm 1cm 1cm; white-space: pre-wrap; word-break: break-word; }
  table { border-collapse: collapse; width: auto; margin: 0 1cm 1cm 1cm; }
  tbody { page-break-inside: avoid; }
  td { border: 1px solid black; width: 1cm; height: 1cm; padding: 0; margin: 0; text-align: center; font-size: 12pt; line-height: 1cm; }
  .empty { font-size: 0; line-height: 0; }
</style>
</head>
<body>
<h2>Nachricht entschlüsseln</h2>
${
  encryptedMessage
    ? `<table>${createNumberTableWithEmptyCells(encryptedMessage.split(',').filter(Boolean))}</table>`
    : '<p style="margin: 0 1cm 1cm 1cm;">Keine verschlüsselte Nachricht angegeben</p>'
}
<h2>Schlüssel</h2>
<table id="tbl">${createKeyTableMarkup(key)}</table>
</body>
</html>`;

const shuffleKeyChars = (): void => {
  const keyInput = document.getElementById('key') as HTMLInputElement;
  keyInput.value = keyInput.value.shuffle();
};

const appendMissingCharacters = (message: string, key: string): string | null => {
  const messageCharSet = Array.from(new Set(message.split('')));
  const keyCharSet = Array.from(new Set(key.split('')));

  const missingChars = messageCharSet.filter((character) => !keyCharSet.includes(character));

  if (!missingChars.length) {
    return key;
  }

  const shouldAppendMissing = window.confirm(
    `Einige Zeichen aus der Nachricht fehlen im Schlüssel: ${missingChars.join(', ')}.\n` +
      'Möchten Sie die fehlenden Zeichen an das Ende des Schlüssels anhängen? Klicken Sie auf Abbrechen, um den Schlüssel selbst zu korrigieren.'
  );

  if (!shouldAppendMissing) {
    return null;
  }

  const updatedKey = `${key}${missingChars.join('')}`;
  (document.getElementById('key') as HTMLInputElement).value = updatedKey;
  return updatedKey;
};

const encryptMessage = (): void => {
  const message = (document.getElementById('message') as HTMLInputElement).value;
  const keyInput = (document.getElementById('key') as HTMLInputElement).value;
  const key = appendMissingCharacters(message, keyInput);

  if (!key) {
    return;
  }

  const keyChars = key.split('');
  const usedKeyIndices = new Set<number>();
  const encryptedIndices = message.split('').reduce<number[]>((accumulator, character) => {
    const index = keyChars.findIndex((keyChar, keyIndex) => keyChar === character && !usedKeyIndices.has(keyIndex));

    if (index !== -1) {
      usedKeyIndices.add(index);
      accumulator.push(index);
    }

    return accumulator;
  }, []);

  (document.getElementById('message-encrypted') as HTMLInputElement).value = encryptedIndices.join(',');
};

const decryptMessage = (): void => {
  const encryptedValues = (document.getElementById('message-encrypted') as HTMLInputElement).value
    .split(',')
    .filter(Boolean);
  const key = (document.getElementById('key') as HTMLInputElement).value;

  const decryptedMessage = encryptedValues.reduce((result, value) => {
    const characterIndex = Number.parseInt(value, 10);
    return Number.isNaN(characterIndex) ? result : `${result}${key[characterIndex] ?? ''}`;
  }, '');

  (document.getElementById('message-decrypted') as HTMLInputElement).innerText = decryptedMessage;
  (document.getElementById('message-decrypted-title') as HTMLElement).style.display = 'flex';
  (document.getElementById('message-decrypted') as HTMLElement).style.display = 'flex';
};

const downloadKeyHtml = (): void => {
  const key = (document.getElementById('key') as HTMLInputElement).value;
  const encrypted = (document.getElementById('message-encrypted') as HTMLInputElement).value;

  if (!key.trim()) {
    window.alert('Bitte geben Sie einen Schlüssel an, bevor Sie ihn herunterladen.');
    return;
  }

  const html = buildDownloadableHtml(key, encrypted);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cicla-key.html';
  link.click();
  URL.revokeObjectURL(url);
};

const updateCaretPosition = (event: Event): void => {
  const input = event.currentTarget as HTMLInputElement;
  (document.getElementById('caret-position') as HTMLElement).innerHTML = `Cursor-Position: ${input.selectionStart}`;
};

window.addEventListener('load', () => {
  const input = document.getElementById('key') as HTMLInputElement;
  const menuToggle = document.querySelector('.menu-toggle');
  const menuItems = document.querySelectorAll('.side-menu__nav .menu-item');
  const helpToggle = document.getElementById('help-toggle') as HTMLInputElement | null;
  const helpSection = document.getElementById('help');

  ['click', 'keyup'].forEach((eventName) => {
    input.addEventListener(eventName, updateCaretPosition);
  });

  const toggleMenu = (): void => {
    document.body.classList.toggle('menu-open');
  };

  const closeMenu = (): void => {
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', toggleMenu);
  menuItems.forEach((item) => item.addEventListener('click', closeMenu));

  const toggleHelpVisibility = (): void => {
    if (!helpSection || !helpToggle) {
      return;
    }

    const isVisible = helpToggle.checked;
    helpSection.toggleAttribute('hidden', !isVisible);
    helpToggle.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  };

  helpToggle?.addEventListener('input', toggleHelpVisibility);
  toggleHelpVisibility();
});

window.shuffleKeyChars = shuffleKeyChars;
window.encryptMessage = encryptMessage;
window.decryptMessage = decryptMessage;
window.downloadKeyHtml = downloadKeyHtml;

console.log('Skript erfolgreich geladen, Funktionen wurden an window angehängt:', {
  encryptMessage: window.encryptMessage,
  decryptMessage: window.decryptMessage,
});


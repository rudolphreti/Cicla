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

const getEditableContent = (elementId: string): string => {
  const element = document.getElementById(elementId);
  return element?.innerText ?? '';
};

const setEditableContent = (elementId: string, content: string): void => {
  const element = document.getElementById(elementId);

  if (element) {
    element.innerText = content;
  }
};

const getEditableElement = (elementId: string): HTMLElement => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  return element;
};

const getCaretOffsetWithin = (element: HTMLElement): number | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const { anchorNode, anchorOffset } = selection;

  if (!anchorNode || !element.contains(anchorNode)) {
    return null;
  }

  const range = document.createRange();
  range.selectNodeContents(element);
  range.setEnd(anchorNode, anchorOffset);

  return range.toString().length;
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
  body, html { margin: 0; padding: 0; font-family: 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; }
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
  const keyContent = getEditableContent('key');
  setEditableContent('key', keyContent.shuffle());
  encryptMessage();
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
  setEditableContent('key', updatedKey);
  return updatedKey;
};

const encryptMessage = (): void => {
  const message = getEditableContent('message');
  const keyInput = getEditableContent('key');
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

  setEditableContent('message-encrypted', encryptedIndices.join(','));
};

const decryptMessage = (): void => {
  const encryptedValues = getEditableContent('message-encrypted').split(',').filter(Boolean);
  const key = getEditableContent('key');

  const decryptedMessage = encryptedValues.reduce((result, value) => {
    const characterIndex = Number.parseInt(value, 10);
    return Number.isNaN(characterIndex) ? result : `${result}${key[characterIndex] ?? ''}`;
  }, '');

  setEditableContent('message-decrypted', decryptedMessage);
  getEditableElement('message-decrypted-title').classList.add('visible');
  getEditableElement('message-decrypted').classList.add('visible');
};

const downloadKeyHtml = (): void => {
  const key = getEditableContent('key');
  const encrypted = getEditableContent('message-encrypted');

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
  const input = event.currentTarget as HTMLElement;
  const caretPosition = getCaretOffsetWithin(input);
  const caretElement = document.getElementById('caret-position');

  if (caretElement) {
    caretElement.innerHTML = `Cursor-Position: ${caretPosition ?? '-'}`;
  }
};

const setupAutoEncryption = (): void => {
  const keyInput = getEditableElement('key');
  const messageInput = getEditableElement('message');

  const autoEncrypt = (): void => encryptMessage();

  ['input', 'change', 'paste'].forEach((eventName) => {
    keyInput.addEventListener(eventName, autoEncrypt);
    messageInput.addEventListener(eventName, autoEncrypt);
  });

  autoEncrypt();
};

window.addEventListener('load', () => {
  const input = getEditableElement('key');

  ['click', 'keyup'].forEach((eventName) => {
    input.addEventListener(eventName, updateCaretPosition);
  });

  setupAutoEncryption();
});

window.shuffleKeyChars = shuffleKeyChars;
window.encryptMessage = encryptMessage;
window.decryptMessage = decryptMessage;
window.downloadKeyHtml = downloadKeyHtml;

console.log('Skript erfolgreich geladen, Funktionen wurden an window angehängt:', {
  encryptMessage: window.encryptMessage,
  decryptMessage: window.decryptMessage,
});


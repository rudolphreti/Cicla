import './styles.scss';

// Extend the Window interface globally
declare global {
  interface Window {
    shuffleKeyChars: () => void;
    encryptMessage: () => void;    // Corrected spelling
    decryptMessage: () => void;    // Corrected spelling
    downloadKeyHtml: () => void;
  }
}
declare global {
  interface String {
    shuffle(): string;
  }
}

// Extend the String prototype with a shuffle method
interface String {
  shuffle: () => string;
}

String.prototype.shuffle = function (): string {
  let a = this.split('');
  let n = a.length;

  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join('');
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const createKeyTableMarkup = (key: string, columns = 25): string => {
  const rows: string[] = [];
  const keyChars = key.split('');

  for (let i = 0; i < keyChars.length; i += columns) {
    const numberCells: string[] = [];
    const characterCells: string[] = [];

    for (let c = 0; c < columns; c++) {
      const index = i + c;
      const cellNumber = index < keyChars.length ? `${index + 1}` : '';
      const cellCharacter = index < keyChars.length ? escapeHtml(keyChars[index]) : '';

      numberCells.push(`<td>${cellNumber}</td>`);
      characterCells.push(`<td class="${cellCharacter ? '' : 'empty'}">${cellCharacter}</td>`);
    }

    rows.push(`<tbody><tr>${numberCells.join('')}</tr><tr>${characterCells.join('')}</tr></tbody>`);
  }

  return rows.join('');
};

const createMessageTableMarkup = (values: string[], columns = 25): string => {
  const rows: string[] = [];

  for (let i = 0; i < values.length; i += columns) {
    const cells: string[] = [];

    for (let c = 0; c < columns; c++) {
      const index = i + c;
      const cellValue = index < values.length ? escapeHtml(values[index]) : '';

      cells.push(`<td class="${cellValue ? '' : 'empty'}">${cellValue}</td>`);
    }

    rows.push(`<tbody><tr>${cells.join('')}</tr></tbody>`);
  }

  return rows.join('');
};

const createNumberTableWithEmptyCells = (values: string[], columns = 25): string => {
  const rows: string[] = [];

  for (let i = 0; i < values.length; i += columns) {
    const numberCells: string[] = [];
    const emptyCells: string[] = [];

    for (let c = 0; c < columns; c++) {
      const index = i + c;
      const cellValue = index < values.length ? escapeHtml(values[index]) : '';

      numberCells.push(`<td class="${cellValue ? '' : 'empty'}">${cellValue}</td>`);
      emptyCells.push('<td class="empty"></td>');
    }

    rows.push(`<tbody><tr>${numberCells.join('')}</tr><tr>${emptyCells.join('')}</tr></tbody>`);
  }

  return rows.join('');
};

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
<h1>Cicla key export</h1>
<h2>Encrypt the message (rozszyfruj wiadomość)</h2>
${
  encryptedMessage
    ? `<table>${createNumberTableWithEmptyCells(encryptedMessage.split(',').filter(Boolean))}</table>`
    : '<p style="margin: 0 1cm 1cm 1cm;">No encrypted message provided</p>'
}
<h2>Key</h2>
<table id="tbl">${createKeyTableMarkup(key)}</table>
</body>
</html>`;

// Function to shuffle key characters
const shuffleKeyChars = (): void => {
  const keyCharsShuffled = document.getElementById('key') as HTMLInputElement;
  keyCharsShuffled.value = keyCharsShuffled.value.shuffle();
};

// Function to encrypt a message
const encryptMessage = (): void => {  // Corrected spelling
  let message = (document.getElementById('message') as HTMLInputElement).value;
  let messageSplit = message.split('');
  let key = (document.getElementById('key') as HTMLInputElement).value;
  let keySplit = key.split('');
  let messageCharSet = Array.from(new Set(messageSplit));
  let keyCharSet = Array.from(new Set(keySplit));

  const missingChars = messageCharSet.filter((mel) => !keyCharSet.includes(mel));

  if (missingChars.length > 0) {
    const shouldAppendMissing = window.confirm(
      `Some characters from the message are missing in the key: ${missingChars.join(', ')}.\n` +
        'Would you like to append the missing characters to the end of the key? Click Cancel to correct the key yourself.'
    );

    if (shouldAppendMissing) {
      key += missingChars.join('');
      keySplit = key.split('');
      keyCharSet = Array.from(new Set(keySplit));
      (document.getElementById('key') as HTMLInputElement).value = key;
    } else {
      return;
    }
  }

  let messageEncrypted: number[] = [];
  messageSplit.forEach((mel, mi) => {
    let stopLoop = false;
    keySplit.forEach((kel, ki) => {
      if (kel === mel && !messageEncrypted.includes(ki) && !stopLoop) {
        messageEncrypted.push(ki);
        stopLoop = true;
      }
    });
  });
  (document.getElementById('message-encrypted') as HTMLInputElement).value = messageEncrypted.join(',');
};

// Function to decrypt a message
const decryptMessage = (): void => {  // Corrected spelling
  let messageEncrypted = (document.getElementById('message-encrypted') as HTMLInputElement).value.split(',');
  let key = (document.getElementById('key') as HTMLInputElement).value;
  let keySplit = key.split('');
  let messageDecrypted = '';

  messageEncrypted.forEach((mel, mi) => {
    messageDecrypted += key[parseInt(mel)];
  });

  (document.getElementById('message-decrypted') as HTMLInputElement).innerText = messageDecrypted;
  (document.getElementById('message-decrypted-title') as HTMLElement).style.display = 'flex';
  (document.getElementById('message-decrypted') as HTMLElement).style.display = 'flex';
};

const downloadKeyHtml = (): void => {
  const key = (document.getElementById('key') as HTMLInputElement).value;
  const encrypted = (document.getElementById('message-encrypted') as HTMLInputElement).value;

  if (!key.trim()) {
    window.alert('Please provide a key before downloading.');
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

// Event listeners
window.addEventListener('load', function () {
  const input = document.getElementById('key') as HTMLInputElement;

  input.addEventListener('click', function () {
    (document.getElementById('caret-position') as HTMLElement).innerHTML = 'Caret position: ' + this.selectionStart;
  });
  input.addEventListener('keyup', function () {
    (document.getElementById('caret-position') as HTMLElement).innerHTML = 'Caret position: ' + this.selectionStart;
  });
});

// Assign functions to the window object
window.shuffleKeyChars = shuffleKeyChars;
window.encryptMessage = encryptMessage;    // Corrected spelling
window.decryptMessage = decryptMessage;    // Corrected spelling
window.downloadKeyHtml = downloadKeyHtml;

console.log("Script loaded successfully, and functions attached to window: ", window.encryptMessage, window.decryptMessage);


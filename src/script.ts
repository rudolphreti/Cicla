import './styles.scss';

// Extend the Window interface globally
declare global {
  interface Window {
    shuffleKeyChars: () => void;
    encryptMessage: () => void;    // Corrected spelling
    decryptMessage: () => void;    // Corrected spelling
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

console.log("Script loaded successfully, and functions attached to window: ", window.encryptMessage, window.decryptMessage);


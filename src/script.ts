// Rozszerzenie interfejsu Window o nasze funkcje
interface Window {
  shuffleKeyChars: () => void;
  encrypteMessage: () => void;
  decrypteMessage: () => void;
}

// Rozszerzenie prototypu String o metodę shuffle
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

// Funkcja do przemieszania znaków klucza
const shuffleKeyChars = (): void => {
  const keyCharsSchufled = document.getElementById('key') as HTMLInputElement;
  keyCharsSchufled.value = keyCharsSchufled.value.shuffle();
};

// Funkcja do szyfrowania wiadomości
const encrypteMessage = (): void => {
  let message = (document.getElementById('message') as HTMLInputElement).value;
  let messageSplit = message.split('');
  let key = (document.getElementById('key') as HTMLInputElement).value;
  let keySplit = key.split('');

  // Usuwanie duplikatów
  let messageCharSet = Array.from(new Set(messageSplit));
  console.log(messageCharSet);
  let keyCharSet = Array.from(new Set(keySplit));
  console.log(keyCharSet);
  messageCharSet.forEach((mel) => {
    if (!keyCharSet.includes(mel)) {
      console.log(`There is no "${mel}" in key!`);
    }
  });

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
  (document.getElementById('message-encrypted') as HTMLInputElement).value =
    messageEncrypted.join(',');
};

// Funkcja do deszyfrowania wiadomości
const decrypteMessage = (): void => {
  let messageEncrypted = (
    document.getElementById('message-encrypted') as HTMLInputElement
  ).value.split(',');
  let key = (document.getElementById('key') as HTMLInputElement).value;
  let keySplit = key.split('');
  let messageDecrypted = '';

  messageEncrypted.forEach((mel, mi) => {
    messageDecrypted += key[parseInt(mel)];
  });

  (document.getElementById('message-decrypted') as HTMLInputElement).innerText =
    messageDecrypted;
  (
    document.getElementById('message-decrypted-title') as HTMLElement
  ).style.display = 'flex';
  (document.getElementById('message-decrypted') as HTMLElement).style.display =
    'flex';
};

// Obsługa zdarzeń na stronie
window.addEventListener('load', function () {
  const input = document.getElementById('key') as HTMLInputElement;

  input.addEventListener('click', function () {
    (document.getElementById('caret-position') as HTMLElement).innerHTML =
      'Caret position: ' + this.selectionStart;
  });
  input.addEventListener('keyup', function () {
    (document.getElementById('caret-position') as HTMLElement).innerHTML =
      'Caret position: ' + this.selectionStart;
  });
});



// Przypisanie funkcji do obiektu window
window.shuffleKeyChars = shuffleKeyChars;
window.encrypteMessage = encrypteMessage;
window.decrypteMessage = decrypteMessage;

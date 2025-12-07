// Encryption logic keeps message/key validation and transforms between text and indices.

import { getEditableContent, getEditableElement, setEditableContent, setKeyUpdateMessage } from '../utils/dom';

const lastKeyWithRequiredCharacters: { value: string } = { value: '' };

const buildCharacterCounts = (text: string): Record<string, number> =>
  text.split('').reduce<Record<string, number>>((counts, character) => {
    const nextCount = (counts[character] ?? 0) + 1;
    return { ...counts, [character]: nextCount };
  }, {});

const hasAllRequiredCharacters = (
  keyCounts: Record<string, number>,
  messageCounts: Record<string, number>
): boolean =>
  Object.entries(messageCounts).every(([character, messageCount]) => (keyCounts[character] ?? 0) >= messageCount);

const ensureKeyHasMessageCharacters = (message: string, key: string): string => {
  const messageCounts = buildCharacterCounts(message);
  const keyCounts = buildCharacterCounts(key);

  const missingChars = Object.entries(messageCounts).flatMap(([character, messageCount]) => {
    const missingCount = messageCount - (keyCounts[character] ?? 0);
    return missingCount > 0 ? Array(missingCount).fill(character) : [];
  });

  if (!missingChars.length) {
    lastKeyWithRequiredCharacters.value = key;
    setKeyUpdateMessage('');
    return key;
  }

  const previousKeyCounts = buildCharacterCounts(lastKeyWithRequiredCharacters.value);
  const hadCompleteKeyBefore = lastKeyWithRequiredCharacters.value
    ? hasAllRequiredCharacters(previousKeyCounts, messageCounts)
    : false;

  if (hadCompleteKeyBefore) {
    window.alert('Tych znaków nie można usunąć z klucza, bo są niezbędne do zakodowania wiadomości!');
    setKeyUpdateMessage('');
    setEditableContent('key', lastKeyWithRequiredCharacters.value);
    return lastKeyWithRequiredCharacters.value;
  }

  const missingCharactersLabel = missingChars.join('');
  const updatedKey = `${key}${missingCharactersLabel}`;
  setEditableContent('key', updatedKey);
  setKeyUpdateMessage(`Fehlende Zeichen am Ende des Schlüssels hinzugefügt: ${missingCharactersLabel}`);
  lastKeyWithRequiredCharacters.value = updatedKey;
  return updatedKey;
};

export const encryptMessage = (): void => {
  const message = getEditableContent('message');
  const keyInput = getEditableContent('key');
  const key = ensureKeyHasMessageCharacters(message, keyInput);

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

export const decryptMessage = (): void => {
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

export const shuffleKeyChars = (): void => {
  const keyContent = getEditableContent('key');
  setEditableContent('key', keyContent.shuffle());
  encryptMessage();
};

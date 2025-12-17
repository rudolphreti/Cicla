// Initialization wires DOM events to encryption helpers.

import { decryptMessage, encryptMessage, shuffleKeyChars } from './logic/encryption';
import { closePrintDialog, downloadKeyHtml, handlePrintDownload, openPrintDialog, updatePrintOptionVisibility } from './logic/download';
import { getCaretOffsetWithin, getEditableElement, refreshEditableCaretColors } from './utils/dom';

export const updateCaretPosition = (event: Event): void => {
  const input = event.currentTarget as HTMLElement;
  const caretPosition = getCaretOffsetWithin(input);
  const caretElement = document.getElementById('caret-position');

  if (caretElement) {
    caretElement.innerHTML = `Cursor-Position: ${caretPosition ?? '-'}`;
  }
};

export const setupAutoEncryption = (): void => {
  const keyInput = getEditableElement('key');
  const messageInput = getEditableElement('message');

  const autoEncrypt = (): void => encryptMessage();

  ['input', 'change', 'paste'].forEach((eventName) => {
    keyInput.addEventListener(eventName, autoEncrypt);
    messageInput.addEventListener(eventName, autoEncrypt);
  });

  autoEncrypt();
};

const applyWordListLineHeight = (value: number): void => {
  const clamped = Math.max(8, Number.isNaN(value) ? 24 : value);
  document.documentElement.style.setProperty('--word-list-line-height', `${clamped}px`);
};

const setupWordListLineHeightControl = (): void => {
  const input = document.getElementById('word-list-line-height') as HTMLInputElement | null;

  if (!input) {
    return;
  }

  const updateLineHeight = (): void => {
    const nextValue = Number.parseInt(input.value, 10);
    applyWordListLineHeight(nextValue);
  };

  input.addEventListener('input', updateLineHeight);
  updateLineHeight();
};

export const setupInitialListeners = (): void => {
  const input = getEditableElement('key');

  ['click', 'keyup'].forEach((eventName) => {
    input.addEventListener(eventName, updateCaretPosition);
  });

  refreshEditableCaretColors();
  window.addEventListener('focus', refreshEditableCaretColors);

  setupAutoEncryption();
  setupWordListLineHeightControl();
};

export const registerWindowHandlers = (): void => {
  window.shuffleKeyChars = shuffleKeyChars;
  window.encryptMessage = encryptMessage;
  window.decryptMessage = decryptMessage;
  window.downloadKeyHtml = downloadKeyHtml;
  window.openPrintDialog = openPrintDialog;
  window.closePrintDialog = closePrintDialog;
  window.handlePrintDownload = handlePrintDownload;
  window.updatePrintOptionVisibility = updatePrintOptionVisibility;
};

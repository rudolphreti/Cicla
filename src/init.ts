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

export const setupInitialListeners = (): void => {
  const input = getEditableElement('key');

  ['click', 'keyup'].forEach((eventName) => {
    input.addEventListener(eventName, updateCaretPosition);
  });

  refreshEditableCaretColors();
  window.addEventListener('focus', refreshEditableCaretColors);

  setupAutoEncryption();
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

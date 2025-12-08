// Initialization wires DOM events to encryption helpers.

import { decryptMessage, encryptMessage, shuffleKeyChars } from './logic/encryption';
import { downloadBlankTablesHtml, downloadKeyHtml } from './logic/download';
import { getCaretOffsetWithin, getEditableElement } from './utils/dom';

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

const PRINT_STORAGE_KEYS = {
  keyRows: 'cicla-print-key-rows',
  messageRows: 'cicla-print-message-rows',
};

const DEFAULT_PRINT_ROWS = 5;

const getNumericInputValue = (inputId: string, fallback: number): number => {
  const input = document.getElementById(inputId) as HTMLInputElement | null;

  if (!input) {
    return fallback;
  }

  const parsed = Number.parseInt(input.value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const persistRowValue = (storageKey: string, value: number): void => {
  window.localStorage.setItem(storageKey, `${value}`);
};

const restoreRowValue = (inputId: string, storageKey: string): void => {
  const input = document.getElementById(inputId) as HTMLInputElement | null;

  if (!input) {
    return;
  }

  const storedValue = window.localStorage.getItem(storageKey);
  const parsed = storedValue ? Number.parseInt(storedValue, 10) : Number.NaN;
  const value = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PRINT_ROWS;

  input.value = `${value}`;
};

const openPrintDialog = (): void => {
  const dialog = document.getElementById('print-dialog');

  if (dialog) {
    dialog.classList.add('visible');
  }
};

const closePrintDialog = (): void => {
  const dialog = document.getElementById('print-dialog');

  if (dialog) {
    dialog.classList.remove('visible');
  }
};

const toggleBlankOptions = (isVisible: boolean): void => {
  const options = document.getElementById('blank-print-options');

  if (options) {
    options.classList.toggle('visible', isVisible);
  }
};

const handlePrintChoiceChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;

  if (target?.name === 'print-option') {
    toggleBlankOptions(target.value === 'blank');
  }
};

const handlePrintFormSubmit = (event: Event): void => {
  event.preventDefault();

  const selectedOption = document.querySelector<HTMLInputElement>('input[name="print-option"]:checked');

  if (selectedOption?.value === 'blank') {
    const messageRows = getNumericInputValue('blank-message-rows', DEFAULT_PRINT_ROWS);
    const keyRows = getNumericInputValue('blank-key-rows', DEFAULT_PRINT_ROWS);

    persistRowValue(PRINT_STORAGE_KEYS.messageRows, messageRows);
    persistRowValue(PRINT_STORAGE_KEYS.keyRows, keyRows);

    downloadBlankTablesHtml(messageRows, keyRows);
  } else {
    downloadKeyHtml();
  }

  closePrintDialog();
};

const setupPrintDialog = (): void => {
  const printButton = document.getElementById('print-button');
  const cancelButton = document.getElementById('print-cancel');
  const form = document.getElementById('print-form');
  const optionFields = document.querySelectorAll<HTMLInputElement>('input[name="print-option"]');

  restoreRowValue('blank-message-rows', PRINT_STORAGE_KEYS.messageRows);
  restoreRowValue('blank-key-rows', PRINT_STORAGE_KEYS.keyRows);

  toggleBlankOptions(
    document.querySelector<HTMLInputElement>('input[name="print-option"]:checked')?.value === 'blank'
  );

  if (printButton) {
    printButton.addEventListener('click', openPrintDialog);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', closePrintDialog);
  }

  form?.addEventListener('submit', handlePrintFormSubmit);

  optionFields.forEach((option) => option.addEventListener('change', handlePrintChoiceChange));
};

export const setupInitialListeners = (): void => {
  const input = getEditableElement('key');

  ['click', 'keyup'].forEach((eventName) => {
    input.addEventListener(eventName, updateCaretPosition);
  });

  setupAutoEncryption();
  setupPrintDialog();
};

export const registerWindowHandlers = (): void => {
  window.shuffleKeyChars = shuffleKeyChars;
  window.encryptMessage = encryptMessage;
  window.decryptMessage = decryptMessage;
  window.downloadKeyHtml = downloadKeyHtml;
};

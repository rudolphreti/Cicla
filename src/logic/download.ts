// Download helpers generate printable HTML markup and open it for export.

import { getEditableContent } from '../utils/dom';
import {
  createEmptyKeyTableMarkup,
  createEmptyMessageTableMarkup,
  createKeyTableMarkup,
  createNumberTableWithEmptyCells,
} from '../utils/table';

const buildDocumentFrame = (title: string, content: string): string => `<!DOCTYPE html>\
<html>\
<head>\
<meta charset="UTF-8">\
<title>${title}</title>\
<style>\
  @page { margin: 1cm; }\
  body, html { margin: 0; padding: 0; font-family: 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; }\
  h1, h2 { margin: 16px 1cm 0.4cm 1cm; }\
  p { margin: 0 1cm 0.2cm 1cm; }\
  pre { margin: 0 1cm 1cm 1cm; white-space: pre-wrap; word-break: break-word; }\
  table { border-collapse: collapse; width: auto; margin: 0 1cm 1cm 1cm; }\
  tbody { page-break-inside: avoid; }\
  td { border: 1px solid black; width: 1cm; height: 1cm; padding: 0; margin: 0; text-align: center; font-size: 12pt; line-height: 1cm; }\
  .empty { font-size: 0; line-height: 0; }\
  .number-row td { background-color: #f5f5f5; }\
  .number-cell.decade-cell { background-color: #e0e0e0; }\
  @media print {\
    .number-row td,\
    .number-cell.decade-cell {\
      -webkit-print-color-adjust: exact;\
      print-color-adjust: exact;\
    }\
\
    .number-row td { background-color: #f5f5f5 !important; }\
    .number-cell.decade-cell { background-color: #e0e0e0 !important; }\
  }\
</style>\
</head>\
<body>\
${content}\
</body>\
</html>`;

export const buildDownloadableHtml = (key: string, encryptedMessage: string): string =>
  buildDocumentFrame(
    'cicla-key',
    `<h2>Nachricht entschlüsseln</h2>\
${
  encryptedMessage
    ? `<table>${createNumberTableWithEmptyCells(encryptedMessage.split(',').filter(Boolean))}</table>`
    : '<p style="margin: 0 1cm 1cm 1cm;">Keine verschlüsselte Nachricht angegeben</p>'
}\
<h2>Schlüssel</h2>\
<table id="tbl">${createKeyTableMarkup(key)}</table>`
  );

export const buildEmptyTablesHtml = (messageRowPairs: number, keyRowPairs: number): string => {
  const clampedMessageRows = Math.max(1, messageRowPairs);
  const clampedKeyRows = Math.max(1, keyRowPairs);

  const messageTable = createEmptyMessageTableMarkup(clampedMessageRows);
  const keyTable = createEmptyKeyTableMarkup(clampedKeyRows);

  return buildDocumentFrame(
    'cicla-key-empty',
    `<h2>Nachricht</h2><table>${messageTable}</table><h2>Schlüssel</h2><table>${keyTable}</table>`
  );
};

export const openPdfPreview = (markup: string): void => {
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    window.alert('PDF konnte nicht geöffnet werden. Bitte Pop-up-Blocker deaktivieren.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(markup);
  printWindow.document.close();
  printWindow.document.title = 'cicla-key';

  const triggerPrint = (): void => {
    printWindow.focus();
    printWindow.print();
  };

  if (printWindow.document.readyState === 'complete') {
    triggerPrint();
  } else {
    printWindow.onload = triggerPrint;
  }
};

export const downloadKeyHtml = (): boolean => {
  const key = getEditableContent('key');
  const encrypted = getEditableContent('message-encrypted');

  if (!key.trim()) {
    window.alert('Bitte geben Sie einen Schlüssel an, bevor Sie ihn herunterladen.');
    return false;
  }

  const markup = buildDownloadableHtml(key, encrypted);
  openPdfPreview(markup);
  return true;
};

const getNumberInputValue = (inputId: string, fallbackValue: number): number => {
  const element = document.getElementById(inputId) as HTMLInputElement | null;
  const value = Number.parseInt(element?.value ?? '', 10);

  if (Number.isNaN(value) || value < 1) {
    return fallbackValue;
  }

  return value;
};

export const handlePrintDownload = (): void => {
  const selectedOption = document.querySelector<HTMLInputElement>('input[name="print-option"]:checked');
  const option = selectedOption?.value ?? 'filled';

  if (option === 'blank') {
    const messageRows = getNumberInputValue('print-message-rows', 5);
    const keyRows = getNumberInputValue('print-key-rows', 5);
    const markup = buildEmptyTablesHtml(messageRows, keyRows);
    openPdfPreview(markup);
    closePrintDialog();
    return;
  }

  if (downloadKeyHtml()) {
    closePrintDialog();
  }
};

export const updatePrintOptionVisibility = (): void => {
  const selectedOption = document.querySelector<HTMLInputElement>('input[name="print-option"]:checked');
  const isBlankOption = selectedOption?.value === 'blank';
  const blankOptions = document.getElementById('blank-print-options');

  if (blankOptions) {
    blankOptions.classList.toggle('visible', isBlankOption);
  }
};

export const openPrintDialog = (): void => {
  const dialog = document.getElementById('print-dialog');

  if (dialog) {
    dialog.classList.add('visible');
    updatePrintOptionVisibility();
  }
};

export const closePrintDialog = (): void => {
  const dialog = document.getElementById('print-dialog');

  if (dialog) {
    dialog.classList.remove('visible');
  }
};

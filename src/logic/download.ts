// Download helpers generate printable HTML markup and open it for export.

import { getEditableContent } from '../utils/dom';
import {
  createEmptyMessageTableMarkup,
  createKeyTableMarkup,
  createNumberTableWithEmptyCells,
  createNumberedEmptyKeyTableMarkup,
} from '../utils/table';

const PRINT_STYLES = `
  @page { margin: 1cm; }
  body, html { margin: 0; padding: 0; font-family: 'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif; }
  h1, h2 { margin: 16px 1cm 0.4cm 1cm; }
  p { margin: 0 1cm 0.2cm 1cm; }
  pre { margin: 0 1cm 1cm 1cm; white-space: pre-wrap; word-break: break-word; }
  table { border-collapse: collapse; width: auto; margin: 0 1cm 1cm 1cm; }
  tbody { page-break-inside: avoid; }
  td { border: 1px solid black; width: 1cm; height: 1cm; padding: 0; margin: 0; text-align: center; font-size: 12pt; line-height: 1cm; }
  .empty { font-size: 0; line-height: 0; }
  .number-row td { background-color: #f5f5f5; }
  .number-cell.decade-cell { background-color: #e0e0e0; }
  @media print {
    .number-row td,
    .number-cell.decade-cell {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .number-row td { background-color: #f5f5f5 !important; }
    .number-cell.decade-cell { background-color: #e0e0e0 !important; }
  }
`;

export const buildDownloadableHtml = (key: string, encryptedMessage: string): string => `<!DOCTYPE html>\
<html>\
<head>\
<meta charset="UTF-8">\
<style>${PRINT_STYLES}</style>\
</head>\
<body>\
<h2>Nachricht entschlüsseln</h2>\
${
  encryptedMessage
    ? `<table>${createNumberTableWithEmptyCells(encryptedMessage.split(',').filter(Boolean))}</table>`
    : '<p style="margin: 0 1cm 1cm 1cm;">Keine verschlüsselte Nachricht angegeben</p>'
}\
<h2>Schlüssel</h2>\
<table id="tbl">${createKeyTableMarkup(key)}</table>\
</body>\
</html>`;

export const buildBlankTablesHtml = (messageRows: number, keyRows: number): string => {
  const sanitizedMessageRows = Math.max(messageRows, 1);
  const sanitizedKeyRows = Math.max(keyRows, 1);

  return `<!DOCTYPE html>\
<html>\
<head>\
<meta charset="UTF-8">\
<style>${PRINT_STYLES}</style>\
</head>\
<body>\
<h2>Nachricht</h2>\
<table>${createEmptyMessageTableMarkup(sanitizedMessageRows)}</table>\
<h2>Schlüssel</h2>\
<table>${createNumberedEmptyKeyTableMarkup(sanitizedKeyRows)}</table>\
</body>\
</html>`;
};

export const openPdfPreview = (markup: string): void => {
  const iframe = document.createElement('iframe');

  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentDocument;

  if (!iframeDocument) {
    iframe.remove();
    window.alert('PDF konnte nicht geöffnet werden. Bitte Pop-up-Blocker deaktivieren.');
    return;
  }

  iframeDocument.open();
  iframeDocument.write(markup);
  iframeDocument.close();
  iframeDocument.title = 'cicla-key';

  let hasPrinted = false;

  const triggerPrint = (): void => {
    if (hasPrinted) return;

    hasPrinted = true;
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  };

  if (iframeDocument.readyState === 'complete') {
    triggerPrint();
  } else {
    iframe.onload = triggerPrint;
  }

  iframe.contentWindow?.addEventListener('afterprint', () => {
    iframe.remove();
  });
};

export const downloadKeyHtml = (): void => {
  const key = getEditableContent('key');
  const encrypted = getEditableContent('message-encrypted');

  if (!key.trim()) {
    window.alert('Bitte geben Sie einen Schlüssel an, bevor Sie ihn herunterladen.');
    return;
  }

  const markup = buildDownloadableHtml(key, encrypted);
  openPdfPreview(markup);
};

export const downloadBlankTablesHtml = (messageRows: number, keyRows: number): void => {
  const markup = buildBlankTablesHtml(messageRows, keyRows);
  openPdfPreview(markup);
};

// Entry point attaches helpers to the window and bootstraps event listeners.

import './styles.scss';
import './utils/string';
import { registerWindowHandlers, setupInitialListeners } from './init';

declare global {
  interface Window {
    shuffleKeyChars: () => void;
    encryptMessage: () => void;
    decryptMessage: () => void;
    downloadKeyHtml: () => void;
    openPrintDialog: () => void;
    closePrintDialog: () => void;
    handlePrintDownload: () => void;
    updatePrintOptionVisibility: () => void;
  }
}

window.addEventListener('load', () => {
  setupInitialListeners();
});

registerWindowHandlers();

console.log('Skript erfolgreich geladen, Funktionen wurden an window angehängt:', {
  encryptMessage: window.encryptMessage,
  decryptMessage: window.decryptMessage,
});

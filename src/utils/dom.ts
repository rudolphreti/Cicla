// DOM helpers centralize editable element access and caret calculations.

export const getEditableContent = (elementId: string): string => {
  const element = document.getElementById(elementId);
  return element?.innerText ?? '';
};

export const setEditableContent = (elementId: string, content: string): void => {
  const element = document.getElementById(elementId);

  if (element) {
    element.innerText = content;
  }
};

export const setKeyUpdateMessage = (message: string): void => {
  const element = document.getElementById('key-update-message');

  if (element) {
    element.textContent = message;
  }
};

export const getEditableElement = (elementId: string): HTMLElement => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  return element;
};

export const getCaretOffsetWithin = (element: HTMLElement): number | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const { anchorNode, anchorOffset } = selection;

  if (!anchorNode || !element.contains(anchorNode)) {
    return null;
  }

  const range = document.createRange();
  range.selectNodeContents(element);
  range.setEnd(anchorNode, anchorOffset);

  return range.toString().length;
};

const insertPlainTextAtSelection = (text: string): void => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  selection.deleteFromDocument();

  const range = selection.getRangeAt(0);
  const textNode = document.createTextNode(text);

  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);

  selection.removeAllRanges();
  selection.addRange(range);
};

export const enforcePlainTextEditing = (element: HTMLElement): void => {
  element.addEventListener('paste', (event: ClipboardEvent) => {
    event.preventDefault();

    const text = event.clipboardData?.getData('text/plain') ?? '';
    insertPlainTextAtSelection(text);
  });

  element.addEventListener('drop', (event: DragEvent) => {
    event.preventDefault();
    element.focus();

    const selection = window.getSelection();

    if (selection && selection.rangeCount === 0) {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const text = event.dataTransfer?.getData('text/plain') ?? '';
    insertPlainTextAtSelection(text);
  });

  element.addEventListener('dragover', (event) => event.preventDefault());
};

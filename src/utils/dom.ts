// DOM helpers centralize editable element access and caret calculations.

export const getEditableContent = (elementId: string): string => {
  const element = document.getElementById(elementId);

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  return element?.textContent ?? '';
};

export const setEditableContent = (elementId: string, content: string): void => {
  const element = document.getElementById(elementId);

  if (element) {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = content;
      return;
    }

    element.textContent = content;
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
    throw new Error(`Element mit der ID "${elementId}" wurde nicht gefunden.`);
  }

  return element;
};

const setCaretColorFromComputed = (element: HTMLElement): void => {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const computedColor = getComputedStyle(element).color;
    element.style.caretColor = computedColor;
  }
};

export const refreshEditableCaretColors = (): void => {
  const editableElements = document.querySelectorAll<HTMLElement>('.editable-area');

  editableElements.forEach(setCaretColorFromComputed);
};

export const getCaretOffsetWithin = (element: HTMLElement): number | null => {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.selectionStart ?? null;
  }

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

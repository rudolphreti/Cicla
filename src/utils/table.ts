// Table helpers produce HTML markup for key and message visualizations.

import { escapeHtml } from './string';

export const chunkArray = <T>(values: T[], size = 25): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }

  return chunks;
};

const renderCells = (
  values: string[],
  columns: number,
  render: (value: string, index: number) => string
): string =>
  chunkArray(values, columns)
    .map((chunk) =>
      `<tbody><tr>${Array.from({ length: columns }, (_, columnIndex) => {
        const value = chunk[columnIndex];
        return render(value ?? '', columnIndex);
      }).join('')}</tr></tbody>`
    )
    .join('');

export const createKeyTableMarkup = (key: string, columns = 20, cellCount?: number): string => {
  const keyChars = key.split('');
  const targetLength = cellCount ?? keyChars.length;
  const normalizedKeyChars = keyChars.concat(Array(Math.max(targetLength - keyChars.length, 0)).fill(''));

  return chunkArray(normalizedKeyChars, columns)
    .map((chunk, chunkIndex) => {
      const rowNumberCells = Array.from({ length: columns }, (_, index) => {
        const cellIndex = chunkIndex * columns + index;
        const cellNumber = cellIndex < targetLength ? `${cellIndex}` : '';

        const classes = ['number-cell'];
        const parsedNumber = Number.parseInt(cellNumber, 10);

        if (!cellNumber) {
          classes.push('empty');
        }

        if (!Number.isNaN(parsedNumber) && parsedNumber % 10 === 0) {
          classes.push('decade-cell');
        }

        return `<td class="${classes.join(' ')}">${cellNumber}</td>`;
      }).join('');

      const characterCells = chunk
        .concat(Array(columns - chunk.length).fill(''))
        .map((character) => {
          const escapedCharacter = character ? escapeHtml(character) : '';
          const classes = escapedCharacter ? '' : 'empty';
          return `<td class="${classes}">${escapedCharacter}</td>`;
        })
        .join('');

      return `<tbody><tr class="number-row">${rowNumberCells}</tr><tr>${characterCells}</tr></tbody>`;
    })
    .join('');
};

export const createMessageTableMarkup = (values: string[], columns = 20): string =>
  renderCells(values, columns, (value) => {
    const escapedValue = value ? escapeHtml(value) : '';
    const classes = escapedValue ? '' : 'empty';
    return `<td class="${classes}">${escapedValue}</td>`;
  });

export const createNumberedEmptyMessageTableMarkup = (rows: number, columns = 20): string => {
  const safeRows = Math.max(rows, 1);

  return createKeyTableMarkup('', columns, safeRows * columns);
};

export const createNumberedEmptyKeyTableMarkup = (rows: number, columns = 20): string => {
  const safeRows = Math.max(rows, 1);

  return createKeyTableMarkup('', columns, safeRows * columns);
};

export const createNumberTableWithEmptyCells = (values: string[], columns = 20): string =>
  chunkArray(values, columns)
    .map((chunk) => {
      const numberCells = chunk
        .concat(Array(columns - chunk.length).fill(''))
        .map((value) => {
          const escapedValue = value ? escapeHtml(value) : '';
          const parsedNumber = Number.parseInt(value, 10);
          const classes = ['number-cell'];

          if (!escapedValue) {
            classes.push('empty');
          }

          if (!Number.isNaN(parsedNumber) && parsedNumber % 10 === 0) {
            classes.push('decade-cell');
          }

          return `<td class="${classes.join(' ')}">${escapedValue}</td>`;
        })
        .join('');

      const emptyCells = Array.from({ length: columns }, () => '<td class="empty"></td>').join('');

      return `<tbody><tr class="number-row">${numberCells}</tr><tr>${emptyCells}</tr></tbody>`;
    })
    .join('');

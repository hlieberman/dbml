export interface Position {
  offset: number;
  line: number;
  column: number;
}

export function offsetToPosition (source: string, offset: number): Position {
  let line = 1;
  let col = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { offset, line, column: col };
}

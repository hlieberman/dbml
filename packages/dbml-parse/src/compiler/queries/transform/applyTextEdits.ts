import { offsetToPosition } from '@/core/types/position';
import type { Position } from '@/core/types/position';

export interface TextEdit {
  start: number;
  end: number;
  newText: string;
}

export interface PositionTextEdit {
  newText: string;
  startPos: Position;
  endPos: Position;
}

export function toPositionTextEdit (edit: TextEdit, source: string): PositionTextEdit {
  return {
    newText: edit.newText,
    startPos: offsetToPosition(source, edit.start),
    endPos: offsetToPosition(source, edit.end),
  };
}

/**
 * Applies a sequence of text edits to a source string.
 *
 * @param source - The original source string
 * @param edits - Array of text edits to apply
 * @returns The modified source string with all edits applied
 */
export function applyTextEdits (source: string, edits: TextEdit[], sorted = false): string {
  const sortedEdits = sorted
    ? edits
    : [
        ...edits,
      ].sort((a, b) => b.start - a.start);

  let result = source;
  for (const {
    start, end, newText,
  } of sortedEdits) {
    result = result.substring(0, start) + newText + result.substring(end);
  }

  return result;
}

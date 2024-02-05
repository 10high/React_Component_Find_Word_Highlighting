export type Props = {
  inputValue: string;
  selectionPositions: number[];
  wordToHighlight: string;
};

export type TagData = [string, string, number];

export type PairedTagData = [TagData, TagData];

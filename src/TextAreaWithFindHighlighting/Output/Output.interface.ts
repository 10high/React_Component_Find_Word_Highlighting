export type Props = {
  inputValue: string;
  selectionPositions: number[];
  wordToHighlight: string;
  isCaseSensitive: boolean;
  textSelectionStyling: { color: string; backgroundColor: string };
  wordFindHighlightingStyling: { color: string };
  useRegularExpression: boolean;
  scrollTop: number;
};

export type TagData = [string, string, number];

export type PairedTagData = [TagData, TagData];

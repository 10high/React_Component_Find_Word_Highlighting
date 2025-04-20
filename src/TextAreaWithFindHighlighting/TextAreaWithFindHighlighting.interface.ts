export type Props = {
  wordsToHighlight: string[];
  isCaseSensitive: boolean;
  textAreaFormDataName: string;
  useRegularExpression: boolean;
};

export type ChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;

export type PointerEvent = React.PointerEvent<HTMLTextAreaElement>;

export type SyntheticEvent = React.SyntheticEvent<HTMLTextAreaElement, Event>;

export type ScrollEvent = React.UIEvent<HTMLTextAreaElement, UIEvent>;

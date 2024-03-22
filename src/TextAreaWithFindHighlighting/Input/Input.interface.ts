export type Props = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>;
};

export type ChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;

export type KeyEvent = React.KeyboardEvent<HTMLTextAreaElement>;

export type PointerEvent = React.PointerEvent<HTMLTextAreaElement>;

export type SyntheticEvent = React.SyntheticEvent<HTMLTextAreaElement, Event>;
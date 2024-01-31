export type Props = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export type Event = React.ChangeEvent<HTMLTextAreaElement>;

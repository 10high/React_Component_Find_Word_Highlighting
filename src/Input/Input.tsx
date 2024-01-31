import styles from "./Input.module.css";
import { useRef } from "react";
import { Props, ChangeEvent, KeyEvent } from "./Input.interface";

const keyCodes = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "End",
  "Home",
]);

function Input({ inputValue, setInputValue, setSelectionPositions }: Props) {
  const inputEl = useRef<HTMLTextAreaElement>(null);

  function handleKeyPress(event: KeyEvent) {
    if (keyCodes.has(event.key)) {
      setSelectionPositions([
        inputEl.current!.selectionStart,
        inputEl.current!.selectionEnd,
      ]);
    }
  }

  function handleOnChange(event: ChangeEvent) {
    setInputValue(event.target.value);
    setSelectionPositions([
      inputEl.current!.selectionStart,
      inputEl.current!.selectionEnd,
    ]);
  }

  return (
    <textarea
      cols={40}
      rows={2}
      value={inputValue}
      onChange={(event) => handleOnChange(event)}
      onKeyDown={(event) => handleKeyPress(event)}
      onKeyUp={(event) => handleKeyPress(event)}
      className={styles.input}
      ref={inputEl}
    />
  );
}

export default Input;

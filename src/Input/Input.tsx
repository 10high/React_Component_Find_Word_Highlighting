import styles from "./Input.module.css";
import { useRef, useState } from "react";
import {
  Props,
  ChangeEvent,
  KeyEvent,
  PointerEvent,
  SyntheticEvent,
} from "./Input.interface";

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
  const [mouseIsDown, setMouseIsDown] = useState(false);
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

  function handlePointerMove(event: PointerEvent) {
    if (mouseIsDown) {
      const target = event.target as HTMLTextAreaElement;
      setSelectionPositions([target.selectionStart, target.selectionEnd]);
    }
  }

  function handleOnSelect(event: SyntheticEvent) {
    const target = event.target as HTMLTextAreaElement;
    setSelectionPositions([target.selectionStart, target.selectionEnd]);
  }

  return (
    <textarea
      cols={40}
      rows={2}
      value={inputValue}
      onChange={(event) => handleOnChange(event)}
      onKeyDown={(event) => handleKeyPress(event)}
      onKeyUp={(event) => handleKeyPress(event)}
      onPointerDown={() => setMouseIsDown(true)}
      onPointerUp={() => setMouseIsDown(false)}
      onPointerMove={(event) => handlePointerMove(event)}
      onSelect={(event) => handleOnSelect(event)}
      className={styles.input}
      ref={inputEl}
    />
  );
}

export default Input;

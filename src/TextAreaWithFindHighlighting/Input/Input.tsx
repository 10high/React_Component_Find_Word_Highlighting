import styles from "./Input.module.css";
import { useState } from "react";
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

function Input({
  inputValue,
  setInputValue,
  setSelectionPositions,
  textAreaFormDataName,
}: Props) {
  const [mouseIsDown, setMouseIsDown] = useState(false);

  function handleKeyPress(event: KeyEvent) {
    if (keyCodes.has(event.key)) {
      const target = event.target as HTMLTextAreaElement;
      setSelectionPositions([target.selectionStart, target.selectionEnd]);
    }
  }

  function handleOnChange(event: ChangeEvent) {
    const target = event.target as HTMLTextAreaElement;
    setInputValue(target.value);
    setSelectionPositions([target.selectionStart, target.selectionEnd]);
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
      name={textAreaFormDataName}
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
      onBlur={() => setSelectionPositions([])}
      className={styles.input}
    />
  );
}

export default Input;

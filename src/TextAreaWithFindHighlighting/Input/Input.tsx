import styles from "./Input.module.css";
import { memo, useState } from "react";
import { Props } from "./Input.interface";
import {
  handleKeyPress,
  handleOnChange,
  handlePointerMove,
  handleOnSelect,
  handleOnScroll,
} from "./utils";

const Input = memo(function Input({
  inputValue,
  setInputValue,
  setSelectionPositions,
  textAreaFormDataName,
  setScrollTop,
}: Props) {
  const [mouseIsDown, setMouseIsDown] = useState(false);

  return (
    <textarea
      name={textAreaFormDataName}
      cols={40}
      rows={2}
      value={inputValue}
      onChange={(event) =>
        handleOnChange(event, setSelectionPositions, setInputValue)
      }
      onKeyDown={(event) => handleKeyPress(event, setSelectionPositions)}
      onKeyUp={(event) => handleKeyPress(event, setSelectionPositions)}
      onPointerDown={() => setMouseIsDown(true)}
      onPointerUp={() => setMouseIsDown(false)}
      onPointerMove={(event) =>
        handlePointerMove(event, mouseIsDown, setSelectionPositions)
      }
      onSelect={(event) => handleOnSelect(event, setSelectionPositions)}
      onBlur={() => setSelectionPositions([])}
      onScroll={(event) => handleOnScroll(event, setScrollTop)}
      className={styles.input}
    />
  );
});

export default Input;

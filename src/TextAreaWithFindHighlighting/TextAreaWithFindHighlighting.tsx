import styles from "./TextAreaWithFindHighlighting.module.css";
import { useState } from "react";

import Input from "../Input/Input";
import Output from "../Output/Output";

import { Props } from "./TextAreaWithFindHighlighting.interface";

export default function TextAreaWithFindHighlighting({
  wordToHighlight = "test",
  isCaseSensitive = false,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [selectionPositions, setSelectionPositions] = useState([0, 0]);
  return (
    <div className={styles.container}>
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        setSelectionPositions={setSelectionPositions}
      />
      <Output
        inputValue={inputValue}
        selectionPositions={selectionPositions}
        wordToHighlight={wordToHighlight}
      />
    </div>
  );
}

import styles from "./TextAreaWithFindHighlighting.module.css";
import { useState } from "react";
import Input from "./Input/Input";
import Output from "./Output/Output";
import { Props } from "./TextAreaWithFindHighlighting.interface";

const configureStyles = {
  textArea: {
    margin: "8px",
    padding: "8px",
    border: "solid 1px black",
    borderRadius: "0px",
    lineHeight: "1.2",
    fontSize: "1rem",
    width: "50%",
    height: "200px",
  },
  textSelection: {
    color: "white",
    backgroundColor: "cornflowerblue",
  },
  wordFindHighlighting: {
    color: "red",
  },
};

export default function TextAreaWithFindHighlighting({
  wordToHighlight = "test",
  isCaseSensitive = false,
  textAreaFormDataName = "findWordTextArea",
  useRegularExpression = true,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [selectionPositions, setSelectionPositions] = useState([0, 0]);
  return (
    <div
      style={configureStyles.textArea}
      className={styles.container}
      tabIndex={0}
    >
      <Input
        inputValue={inputValue}
        setInputValue={setInputValue}
        setSelectionPositions={setSelectionPositions}
        textAreaFormDataName={textAreaFormDataName}
      />
      <Output
        inputValue={inputValue}
        selectionPositions={selectionPositions}
        wordToHighlight={wordToHighlight}
        isCaseSensitive={isCaseSensitive}
        textSelectionStyling={configureStyles.textSelection}
        wordFindHighlightingStyling={configureStyles.wordFindHighlighting}
        useRegularExpression={useRegularExpression}
      />
    </div>
  );
}

import styles from "./TextAreaWithFindHighlighting.module.css";
import { memo, useMemo, useRef, useState } from "react";
import Output from "./Output/Output";
import { Props } from "./TextAreaWithFindHighlighting.interface";
import {
  handleOnChange,
  handlePointerMove,
  handleOnSelect,
  handleOnScroll,
} from "./utils";

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
    color: ["red"],
  },
};

const TextAreaWithFindHighlighting = memo(
  function TextAreaWithFindHighlighting({
    wordsToHighlight = ["test"],
    isCaseSensitive = false,
    textAreaFormDataName = "findWordTextArea",
    useRegularExpression = true,
  }: Props) {
    const [inputValue, setInputValue] = useState("");
    const [selectionPositions, setSelectionPositions] = useState([0, 0]);
    const [scrollTop, setScrollTop] = useState(0);
    const [mouseIsDown, setMouseIsDown] = useState(false);

    const ignoreSelectRef = useRef(false);

    const wordFindHighlightingStyling = useMemo(() => {
      return configureStyles.wordFindHighlighting;
    }, []);

    const textSelectionStyling = useMemo(() => {
      return configureStyles.textSelection;
    }, []);

    const memoSelectionPositions = useMemo(() => {
      return selectionPositions;
    }, [selectionPositions]);

    return (
      <div
        style={configureStyles.textArea}
        className={styles.container}
        tabIndex={0}
      >
        <textarea
          name={textAreaFormDataName}
          cols={40}
          rows={2}
          onChange={(event) =>
            handleOnChange(
              event,
              setSelectionPositions,
              setInputValue,
              ignoreSelectRef
            )
          }
          onPointerDown={() => setMouseIsDown(true)}
          onPointerUp={() => setMouseIsDown(false)}
          onPointerMove={(event) =>
            handlePointerMove(event, mouseIsDown, setSelectionPositions)
          }
          onSelect={(event) =>
            handleOnSelect(
              event,
              setSelectionPositions,
              ignoreSelectRef.current
            )
          }
          onBlur={() => setSelectionPositions([])}
          onScroll={(event) => handleOnScroll(event, setScrollTop)}
          className={styles.input}
        />
        <Output
          inputValue={inputValue}
          selectionPositions={memoSelectionPositions}
          wordsToHighlight={wordsToHighlight}
          isCaseSensitive={isCaseSensitive}
          textSelectionStyling={textSelectionStyling}
          wordFindHighlightingStyling={wordFindHighlightingStyling}
          useRegularExpression={useRegularExpression}
          scrollTop={scrollTop}
        />
      </div>
    );
  }
);

export default TextAreaWithFindHighlighting;

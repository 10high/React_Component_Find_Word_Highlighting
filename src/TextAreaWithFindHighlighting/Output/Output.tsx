import styles from "./Output.module.css";
import { Props, PairedTagData } from "./Output.interface";
import { memo, useEffect, useRef, useState } from "react";
import {
  applyTagTypeStyle,
  testHighlightStyles,
  getWordsToHighlight,
  getClosedHighlightTags,
  getSegmentsWithTags,
  getTaggedSegmentsInPairs,
  getPlainText,
} from "./utils";

const Output = memo(function Output({
  inputValue,
  selectionPositions,
  wordsToHighlight,
  isCaseSensitive,
  textSelectionStyling,
  wordFindHighlightingStyling,
  useRegularExpression,
  scrollTop,
}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectStart] = selectionPositions;
  const inputValueAsArr = inputValue.split("");
  const toDisplay = [];
  const flipCursorBlinkAnim = useRef(true);
  const outputElement = useRef<HTMLParagraphElement>(null);

  testHighlightStyles(wordFindHighlightingStyling, setErrorMessage);

  const tagData = getWordsToHighlight(
    wordsToHighlight,
    inputValue,
    useRegularExpression,
    isCaseSensitive,
    setErrorMessage
  );
  tagData.sort((a, b) => a[2] - b[2]);

  const closedHighlightTags = getClosedHighlightTags(
    tagData,
    selectionPositions
  );
  closedHighlightTags.sort((a, b) => a[2] - b[2]);

  const segmentsWithTags = getSegmentsWithTags(closedHighlightTags);
  const taggedSegmentsInPairs = getTaggedSegmentsInPairs(segmentsWithTags);
  const allSegments = [
    ...taggedSegmentsInPairs,
    ...getPlainText(taggedSegmentsInPairs, inputValue),
  ];
  allSegments.sort((a, b) => a[0][2] - b[0][2]);
  toDisplay.push(...allSegments);

  const constructElement = (
    tagType: string,
    openIndex: number,
    closeIndex: number
  ) => {
    if (tagType === "cursor") {
      return (
        <span
          id="caret"
          key="caretUniqueKey"
          className={
            flipCursorBlinkAnim.current === true
              ? `${styles.blinking__cursor1}`
              : `${styles.blinking__cursor2}`
          }
        ></span>
      );
    } else {
      const content = inputValueAsArr.slice(openIndex, closeIndex).join("");
      return (
        <span
          key={`${content}${openIndex}${closeIndex}`}
          style={applyTagTypeStyle(
            tagType,
            textSelectionStyling,
            wordFindHighlightingStyling
          )}
        >
          {content}
        </span>
      );
    }
  };

  useEffect(() => {
    flipCursorBlinkAnim.current =
      flipCursorBlinkAnim.current === true ? false : true;
  }, [selectStart]);

  useEffect(() => {
    if (!outputElement.current) return;
    outputElement.current.scrollTop = scrollTop;
  }, [scrollTop]);

  return (
    <p ref={outputElement} className={styles.output}>
      {errorMessage.length ? (
        <span className={styles.errorMessage}>{errorMessage}</span>
      ) : (
        toDisplay.map((segment: PairedTagData) => {
          const [[, tagType, openIndex], [, , closeIndex]] = segment;
          return constructElement(tagType, openIndex, closeIndex);
        })
      )}
    </p>
  );
});

export default Output;

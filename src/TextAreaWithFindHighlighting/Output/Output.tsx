import styles from "./Output.module.css";
import { Props, TagData, PairedTagData } from "./Output.interface";
import { memo, useEffect, useRef, useState } from "react";
import {
  applyTagTypeStyle,
  testHighlightStyles,
  getWordsToHighlight,
  getClosedHighlightTags,
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
  const [selectStart, selectEnd] = selectionPositions;
  const inputValueAsArr = inputValue.split("");
  const segmentsWithTags: TagData[] = [];
  const tagData: TagData[] = [];
  const closedHighlightTags: TagData[] = [];
  const toDisplay = [];
  const flipCursorBlinkAnim = useRef(true);
  const outputElement = useRef<HTMLParagraphElement>(null);

  testHighlightStyles(wordFindHighlightingStyling, setErrorMessage);

  tagData.push(
    ...getWordsToHighlight(
      wordsToHighlight,
      inputValue,
      useRegularExpression,
      isCaseSensitive,
      setErrorMessage
    )
  );

  tagData.sort((a, b) => a[2] - b[2]);

  closedHighlightTags.push(
    ...getClosedHighlightTags(tagData, selectionPositions)
  );
  closedHighlightTags.sort((a, b) => a[2] - b[2]);

  //Now close/open highlight tags with nested selection or cursor tags
  let currentTagIndex = 0;
  while (currentTagIndex < closedHighlightTags.length) {
    const currentTagData = closedHighlightTags[currentTagIndex];
    const [, prevTagType, prevTagIndex] = segmentsWithTags.at(-1) || [
      "",
      "",
      -1,
    ];
    const [tag, tagType] = currentTagData;
    const [, nextTagType, nextTagIndex] = closedHighlightTags[
      currentTagIndex + 1
    ] || ["", "", -1];

    if (tagType === "select") {
      const closeSelectIndex = closedHighlightTags.findLastIndex(
        (tag: TagData) => {
          const [, tagType] = tag;
          return tagType === "select";
        }
      );
      segmentsWithTags.push(
        [...currentTagData],
        [...closedHighlightTags[closeSelectIndex]]
      );
      currentTagIndex = closeSelectIndex + 1;
      continue;
    }

    if (tag === "open" && tagType !== "cursor" && nextTagType === "cursor") {
      segmentsWithTags.push(
        [...currentTagData],
        ["close", tagType, nextTagIndex]
      );
      closedHighlightTags.splice(currentTagIndex + 3, 0, [
        "open",
        tagType,
        nextTagIndex,
      ]);
      currentTagIndex++;
      continue;
    }

    if (tag === "open" && tagType !== nextTagType) {
      segmentsWithTags.push(
        [...currentTagData],
        ["close", tagType, nextTagIndex]
      );
      currentTagIndex++;
      continue;
    }

    if (tag === "close" && tagType !== prevTagType) {
      segmentsWithTags.push(
        ["open", tagType, prevTagIndex],
        [...currentTagData]
      );
      currentTagIndex++;
      continue;
    }

    segmentsWithTags.push([...currentTagData]);
    currentTagIndex++;
  }

  //console.log(segmentsWithTags);

  //collect tags in open and close pairs
  const taggedSegmentsInPairs: PairedTagData[] = [];
  for (let index = 0; index < segmentsWithTags.length; index += 2) {
    taggedSegmentsInPairs.push([
      [...segmentsWithTags[index]],
      [...segmentsWithTags[index + 1]],
    ]);
  }

  //collect plaintText
  const plainText: PairedTagData[] = [];
  let lastCloseIndex = 0;
  for (const currentTagData of taggedSegmentsInPairs) {
    const [[, , openIndex], [, , closeIndex]] = currentTagData;
    if (openIndex === 0 || openIndex - lastCloseIndex === 0) {
      lastCloseIndex = closeIndex;
      continue;
    }
    plainText.push([
      ["open", "plainText", lastCloseIndex],
      ["close", "plainText", openIndex],
    ]);
    lastCloseIndex = closeIndex;
  }

  if (lastCloseIndex < inputValue.length) {
    plainText.push([
      ["open", "plainText", lastCloseIndex],
      ["close", "plainText", inputValue.length],
    ]);
  }

  const allSegments = [...taggedSegmentsInPairs, ...plainText];
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

  console.log("render");

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

import styles from "./Output.module.css";
import { Props, TagData, PairedTagData } from "./Output.interface";
import { useEffect, useRef } from "react";

function regExpEscapeSpecialChars(strToEscape: string) {
  const specialChars = [
    "(",
    "[",
    ".",
    "*",
    "+",
    "?",
    "^",
    "=",
    "!",
    ":",
    "$",
    "{",
    "}",
    "(",
    ")",
    "|",
    "\\",
    "]",
    "/",
  ];
  return strToEscape
    .split("")
    .map((char) => (specialChars.includes(char) ? `\\${char}` : char))
    .join("");
}

const wordToHighlightRegex = (
  wordToHighlight: string,
  useRegularExpression: boolean,
  isCaseSensitive: boolean
) => {
  if (!useRegularExpression) {
    wordToHighlight = `${regExpEscapeSpecialChars(wordToHighlight)}`;
  }
  return new RegExp(`${wordToHighlight}`, `g${isCaseSensitive ? "" : "i"}`);
};

function Output({
  inputValue,
  selectionPositions,
  wordsToHighlight,
  isCaseSensitive,
  textSelectionStyling,
  wordFindHighlightingStyling,
  useRegularExpression,
  scrollTop,
}: Props) {
  const [selectStart, selectEnd] = selectionPositions;
  const inputValueAsArr = inputValue.split("");
  const segmentsWithTags: TagData[] = [];
  const tagData: TagData[] = [];
  const closedHighlightTags: TagData[] = [];
  const toDisplay = [];
  let errorMessage = "";
  const flipCursorBlinkAnim = useRef(true);
  const outputElement = useRef<HTMLParagraphElement>(null);

  try {
    if (wordFindHighlightingStyling.color.length > 9) {
      throw new Error(
        "You have defined too many styles for find word highlighting. The maximum permitted is nine."
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  }

  const applyTagTypeStyle = (tagType: string) => {
    const styles = {
      select: textSelectionStyling,
      highlight: wordFindHighlightingStyling,
    };

    if (tagType === "plainText") return { color: "inherit" };
    if (tagType === "select") return styles.select;
    const index = Number(tagType.at(-1));
    return index > wordFindHighlightingStyling.color.length - 1
      ? { color: `${wordFindHighlightingStyling.color.at(-1)}` }
      : { color: `${wordFindHighlightingStyling.color[index]}` };
  };

  for (const [index, wordToHighlight] of wordsToHighlight.entries()) {
    try {
      const matches = [
        ...inputValue.matchAll(
          wordToHighlightRegex(
            wordToHighlight,
            useRegularExpression,
            isCaseSensitive
          )
        ),
      ];
      if (matches.length) {
        for (const match of matches) {
          tagData.push(
            ["open", `highlight${index}`, match.index!],
            ["close", `highlight${index}`, match.index! + match[0].length]
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = `There is a problem with your regexp: "${error.message}"`;
      }
    }
  }

  tagData.sort((a, b) => a[2] - b[2]);

  //First open/close nested highlight tags
  let currentTagIndex = 0;
  while (currentTagIndex < tagData.length) {
    const currentTagData = tagData[currentTagIndex];
    const [, prevTagType, prevTagIndex] = closedHighlightTags.at(-1) || [
      "",
      "",
      -1,
    ];
    const [tag, tagType] = currentTagData;
    const [, nextTagType, nextTagIndex] = tagData[currentTagIndex + 1] || [
      "",
      "",
      -1,
    ];

    if (tag === "open" && tagType !== nextTagType) {
      closedHighlightTags.push(
        [...currentTagData],
        ["close", tagType, nextTagIndex]
      );
      currentTagIndex++;
      continue;
    }

    if (tag === "close" && tagType !== prevTagType) {
      closedHighlightTags.push(
        ["open", tagType, prevTagIndex],
        [...currentTagData]
      );
      currentTagIndex++;
      continue;
    }

    closedHighlightTags.push([...currentTagData]);
    currentTagIndex++;
  }

  //Now add selection or cursor tags into the mix
  if (selectionPositions.length) {
    if (selectStart === selectEnd) {
      closedHighlightTags.push(
        ["open", "cursor", selectStart],
        ["close", "cursor", selectStart]
      );
    } else {
      closedHighlightTags.push(
        ["open", "select", selectStart],
        ["close", "select", selectEnd]
      );
    }
  }

  closedHighlightTags.sort((a, b) => a[2] - b[2]);

  //Now close/open highlight tags with nested selection or cursor tags
  currentTagIndex = 0;
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

  const usedKeys: string[] = [];
  let inc = 0;
  const getKey = (content: string) => {
    let newKey = "";
    for (const key of usedKeys) {
      if (key === content) {
        inc++;
        newKey = `${content}${inc}`;
        break;
      }
    }
    if (newKey === "") newKey = `${content}`;
    usedKeys.push(newKey);
    return newKey;
  };

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
        <span key={getKey(content)} style={applyTagTypeStyle(tagType)}>
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
}

export default Output;

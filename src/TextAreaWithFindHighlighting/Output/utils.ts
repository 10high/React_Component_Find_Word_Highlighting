import { TagData, PairedTagData } from "./Output.interface";

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

export const wordToHighlightRegex = (
  wordToHighlight: string,
  useRegularExpression: boolean,
  isCaseSensitive: boolean
) => {
  if (!useRegularExpression) {
    wordToHighlight = `${regExpEscapeSpecialChars(wordToHighlight)}`;
  }
  return new RegExp(`${wordToHighlight}`, `g${isCaseSensitive ? "" : "i"}`);
};

export const applyTagTypeStyle = (
  tagType: string,
  textSelectionStyling: {
    color: string;
    backgroundColor: string;
  },
  wordFindHighlightingStyling: {
    color: string[];
  }
) => {
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

export function testHighlightStyles(
  wordFindHighlightingStyling: {
    color: string[];
  },
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    if (wordFindHighlightingStyling.color.length > 9) {
      throw new Error(
        "You have defined too many styles for find word highlighting. The maximum permitted is nine."
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    }
  }
}

export function getWordsToHighlight(
  wordsToHighlight: string[],
  inputValue: string,
  useRegularExpression: boolean,
  isCaseSensitive: boolean,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) {
  const forTagData: TagData[] = [];
  const filteredWordsToHighlight = wordsToHighlight.filter(
    (word) => word.length
  );
  for (const [index, wordToHighlight] of filteredWordsToHighlight.entries()) {
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
          forTagData.push(
            ["open", `highlight${index}`, match.index!],
            ["close", `highlight${index}`, match.index! + match[0].length]
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          `There is a problem with your regexp: "${error.message}"`
        );
      }
    }
  }
  return forTagData;
}

export const getClosedHighlightTags = (
  tagData: TagData[],
  selectionPositions: number[]
) => {
  const forClosedHighlightTags: TagData[] = [];
  //First open/close nested highlight tags
  let currentTagIndex = 0;
  while (currentTagIndex < tagData.length) {
    const currentTagData = tagData[currentTagIndex];
    const [, prevTagType, prevTagIndex] = forClosedHighlightTags.at(-1) || [
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
      forClosedHighlightTags.push(
        [...currentTagData],
        ["close", tagType, nextTagIndex]
      );
      currentTagIndex++;
      continue;
    }

    if (tag === "close" && tagType !== prevTagType) {
      forClosedHighlightTags.push(
        ["open", tagType, prevTagIndex],
        [...currentTagData]
      );
      currentTagIndex++;
      continue;
    }

    forClosedHighlightTags.push([...currentTagData]);
    currentTagIndex++;
  }

  //Now add selection or cursor tags into the mix
  if (selectionPositions.length) {
    const [selectStart, selectEnd] = selectionPositions;
    if (selectStart === selectEnd) {
      forClosedHighlightTags.push(
        ["open", "cursor", selectStart],
        ["close", "cursor", selectStart]
      );
    } else {
      forClosedHighlightTags.push(
        ["open", "select", selectStart],
        ["close", "select", selectEnd]
      );
    }
  }
  return forClosedHighlightTags;
};

export const getSegmentsWithTags = (closedHighlightTags: TagData[]) => {
  const forSegmentsWithTags: TagData[] = [];
  //Now close/open highlight tags with nested selection or cursor tags
  let currentTagIndex = 0;
  while (currentTagIndex < closedHighlightTags.length) {
    const currentTagData = closedHighlightTags[currentTagIndex];
    const [, prevTagType, prevTagIndex] = forSegmentsWithTags.at(-1) || [
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
      forSegmentsWithTags.push(
        [...currentTagData],
        [...closedHighlightTags[closeSelectIndex]]
      );
      currentTagIndex = closeSelectIndex + 1;
      continue;
    }

    if (tag === "open" && tagType !== "cursor" && nextTagType === "cursor") {
      forSegmentsWithTags.push(
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
      forSegmentsWithTags.push(
        [...currentTagData],
        ["close", tagType, nextTagIndex]
      );
      currentTagIndex++;
      continue;
    }

    if (tag === "close" && tagType !== prevTagType) {
      forSegmentsWithTags.push(
        ["open", tagType, prevTagIndex],
        [...currentTagData]
      );
      currentTagIndex++;
      continue;
    }

    forSegmentsWithTags.push([...currentTagData]);
    currentTagIndex++;
  }
  return forSegmentsWithTags;
};

export const getTaggedSegmentsInPairs = (segmentsWithTags: TagData[]) => {
  const forTaggedSegmentsInPairs: PairedTagData[] = [];
  for (let index = 0; index < segmentsWithTags.length; index += 2) {
    forTaggedSegmentsInPairs.push([
      [...segmentsWithTags[index]],
      [...segmentsWithTags[index + 1]],
    ]);
  }
  return forTaggedSegmentsInPairs;
};

export const getPlainText = (
  taggedSegmentsInPairs: PairedTagData[],
  inputValue: string
) => {
  const forPlainText: PairedTagData[] = [];
  let lastCloseIndex = 0;
  for (const currentTagData of taggedSegmentsInPairs) {
    const [[, , openIndex], [, , closeIndex]] = currentTagData;
    if (openIndex === 0 || openIndex - lastCloseIndex === 0) {
      lastCloseIndex = closeIndex;
      continue;
    }
    forPlainText.push([
      ["open", "plainText", lastCloseIndex],
      ["close", "plainText", openIndex],
    ]);
    lastCloseIndex = closeIndex;
  }

  if (lastCloseIndex < inputValue.length) {
    forPlainText.push([
      ["open", "plainText", lastCloseIndex],
      ["close", "plainText", inputValue.length],
    ]);
  }
  return forPlainText;
};

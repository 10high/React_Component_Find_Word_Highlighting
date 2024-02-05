import styles from "./Output.module.css";
import { Props, TagData, PairedTagData } from "./Output.interface";

const cursorEl = (
  <span key={crypto.randomUUID()} className={styles.blinking__cursor}>
    |
  </span>
);

function Output({ inputValue, selectionPositions, wordToHighlight }: Props) {
  const [selectStart, selectEnd] = selectionPositions;
  const inputValueAsArr = inputValue.split("");
  const segmentsWithTags: TagData[] = [];
  const tagData: TagData[] = [];
  const toDisplay = [];

  if (selectStart === selectEnd) {
    tagData.push(
      ["open", "cursor", selectStart],
      ["close", "cursor", selectStart]
    );
  } else {
    tagData.push(
      ["open", "select", selectStart],
      ["close", "select", selectEnd]
    );
  }

  const wordToHighlightRegex = new RegExp(`${wordToHighlight}`, "g");
  const matches = [...inputValue.matchAll(wordToHighlightRegex)];
  if (matches.length) {
    for (const match of matches) {
      tagData.push(
        ["open", "highlight", match.index!],
        ["close", "highlight", match.index! + wordToHighlight.length]
      );
    }
  }

  tagData.sort((a, b) => a[2] - b[2]);

  let currentTagIndex = 0;
  while (currentTagIndex < tagData.length) {
    const currentTagData = tagData[currentTagIndex];
    const [, prevTagType, prevTagIndex] = segmentsWithTags.at(-1) || [
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

    if (tagType === "select") {
      const closeSelectIndex = tagData.findLastIndex((tag: TagData) => {
        const [, tagType] = tag;
        return tagType === "select";
      });
      segmentsWithTags.push(
        [...currentTagData],
        [...tagData[closeSelectIndex]]
      );
      currentTagIndex = closeSelectIndex + 1;
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

  console.log("Segments with tags ", segmentsWithTags);

  //collect tags in open and close pairs
  const taggedSegmentsInPairs: PairedTagData[] = [];
  for (let index = 0; index < segmentsWithTags.length; index += 2) {
    taggedSegmentsInPairs.push([
      [...segmentsWithTags[index]],
      [...segmentsWithTags[index + 1]],
    ]);
  }

  console.log("taggedSegmentsInPairs ", taggedSegmentsInPairs);

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

  console.log("plaintext ", plainText);

  const allSegments = [...taggedSegmentsInPairs, ...plainText];
  allSegments.sort((a, b) => a[0][2] - b[0][2]);

  console.log("allSegments ", allSegments);

  toDisplay.push(...allSegments);

  const usedKeys: string[] = [];

  const getKey = (content: string) => {
    console.log(usedKeys);
    const keyUsedCount = usedKeys.filter((key) =>
      usedKeys.includes(key)
    ).length;
    if (keyUsedCount > 0) {
      const newKey = `${content}${keyUsedCount}`;
      usedKeys.push(newKey);
      return newKey;
    } else {
      usedKeys.push(content);
      return content;
    }
  };

  const constructElement = (
    tagType: string,
    openIndex: number,
    closeIndex: number
  ) => {
    if (tagType === "cursor") {
      return cursorEl;
    } else {
      const content = inputValueAsArr.slice(openIndex, closeIndex).join("");
      return (
        <span key={getKey(content)} className={`${styles[tagType]}`}>
          {content}
        </span>
      );
    }
  };

  return (
    <p className={styles.output}>
      {toDisplay.map((segment: PairedTagData) => {
        const [[, tagType, openIndex], [, , closeIndex]] = segment;
        return constructElement(tagType, openIndex, closeIndex);
      })}
    </p>
  );
}

export default Output;

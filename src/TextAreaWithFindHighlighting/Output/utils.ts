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

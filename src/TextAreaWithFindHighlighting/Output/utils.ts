import { TagData } from "./Output.interface";

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

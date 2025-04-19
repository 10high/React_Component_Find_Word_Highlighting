import {
  KeyEvent,
  ChangeEvent,
  SyntheticEvent,
  ScrollEvent,
} from "./Input.interface";
const keyCodes = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "End",
  "Home",
]);

export function handleKeyPress(
  event: KeyEvent,
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>
) {
  if (keyCodes.has(event.key)) {
    const target = event.target as HTMLTextAreaElement;
    setSelectionPositions([target.selectionStart, target.selectionEnd]);
  }
}

export function handleOnChange(
  event: ChangeEvent,
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>
) {
  const target = event.target as HTMLTextAreaElement;
  setInputValue(target.value);
  setSelectionPositions([target.selectionStart, target.selectionEnd]);
}

export function handlePointerMove(
  event: React.PointerEvent<HTMLTextAreaElement>,
  mouseIsDown: boolean,
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>
) {
  if (mouseIsDown) {
    const target = event.target as HTMLTextAreaElement;
    setSelectionPositions([target.selectionStart, target.selectionEnd]);
  }
}

export function handleOnSelect(
  event: SyntheticEvent,
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>
) {
  const target = event.target as HTMLTextAreaElement;
  setSelectionPositions([target.selectionStart, target.selectionEnd]);
}

export function handleOnScroll(
  event: ScrollEvent,
  setScrollTop: React.Dispatch<React.SetStateAction<number>>
) {
  const target = event.target as HTMLTextAreaElement;
  setScrollTop(target.scrollTop);
}

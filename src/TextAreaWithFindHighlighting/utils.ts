import {
  ChangeEvent,
  SyntheticEvent,
  ScrollEvent,
} from "./TextAreaWithFindHighlighting.interface";

export function handleOnChange(
  event: ChangeEvent,
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ignoreSelectRef: React.MutableRefObject<boolean>
) {
  ignoreSelectRef.current = true;
  const target = event.target as HTMLTextAreaElement;
  setInputValue(target.value);
  setSelectionPositions([target.selectionStart, target.selectionEnd]);
  setTimeout(() => {
    ignoreSelectRef.current = false;
  }, 300);
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
  setSelectionPositions: React.Dispatch<React.SetStateAction<number[]>>,
  ignoreSelectRef: boolean
) {
  if (ignoreSelectRef) return;
  const target = event.target as HTMLTextAreaElement;
  setSelectionPositions([target.selectionStart, target.selectionEnd]);
}

export function handleOnScroll(
  event: ScrollEvent,
  setScrollTop: React.Dispatch<React.SetStateAction<number>>
) {
  console.log("onScroll");
  const target = event.target as HTMLTextAreaElement;
  setScrollTop(target.scrollTop);
}

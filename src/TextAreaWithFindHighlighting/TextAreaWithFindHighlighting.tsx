import "./TextAreaWithFindHighlighting.css";
import { useState } from "react";

import Input from "../Input/Input";

export default function TextAreaWithFindHighlighting() {
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <Input inputValue={inputValue} setInputValue={setInputValue} />
    </>
  );
}

import styles from "./TextAreaWithFindHighlighting.module.css";
import { useState } from "react";

import Input from "../Input/Input";
import Output from "../Output/Output";

export default function TextAreaWithFindHighlighting() {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className={styles.container}>
      <Input inputValue={inputValue} setInputValue={setInputValue} />
      <Output inputValue={inputValue} />
    </div>
  );
}

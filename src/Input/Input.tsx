import styles from "./Input.module.css";
import { Props, Event } from "./Input.interface";

function Input({ inputValue, setInputValue }: Props) {
  function handleOnChange(event: Event) {
    setInputValue(event.target.value);
  }

  return (
    <textarea
      cols={40}
      rows={2}
      value={inputValue}
      onChange={(event) => handleOnChange(event)}
      className={styles.input}
    />
  );
}

export default Input;

import styles from "./Output.module.css";
import { Props } from "./Output.interface";

function Output({ inputValue }: Props) {
  return <p className={styles.output}>{inputValue}</p>;
}

export default Output;

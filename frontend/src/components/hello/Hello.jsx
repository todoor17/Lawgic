import styles from "./hello.module.css";
import icon from "../../images/lawgicPngWhite.png";

export default function Hello({ name }) {
  return (
    <div className={styles.componentContainer}>
      <div className={styles.firstRowContainer}>
        <img src={icon} className={styles.icon}></img>
        <p className={styles.text1}>Hello, {name}! Lawgic here!</p>
      </div>
      <p className={styles.text2}>What can I assist you with today?</p>
    </div>
  );
}

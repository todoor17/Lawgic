import styles from "./roundButton.module.css";

export default function RoundButton({ src, onClick }) {
  return (
    <button className={styles.button}>
      <img src={src} className={styles.buttonIcon} onClick={onClick}></img>
    </button>
  );
}

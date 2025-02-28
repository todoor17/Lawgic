import styles from "./hello.module.css";

export default function Hello({ name }) {
  return (
    <div className={styles.componentContainer}>
      <div className={styles.firstRowContainer}>
        <p className={styles.text1}>
          {name ? `Hello, ${name}! Lawgic here!` : `Hello, user! I am Lawgic!`}
        </p>
      </div>
      <p className={styles.text2}>What can I assist you with today?</p>
    </div>
  );
}

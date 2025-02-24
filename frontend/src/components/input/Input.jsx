import styles from "./input.module.css";

export default function Input({ tag, type, input, setInput }) {
  return (
    <div className={styles.inputGroup}>
      <input
        type={type}
        autoComplete="off"
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <label className={styles.userLabel} htmlFor="passwordInput">
        {tag}
      </label>
    </div>
  );
}

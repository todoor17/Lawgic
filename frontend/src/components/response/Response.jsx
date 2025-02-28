import styles from "./response.module.css";
import { useRef, useEffect } from "react";
import playIcon from "../../images/playIcon.png";
import RoundButton from "../roundButton/RoundButton.jsx";
import audioFile from "../../../../backend/output.mp3";

export default function Response({ response }) {
  const textAreaRef = useRef(null);
  const responseContainerRef = useRef(null);

  const autoResize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
    if (responseContainerRef.current) {
      responseContainerRef.current.style.height = "auto";
      responseContainerRef.current.style.height = `${
        textAreaRef.current.scrollHeight + 80
      }px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [response]);

  const fetchApi = async () => {
    try {
      console.log(response);
      const responsee = await fetch(
        `http://localhost:5000/voice?prompt=${response}`
      );
      let audio = new Audio(audioFile);
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div ref={responseContainerRef} className={styles.responseContainer}>
      <textarea
        ref={textAreaRef}
        className={styles.textarea}
        value={"  " + response}
        readOnly
      ></textarea>
      <RoundButton src={playIcon} onClick={fetchApi} />
    </div>
  );
}

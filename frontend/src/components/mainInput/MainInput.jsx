import styles from "./mainInput.module.css";
import playIcon from "../../images/playIcon.png";
import micIcon from "../../images/micIcon.png";
import sendIcon from "../../images/sendIcon.png";
import { useRef, useEffect, useState } from "react";
import RoundButton from "../roundButton/RoundButton.jsx";
import audioFile from "../../../../backend/output.mp3";

export default function MainInput({
  response,
  setResponse,
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
}) {
  const textAreaRef = useRef(null);
  const inputContainerRef = useRef(null);

  const handleHeight = () => {
    if (textAreaRef.current && inputContainerRef.current) {
      textAreaRef.current.style.height = "auto";
      inputContainerRef.current.style.height = "auto";

      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      inputContainerRef.current.style.height = `${textAreaRef.current.style.height}px`;
    }
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  useEffect(() => {
    handleHeight();
  }, [prompt]);

  async function handlePrompt() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/gptt?prompt=${prompt}`
      );
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function convertToVoice() {
    try {
      const response = await fetch(
        `http://localhost:5000/voice?prompt=${prompt}`
      );
    } catch (e) {
      console.error(e);
    }
  }

  const playAudio = async () => {
    await convertToVoice();
    const audio = new Audio(audioFile);
    audio.play();
  };

  return (
    <div ref={inputContainerRef} className={styles.inputContainer}>
      <textarea
        ref={textAreaRef}
        className={
          prompt.length < 38 || prompt.length == 0
            ? `${styles.input}`
            : `${styles.input} ${styles.paddingBottom}`
        }
        placeholder="Ask me anything"
        value={prompt}
        onChange={handleChange}
      ></textarea>
      <div className={styles.buttonsContainer}>
        <RoundButton src={micIcon} />
        <RoundButton src={playIcon} onClick={playAudio} />
        <RoundButton src={sendIcon} onClick={handlePrompt} />
      </div>
    </div>
  );
}

import styles from "./response.module.css";
import { useRef, useEffect, useState } from "react";
import playIcon from "../../images/playIcon.png";
import pauseIcon from "../../images/pauseIcon.png";
import RoundButton from "../roundButton/RoundButton.jsx";
import audio from "../../../../backend/response.mp3";

export default function Response({ response }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const textAreaRef = useRef(null);
  const responseContainerRef = useRef(null);
  const audioRef = useRef(null);

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
      await fetch(
        `http://localhost:5000/voice?prompt=${response}&type=response`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleAudio = async () => {
    const audioElement = audioRef.current;
    if (!audioElement.src) {
      await fetchApi();
      audioElement.src = `${audio}?${new Date().getTime()}`;
    }

    if (audioElement) {
      audioElement.addEventListener("ended", () => {
        setIsPlaying(false); // Update state when audio ends
      });
    }

    if (isPlaying) {
      // pause the audio if it's playing
      audioElement.pause();
      setIsPlaying(false);
    } else {
      // start the audio if it's paused
      audioElement.play();
      setIsPlaying(true);
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
      <RoundButton
        src={isPlaying ? pauseIcon : playIcon}
        onClick={handleAudio}
      />
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}

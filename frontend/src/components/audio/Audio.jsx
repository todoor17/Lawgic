import audio from "../../../../backend/output1.mp3";

export default function Audio() {
  return <audio src={audio} type="audio/mpeg" />;
}

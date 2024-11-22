import { useState, useEffect } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

function Record() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate();
  const reportDanger = () => {
    navigate("/maps");
  };
  // Initialize the recorder controls using the hook
  const recorderControls = useVoiceVisualizer();
  const {
    // ... (Extracted controls and states, if necessary)
    recordedBlob,
    error,
  } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

    console.log(recordedBlob);
  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);
  return (
    <Layout className={"flex flex-col items-center text-center m-5 gap-2"}>
      <h1 className="text-4xl font-bold mb-3">Describe Emergency on Mic</h1>
      <h1 className="text-xl font-medium w-8/12">
        For precise, please tell us
      </h1>
      <ul className="list-none">
        <li>What is your name</li>
        <li>Whats the emergency</li>
        <li>Where location name</li>
        <li>...All important event</li>
      </ul>
      <div className="flex items-start justify-center">
        <VoiceVisualizer
          controls={recorderControls}
          className="animate-ping"
          isDownloadAudioButtonShown={true}
          mainContainerClassName="scale-125"
        />
      </div>
      <br />
      <button
        className="bg-red-600 px-5 py-2 rounded-full justify-end text-white shadow-lg"
        onClick={reportDanger}
      >
        Next Step
      </button>
    </Layout>
  );
}

export default Record;

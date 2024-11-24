import { useState, useEffect } from 'react';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import useReportStore from '../store/useReportStore';

function Record() {
  const [count, setCount] = useState(0);
  const setAudio = useReportStore((state) => state.setAudio);
  let navigate = useNavigate();
  const reportDanger = () => {
    console.log('SENT\n', setAudio);
    navigate('/maps');
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
    setAudio(recordedBlob);
  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);
  return (
    <Layout className={'flex flex-col items-center text-center m-5 gap-2'}>
      <div className="h-screen">
        <h1 className="text-3xl font-bold mb-3">🎙 Describe Emergency</h1>
        <h1 className="text-xl font-medium w-9/12 md:w-full">
          To ensure we understand and respond effectively, please provide the following details clearly
        </h1>
        <div className="flex items-start justify-center">
          <VoiceVisualizer
            controls={recorderControls}
            className="animate-ping"
            isDownloadAudioButtonShown={true}
            mainContainerClassName="scale-105 -translate-y-[40px]"
          />
        </div>
        <button className="bg-red-600 px-5 py-2 rounded-full justify-end text-white shadow-lg" onClick={reportDanger}>
          Next Step
        </button>
      </div>
    </Layout>
  );
}

export default Record;

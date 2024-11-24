import { useState, useEffect } from 'react';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import useReportStore from '../store/useReportStore';

function Record() {
  const [voiceDone, setVoiceDone] = useState(null);
  const [file, setFile] = useState(null);
  const setAudio = useReportStore((state) => state.setAudio);
  let navigate = useNavigate();
  const reportDanger = () => {
    console.log('SENT');
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
    // if (!recordedBlob || !file) return;
    if (recordedBlob) {
      setAudio(recordedBlob);
      setVoiceDone(true);
      console.log(recordedBlob);
    } else if (file) {
      setAudio(file);
      setVoiceDone(true);
      console.log(file);
    } else {
      return;
    }
  }, [recordedBlob, file, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const blob = new Blob([selectedFile], { type: selectedFile.type });
    setFile(blob);
  };
  return (
    <Layout className={'flex flex-col items-center text-center m-5 gap-2'}>
      <div className="h-screen">
        <h1 className="text-2xl font-bold mb-3">🎙 Describe Emergency</h1>
        <h1 className="text-xl font-medium md:w-full">
          To ensure we understand and respond effectively, please provide the following details clearly
        </h1>
        <div className="flex justify-center items-start">
          <VoiceVisualizer
            controls={recorderControls}
            className="animate-ping"
            // isDownloadAudioButtonShown={true}
            mainContainerClassName="scale-105 -mt-[50px]"
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-1 mb-3">
          <p>Or you can upload here</p>
          <div className="bg-white shadow p-3 w-fit border rounded-md">
            <input type="file" accept="audio/*" onChange={handleFileChange} />
          </div>
        </div>
        {voiceDone && (
          <button className="bg-red-600 px-5 py-2 rounded-full justify-end text-white shadow-lg" onClick={reportDanger}>
            Done, proceed
          </button>
        )}
      </div>
    </Layout>
  );
}

export default Record;

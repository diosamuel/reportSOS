import { useEffect, useState } from 'react';
import Layout from '../Layout';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import useReportStore from '../store/useReportStore';
import { useNavigate } from 'react-router-dom';

function reportDanger(audio, geolocation, image, cb) {
  try {
    const form = new FormData();
    form.append('audio', audio, 'audio.webm');
    form.append('coordinate', JSON.stringify([geolocation.lat, geolocation.lon]));
    form.append('image', image);
    const options = {
      method: 'POST',
      body: form,
    };
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/report`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit the report.');
        }
        cb(response)
        return response
      })
      .then((data) => {
        console.log('Report submitted successfully:', data);
        cb(data.json())
      })
      .catch((err) => {
        console.error(err)
        cb(false)
      });
  } catch (err) {
    console.error(err)
    cb(false)
  }
}

function Result() {
  const [coming, setComing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { geolocation, image, audio } = useReportStore();
  const [fileAudio, setFileAudio] = useState(null);
  const [fileImage, setFileImage] = useState(null);
  const [isError, setError] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const reportBefore = localStorage.getItem('report');
      if(!(audio&&geolocation)){
        setError(true)
      }
      if(!Boolean(reportBefore)){
        reportDanger(audio, geolocation, image, (res)=>{
          if(!res){
            setError(!res);
          }else{
            localStorage.setItem('report', true);
          }
        });
      }
    }, 1000);

    //for UI
    audio && setFileAudio(URL.createObjectURL(audio));
    image && setFileImage(URL.createObjectURL(image));
  }, []);
  if (isError) {
    alert("Missing media, retry")
    localStorage.setItem('report', false);
    navigate('/');
    return <></>;
  } else {
    return (
      <>
        {isLoading ? (
          <Layout className={'flex flex-col items-center justify-center text-center bg-red-600 text-white'}>
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="relative">
                <div className="absolute w-16 h-16 rounded-full bg-white animate-ping"></div>
                <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <span className="text-4xl">{coming ? `🚓` : `🚨`}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-5 text-white">Send report to 911, loading..</h1>
              <p className="text-white">If loading takes too long, try to refresh</p>
            </div>
          </Layout>
        ) : (
          <Layout className={'items-center text-center space-y-2'}>
            <div
              className={`w-full py-8 rounded-b-3xl ${
                coming ? `bg-blue-600` : `bg-red-600`
              } text-white flex flex-col items-center justify-center`}
            >
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute w-16 h-16 rounded-full bg-white animate-ping"></div>
                  <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl">{coming ? `🚓` : `🚨`}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">{coming ? `Help is on the way to your location` : `Report Send to 911!`}</h1>
              <h3>Please be patient! {coming ? `Out team coming to your location` : `Our team will be respond shortly`}</h3>
              <div className="px-3 mt-5 w-full">
                <p>Your Location</p>
                <strong>{geolocation?.display_name}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-6 justify-center items-center">
              {image && <img src={fileImage} className="w-96 rounded-lg mt-5" />}
              {fileAudio && (
                <audio controls>
                  <source src={fileAudio} type={audio.type} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
            <div className="space-y-5 my-5 flex flex-col justify-center items-center">
              <h1 className="text-xl font-bold">While you wait</h1>
              <div className="w-11/12 md:w-8/12 rounded-lg p-3 bg-yellow-500/20 flex justify-start gap-6 items-center">
                <span className="p-2 bg-white rounded-lg">😇</span>
                <div className="text-left">
                  <p className="text-lg text-black font-semibold">Keep Calm</p>
                  <p className="text-gray-600 text-sm">Watch out several activites to report to our team</p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/watch?v=5OKFljZ2GQE"
                target="__blank"
                className="w-11/12 md:w-8/12 rounded-lg p-3 bg-blue-500/20 border border-blue-500 flex justify-start gap-6 items-center"
              >
                <span className="p-2 bg-white rounded-lg">🩺</span>
                <div className="text-left">
                  <p className="text-lg text-blue-500 font-semibold">First Aid Instruction</p>
                  <p className="text-gray-600 text-sm">
                    Take the necessary first aid steps to prevent it, click here for a detailed explanation.
                  </p>
                </div>
              </a>
              <button className="w-11/12 md:w-8/12 rounded-lg p-3 bg-red-500/20 border border-red-500 flex justify-start gap-6 items-center">
                <span className="p-2 bg-white rounded-lg">🚔</span>
                <div className="text-left">
                  <p className="text-lg text-red-500 font-semibold">Nearby Emergency Station</p>
                  <p className="text-gray-600 text-sm">Search nearby police station, fire departmen and hospital</p>
                </div>
              </button>
            </div>
          </Layout>
        )}
      </>
    );
  }
}

export default Result;

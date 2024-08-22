import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./style.css";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs";

function SmartCamera() {
  const videoRef = useRef(null);
  const liveViewRef = useRef(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [webcamActive, setWebcamActive] = useState(false);
  const isPredicting = useRef(false);

  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
    });
    // const loadModel = async () => {
    //   try {
    //     const loadedModel = await tf.loadGraphModel(
    //       "https://teachablemachine.withgoogle.com/models/o2V198-N0/model.json"
    //     );
    //     console.log("model loaded", loadedModel);
    //     setModel(loadedModel);
    //   } catch (error) {
    //     console.log("error loading model", error);
    //   }
    // };

    // loadModel();
  }, []);

  const enableWebcam = async () => {
    if (model) {
      setWebcamActive(true);
      isPredicting.current = true;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predictWebcam);
    }
  };

  const disableWebcam = () => {
    setWebcamActive(false);
    isPredicting.current = false;
    setPredictions([]);
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const predictWebcam = () => {
    if (model && isPredicting.current && videoRef.current) {
      model.detect(videoRef.current).then((predictions) => {
        setPredictions(predictions);
        requestAnimationFrame(predictWebcam); // Continue predicting
      });
      // Convert the video frame to a tensor
      // const videoTensor = tf.browser.fromPixels(videoRef.current);

      // // Run the prediction on the tensor
      // model.executeAsync(videoTensor.expandDims(0)).then((predictions) => {
      //   setPredictions(predictions);
      //   requestAnimationFrame(predictWebcam);
      // });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 italic mb-4">
        Multiple Object Detection
      </h1>
      <p className="text-gray-600 mb-6">
        Hold objects up close to your webcam to get a real-time classification!
      </p>
      <div ref={liveViewRef} className="relative w-full max-w-2xl">
        {!webcamActive && (
          <button
            onClick={enableWebcam}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Enable Webcam
          </button>
        )}
        {webcamActive && (
          <button
            onClick={disableWebcam}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Disable Webcam
          </button>
        )}
        <div className="relative mt-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            width="640"
            height="480"
            className="rounded-lg shadow-lg"
          ></video>
          {predictions.map(
            (prediction, index) =>
              prediction.score > 0.66 && (
                <div key={index} className="static">
                  <p
                    className="absolute text-red-600 bg-green-500 bg-opacity-75 p-1 rounded text-xs"
                    style={{
                      left: `${prediction.bbox[0]}px`,
                      top: `${prediction.bbox[1]}px`,
                      width: `${prediction.bbox[2]}px`,
                    }}
                  >
                    {prediction.class} - {Math.round(prediction.score * 100)}%
                    confidence
                  </p>
                  <div
                    className="absolute border border-green-500 bg-green-200 bg-opacity-30"
                    style={{
                      left: `${prediction.bbox[0]}px`,
                      top: `${prediction.bbox[1]}px`,
                      width: `${prediction.bbox[2]}px`,
                      height: `${prediction.bbox[3]}px`,
                    }}
                  ></div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
export default SmartCamera;

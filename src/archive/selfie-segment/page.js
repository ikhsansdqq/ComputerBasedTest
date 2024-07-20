"use client"

import { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils/camera_utils.js";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";


function App() {
  const inputVideoRef = useRef();
  const canvasRef = useRef();
  let ctx = null;

  const init = () => {
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    ctx = canvasRef.current.getContext("2d");

    const constraints = {
      video: { width: { min: 1280 }, height: { min: 720 } },
      flipHorizontal: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      inputVideoRef.current.srcObject = stream;
      // sendToMediaPipe();
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: false,
    });

    selfieSegmentation.onResults(onResults);

    const camera = new Camera(inputVideoRef.current, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: inputVideoRef.current });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  };

  useEffect(() => {
    if (inputVideoRef.current) {
      init();
    }
  }, [inputVideoRef.current]);

  const onResults = (results) => {
    ctx.save();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Only overwrite existing pixels.
    // ctx.globalCompositeOperation = "source-out";
    // ctx.fillStyle = "#000000";
    // ctx.fillRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    // Only overwrite missing pixels.
    ctx.globalCompositeOperation = "destination-atop";
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    ctx.restore();
  };

  return (
    <div className="max-w-[960px] mx-auto text-center py-6">
      <h1 className="text-3xl font-semibold pt-3">Exam Person Extraction Feature Page</h1>

      <p className="py-4">Input video from webcam:</p>
      <video autoPlay ref={inputVideoRef} className="-scale-x-100 mx-auto" width={640} height={240} />

      <p className="py-4">Extracted Person:</p>
      <canvas ref={canvasRef} className="-scale-x-100 mx-auto" width={640} height={240} />
    </div>
  );
}

export default App;

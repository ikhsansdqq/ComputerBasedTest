"use client"

import { useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

const FaceDetectionPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      return new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });
    };

    const loadModel = async () => {
      const detectorConfig = {
        modelType: faceDetection.SupportedModels.MediaPipeFaceDetector,
        maxFaces: 1,
        runtime: 'mediapipe', // Use tfjs runtime for consistency
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
      };

      modelRef.current = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        detectorConfig
      );

      setModelLoaded(true);
      console.log(modelLoaded);
      console.log('Model Loaded!');
    };

    const detectFaces = async () => {
      if (!modelRef.current || !videoRef.current) return;

      const estimationConfig = { flipHorizontal: true, predictIrises: false, returnTensors: false };
      const predictions = await modelRef.current.estimateFaces(videoRef.current, estimationConfig);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);

      if (predictions.length > 0) {
        predictions.forEach((prediction) => {
          if (prediction.box) {
            const { topLeft, bottomRight } = prediction.box;
            if (topLeft && bottomRight) {
              const start = topLeft;
              const end = bottomRight;
              const size = [end[0] - start[0], end[1] - start[1]];

              ctx.beginPath();
              ctx.rect(start[0], start[1], size[0], size[1]);
              ctx.lineWidth = 2;
              ctx.strokeStyle = 'red';
              ctx.stroke();
            } else {
              console.warn('Invalid box coordinates in prediction:', prediction.box);
            }
          } else {
            console.warn('Invalid prediction box:', prediction.box);
          }
        });
      }

      ctx.restore();
    };

    const runFaceDetection = async () => {
      await setupCamera();
      await loadModel();

      videoRef.current.play();
      setInterval(detectFaces, 100);
    };

    runFaceDetection();
  }, []);

  return (
    <div className='max-w-[960px] mx-auto py-6'>
      <h1 className='text-3xl font-semibold mb-4 text-center'>Real-Time Face Detection</h1>
      <div className='flex justify-center items-center relative w-[640px] h-[480px] mx-auto'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
          className='-scale-x-100 absolute top-0 left-0'
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className='absolute top-0 left-0'
        />
      </div>
      <p className='text-center mt-4'>Faces detected: 0/1</p>
      <p className='text-center'>Violation count: 0/10</p>

      <p>Model loaded? {modelLoaded}</p>
    </div>
  );
};

export default FaceDetectionPage;

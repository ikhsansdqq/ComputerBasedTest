"use client"

import { useEffect, useRef } from 'react';
import '@tensorflow/tfjs';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

const FaceDetectionPage = () => {
     const videoRef = useRef(null);
     const canvasRef = useRef(null);
     const modelRef = useRef(null);

     useEffect(() => {
          const setupCamera = async () => {
               const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 720, height: 560 },
                    audio: false,
               });

               videoRef.current.srcObject = stream;
               return new Promise((resolve) => {
                    videoRef.current.loadedmetadata = () => {
                         resolve();
                    };
               });
          };

          const loadModel = async () => {
               const detectorConfig = {
                    modelType: faceDetection.SupportedModels.MediaPipeFaceDetector,
                    runtime: 'tfjs',
               };
               modelRef.current = await faceDetection.createDetector(
                    faceDetection.SupportedModels.MediaPipeFaceDetector,
                    detectorConfig
               );
          };

          const detectFaces = async () => {
               if (!modelRef.current || !videoRef.current) return;

               const predictions = await modelRef.current.estimateFaces(videoRef.current);

               const canvas = canvasRef.current;
               const ctx = canvas.getContext('2d');
               ctx.clearRect(0, 0, canvas.width, canvas.height);

               if (predictions.length > 0) {
                    predictions.forEach((prediction) => {
                         const start = prediction.box.startPoint;
                         const end = prediction.box.endPoint;
                         const size = [end[0] - start[0], end[1] - start[1]];

                         ctx.beginPath();
                         ctx.rect(start[0], start[1], size[0], size[1]);
                         ctx.linewidth = 2;
                         ctx.strokeStyle = 'red';
                         ctx.stroke();
                    });
               }
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
          <div>
               <h1>Real-Time Face Detection</h1>
               <video ref={videoRef} autoPlay playsInline width="640" height="480" />
               <canvas ref={canvasRef} width="640" height="480" />
          </div>
     );
};

export default FaceDetectionPage;
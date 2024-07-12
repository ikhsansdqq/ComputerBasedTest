"use client";

import { useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

const FaceTracking = () => {
     const videoRef = useRef(null);
     const canvasRef = useRef(null);
     const videoBlendShapesRef = useRef(null);

     useEffect(() => {
          let faceLandmarker = null;
          let lastVideoTime = -1;
          const videoWidth = 480;

          const createFaceLandmarker = async () => {
               try {
                    const filesetResolver = await FilesetResolver.forVisionTasks(
                         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                    );
                    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                         baseOptions: {
                              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                              delegate: "GPU"
                         },
                         outputFaceBlendshapes: true,
                         runningMode: "VIDEO",
                         numFaces: 1
                    });
               } catch (error) {
                    console.error('Error creating FaceLandmarker:', error);
               }
          };

          const predictVideo = async () => {
               const video = videoRef.current;
               const canvasElement = canvasRef.current;

               if (!video || !canvasElement || !faceLandmarker) {
                    return;
               }

               const canvasCtx = canvasElement.getContext("2d");
               if (!canvasCtx) {
                    return;
               }

               const drawingUtils = new DrawingUtils(canvasCtx);

               const renderLoop = async () => {
                    if (!video.paused && !video.ended) {
                         const videoHeight = video.videoHeight;
                         const videoWidth = video.videoWidth;

                         canvasElement.width = videoWidth;
                         canvasElement.height = videoHeight;

                         if (lastVideoTime !== video.currentTime) {
                              lastVideoTime = video.currentTime;
                              const startTimeMs = performance.now();
                              try {
                                   const results = await faceLandmarker.detectForVideo(video, startTimeMs);

                                   if (results && results.faceLandmarks) {
                                        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
                                        drawingUtils.drawConnectors(results.faceLandmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
                                   }
                                   if (results && results.faceBlendshapes) {
                                        drawBlendShapes(videoBlendShapesRef.current, results.faceBlendshapes);
                                   }
                              } catch (error) {
                                   console.error('Error during face detection:', error);
                              }
                         }

                         requestAnimationFrame(renderLoop);
                    }
               };

               renderLoop();
          };

          const drawBlendShapes = (el, blendShapes) => {
               if (!blendShapes.length) {
                    return;
               }

               let htmlMaker = "";
               blendShapes[0].categories.map((shape) => {
                    htmlMaker += `
          <li class="blend-shapes-item">
            <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
            <span class="blend-shapes-value" style="width: calc(${+shape.score * 100}% - 120px)">${(+shape.score).toFixed(4)}</span>
          </li>
        `;
               });

               el.innerHTML = htmlMaker;
          };

          createFaceLandmarker();

          if (videoRef.current) {
               videoRef.current.addEventListener('loadeddata', predictVideo);
          }

          return () => {
               if (videoRef.current) {
                    videoRef.current.removeEventListener('loadeddata', predictVideo);
               }
          };
     }, []);

     return (
          <div>
               <video ref={videoRef} width="480" height="360" src={'/chuangy61.mp4'} controls autoPlay={true}></video>
               <canvas ref={canvasRef} style={{ position: "absolute" }}></canvas>
               <ul ref={videoBlendShapesRef} id="video-blend-shapes"></ul>
          </div>
     );
};

export default FaceTracking;
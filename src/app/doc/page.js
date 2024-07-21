"use client";

import { useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const DocHome = () => {
     const videoRef = useRef(null);
     const canvasRef = useRef(null);

     useEffect(() => {
          const faceMeshModel = new FaceMesh({
               locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
          });

          if (navigator.mediaDevices.getUserMedia) {
               navigator.mediaDevices.getUserMedia({ video: true })
                    .then((stream) => {
                         if (videoRef.current) {
                              videoRef.current.srcObject = stream;
                         }
                    })
                    .catch((error) => {
                         console.error("Error accessing media devices.", error);
                    });
          }

          const loadFaceMesh = async () => {
               faceMeshModel.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
               });

               faceMeshModel.onResults(onResults);

               if (videoRef.current) {
                    const video = videoRef.current;
                    const camera = new Camera(video, {
                         onFrame: async () => {
                              await faceMeshModel.send({ image: video });
                         },
                         width: 640,
                         height: 480,
                    });

                    camera.start();
               }
          };

          const onResults = (results) => {
               if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    results.multiFaceLandmarks.forEach((landmarks) => {
                         // Draw bounding box
                         const xCoords = landmarks.map((landmark) => landmark.x * canvas.width);
                         const yCoords = landmarks.map((landmark) => landmark.y * canvas.height);
                         const minX = Math.min(...xCoords);
                         const minY = Math.min(...yCoords);
                         const maxX = Math.max(...xCoords);
                         const maxY = Math.max(...yCoords);

                         ctx.strokeStyle = "red";
                         ctx.lineWidth = 2;
                         ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

                         // Optionally draw landmarks
                         ctx.fillStyle = "green";
                         landmarks.forEach((landmark) => {
                              ctx.beginPath();
                              ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 2, 0, 2 * Math.PI);
                              ctx.fill();
                         });
                    });
               }
          };

          loadFaceMesh();
     }, []);

     return (
          <div>
               <video ref={videoRef} style={{ position: "absolute" }} className="-scale-x-100" />
               <canvas ref={canvasRef} width="640" height="480" style={{ position: "absolute" }} className="-scale-x-100" />
          </div>
     );
};

export default DocHome;

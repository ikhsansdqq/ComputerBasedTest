"use client";

// ClientOnlyComponent.js
import { useState, useRef, useEffect } from "react";
import * as faceMesh from '@mediapipe/face_mesh';
import * as camUtils from '@mediapipe/camera_utils';

const ClientOnlyComponent = () => {
    const webCamRef = useRef(null);
    const canvasRef = useRef(null);

    const [faceDetected, setFaceDetected] = useState(false);
    const [noFaceCounter, setNoFaceCounter] = useState(0);
    const [multipleFacesCounter, setMultipleFacesCounter] = useState(0);

    const [lastFaceDetectedTime, setLastFaceDetectedTime] = useState(Date.now());
    const [facesCount, setFacesCount] = useState(0);

    const onResults = (results) => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context?.clearRect(0, 0, canvas.width, canvas.height);

            if (context && results.multiFaceLandmarks) {
                const faces = results.multiFaceLandmarks.length;
                setFacesCount(faces);

                if (faces === 1) {
                    setLastFaceDetectedTime(Date.now());
                    setFaceDetected(true);

                    const landmarks = results.multiFaceLandmarks[0];

                    // Draw bounding box
                    const boundingBox = landmarks.reduce(
                        (box, landmark) => {
                            return {
                                maxX: Math.max(box.maxX, landmark.x),
                                maxY: Math.max(box.maxY, landmark.y),
                                minX: Math.min(box.minX, landmark.x),
                                minY: Math.min(box.minY, landmark.y),
                            };
                        },
                        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
                    );

                    context.strokeStyle = 'red';
                    context.lineWidth = 2;
                    context.strokeRect(
                        boundingBox.minX * canvas.width,
                        boundingBox.minY * canvas.height,
                        (boundingBox.maxX - boundingBox.minX) * canvas.width,
                        (boundingBox.maxY - boundingBox.minY) * canvas.height
                    );

                    const drawLandmark = (index, color) => {
                        const x = landmarks[index].x * canvas.width;
                        const y = landmarks[index].y * canvas.height;

                        context.fillStyle = color;
                        context.beginPath();
                        context.arc(x, y, 3, 0, 2 * Math.PI);
                        context.fill();
                    };

                    const leftEyeIndices = [33, 133, 145, 153, 160, 159, 158, 157, 173, 246];
                    leftEyeIndices.forEach(index => drawLandmark(index, 'green'));

                    const rightEyeIndices = [362, 263, 387, 373, 380, 374, 373, 390, 388, 466];
                    rightEyeIndices.forEach(index => drawLandmark(index, 'green'));

                    drawLandmark(234, 'yellow');
                    drawLandmark(454, 'yellow');
                } else if (faces > 1) {
                    setMultipleFacesCounter(prev => prev + 1);
                    setFaceDetected(false);
                } else {
                    setFaceDetected(false);
                }
            } else {
                setFaceDetected(false);
            }
        }
    };

    const initializeFaceMesh = () => {
        const faceMeshInstance = new faceMesh.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMeshInstance.setOptions({
            maxNumFaces: 2,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMeshInstance.onResults(onResults);

        if (webCamRef.current) {
            const camera = new camUtils.Camera(webCamRef.current, {
                onFrame: async () => {
                    await faceMeshInstance.send({ image: webCamRef.current });
                },
                width: 640,
                height: 480,
                facingMode: "user",
            });

            camera.start();
        } else {
            console.error("webCamRef.current is not set");
        }
    };

    const initializeCamera = async () => {
        if (typeof navigator === "undefined") {
            console.error("Navigator is not defined");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (webCamRef.current) {
                webCamRef.current.srcObject = stream;
                console.log("Video stream set");
            } else {
                console.error("webCamRef.current is not set");
            }
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    };

    useEffect(() => {
        const runInitialize = async () => {
            if (typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia) {
                console.log("Media devices available.");
                await initializeCamera();
                initializeFaceMesh();
            } else {
                console.error("Media devices not available.");
            }
        };

        runInitialize();
    }, []);

    useEffect(() => {
        const checkFacePresence = () => {
            if (!faceDetected && (Date.now() - lastFaceDetectedTime) > 5000) {
                setNoFaceCounter(prev => prev + 1);
                setLastFaceDetectedTime(Date.now());
            }
        };

        const interval = setInterval(checkFacePresence, 1000);

        return () => clearInterval(interval);
    }, [faceDetected, lastFaceDetectedTime]);

    if (typeof window === 'undefined') {
        console.warn("Rendering on the server");
        return null; // Render nothing on the server
    }

    return (
        <div className="relative w-full h-full">
            <h1 className="text-2xl font-medium">Script Page for Rewriting Better JS</h1>
            <video ref={webCamRef} className="absolute -scale-x-100" autoPlay width="640" height="480" aria-label="webcam video"></video>
            <canvas ref={canvasRef} className="absolute -scale-x-100" width="640" height="480" aria-label="face detection canvas"></canvas>
            <div className="relative z-10 p-4 bg-white bg-opacity-75">
                <p>No Face Detected Counter: {noFaceCounter}</p>
                <p>Multiple Faces Detected Counter: {multipleFacesCounter}</p>
            </div>
        </div>
    );
};

export default ClientOnlyComponent;

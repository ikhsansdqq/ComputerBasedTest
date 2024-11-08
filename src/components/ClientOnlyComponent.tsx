"use client";

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceMesh from '@mediapipe/face_mesh';
import * as camUtils from '@mediapipe/camera_utils';

const TSHome = () => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [violations, setViolations] = useState<number>(() => {
        return parseInt(sessionStorage.getItem('violations') || '0', 10);
    });
    const [cheating, setCheating] = useState<boolean>(false);
    const [violationImages, setViolationImages] = useState<string[]>(() => {
        return JSON.parse(sessionStorage.getItem('violationImages') || '[]');
    });
    const [showEndSessionConfirm, setShowEndSessionConfirm] = useState<boolean>(false);

    const [multipleFacesDetected, setMultipleFacesDetected] = useState<boolean>(false);
    const [cameraAccessDenied, setCameraAccessDenied] = useState<boolean>(false);

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const violationTimeout = useRef<NodeJS.Timeout | null>(null);
    const multipleFacesTimeout = useRef<NodeJS.Timeout | null>(null);
    const downStareTimeout = useRef<NodeJS.Timeout | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleCheating = useCallback(() => {
        setCheating(true);
        if (webcamRef.current && webcamRef.current.video) {
            webcamRef.current.video.pause();
            (webcamRef.current.video.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());
        }
    }, []);

    const incrementViolations = useCallback(() => {
        setViolations(prev => {
            const newViolations = prev + 1;
            if (newViolations >= 10) {
                handleCheating();
            } else {
                captureImage();
            }
            return newViolations;
        });
    }, [handleCheating]);

    useEffect(() => {
        sessionStorage.setItem('violations', violations.toString());
    }, [violations]);

    const resetTimeout = (
        timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
        callback: () => void,
        delay: number
    ) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(callback, delay);
    };

    const captureImage = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setViolationImages(prev => {
                    const newImages = [...prev, imageSrc];
                    return newImages;
                });
            }
        }
    };

    useEffect(() => {
        sessionStorage.setItem('violationImages', JSON.stringify(violationImages));
    }, [violationImages]);

    const endSession = () => {
        // Store violations data in session storage for use on the results page
        sessionStorage.setItem('violations', violations.toString());
        sessionStorage.setItem('violationImages', JSON.stringify(violationImages));

        // Stop the camera stream if it’s active
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
            (webcamRef.current.video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }

        // Close the confirmation dialog and redirect to the results page
        setShowEndSessionConfirm(false);

        // Redirect to the results page and reset state after redirect
        router.push('/result');
    };


    const onEndSessionClick = () => {
        setShowEndSessionConfirm(true);
    };

    const onCancelEndSession = () => {
        setShowEndSessionConfirm(false);
    };

    useEffect(() => {
        const faceMeshInstance = new faceMesh.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMeshInstance.setOptions({
            maxNumFaces: 2,
            refineLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        const onResults = (results: faceMesh.Results) => {
            if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) return;

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context?.clearRect(0, 0, canvas.width, canvas.height);

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                setFaceDetected(true);
                resetTimeout(violationTimeout, incrementViolations, 5000);

                results.multiFaceLandmarks.forEach(landmarks => {
                    // Check face orientation
                    const noseTip = landmarks[1];
                    const leftEyeOuter = landmarks[33];
                    const rightEyeOuter = landmarks[263];

                    const faceTurnedDown = noseTip.y > leftEyeOuter.y && noseTip.y > rightEyeOuter.y;

                    if (faceTurnedDown) {
                        resetTimeout(downStareTimeout, incrementViolations, 3000);
                    } else {
                        if (downStareTimeout.current) {
                            clearTimeout(downStareTimeout.current);
                            downStareTimeout.current = null;
                        }
                    }

                    // Check for multiple faces
                    if (results.multiFaceLandmarks.length > 1) {
                        console.log('Other person detected!', results.multiFaceLandmarks.length);
                        setMultipleFacesDetected(true);

                        if (!multipleFacesTimeout.current) {
                            multipleFacesTimeout.current = setTimeout(() => {
                                incrementViolations();
                                multipleFacesTimeout.current = null;
                            }, 3000);
                        }
                    } else {
                        if (multipleFacesTimeout.current) {
                            clearTimeout(multipleFacesTimeout.current);
                            multipleFacesTimeout.current = null;
                        }
                        setMultipleFacesDetected(false);
                    }

                    // Draw the bounding box
                    if (context) {
                        const boundingBox = landmarks.reduce(
                            (box, landmark) => {
                                return {
                                    minX: Math.min(box.minX, landmark.x),
                                    minY: Math.min(box.minY, landmark.y),
                                    maxX: Math.max(box.maxX, landmark.x),
                                    maxY: Math.max(box.maxY, landmark.y),
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

                        // Draw points for Eyes and Ears
                        const drawLandmark = (index: number, color: string) => {
                            const x = landmarks[index].x * canvas.width;
                            const y = landmarks[index].y * canvas.height;
                            context.fillStyle = color;
                            context.beginPath();
                            context.arc(x, y, 3, 0, 2 * Math.PI);
                            context.fill();
                        };

                        const leftEyeIndices = [33, 133, 145, 153, 160, 159, 158, 157, 173, 246];
                        const rightEyeIndices = [362, 263, 387, 373, 380, 374, 373, 390, 388, 466];

                        const drawLandmarks = (indices: number[], color: string) => {
                            indices.forEach(index => drawLandmark(index, color));
                        };

                        drawLandmarks(leftEyeIndices, 'green');
                        drawLandmarks(rightEyeIndices, 'green');

                        drawLandmark(234, 'orange'); // Left ear
                        drawLandmark(454, 'orange'); // Right Ear
                    }
                });
            } else {
                setFaceDetected(false);
                if (!violationTimeout.current) {
                    resetTimeout(violationTimeout, incrementViolations, 5000);
                }
            }
        };

        faceMeshInstance.onResults(onResults);

        const initializeCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (webcamRef.current && webcamRef.current.video) {
                    webcamRef.current.video.srcObject = stream;

                    const camera = new camUtils.Camera(webcamRef.current.video, {
                        onFrame: async () => {
                            if (webcamRef.current && webcamRef.current.video) {
                                await faceMeshInstance.send({ image: webcamRef.current.video });
                            }
                        },
                        width: 1280,
                        height: 720,
                        facingMode: "user",
                    });
                    camera.start();
                }
            } catch (error) {
                console.error("Error accessing media devices.", error);
                setCameraAccessDenied(true);
            }
        };

        initializeCamera();

        const webcamElement = webcamRef.current;

        return () => {
            // Clear all timeouts
            [violationTimeout, multipleFacesTimeout, downStareTimeout].forEach(timeoutRef => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            });

            // Stop the camera stream using the local variable `webcamElement`
            if (webcamElement && webcamElement.video && webcamElement.video.srcObject) {
                (webcamElement.video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }

            faceMeshInstance.close();
        };
    }, [incrementViolations]);

    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href={'#'}><div className="text-white text-lg font-bold">CBT</div></Link>
                    <div className="hidden md:flex space-x-4">
                        <a href="#" className="text-white">Home</a>
                        <a href="#" className="text-white">About</a>
                        <a href="#" className="text-white">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto py-6 flex flex-col md:flex-row px-4 lg:px-0">
                {/* Left Column */}
                <div className="md:w-1/2 lg:pr-4">
                    {/* Hero Section */}
                    <section className="bg-blue-700 text-white text-center py-16 rounded">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Computer Based Test</h1>
                        <p className="text-lg md:text-xl">Efficient, Reliable, and Secure Online Testing</p>

                        <div className='flex gap-3 justify-center mt-8 items-center'>
                            {/* Violation Counter */}
                            <div className="bg-red-500 text-white p-4 rounded-full">
                                Violations: {violations}
                            </div>

                            {/* End Session Button */}
                            <div className="">
                                <button
                                    onClick={endSession}
                                    className="bg-blue-500 text-white p-4 rounded-full"
                                >
                                    End Session
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Accordion */}
                    <section className="pt-8 pb-3" id="about">
                        <h2 className="text-2xl font-bold text-center mb-8">About Computer Based Test</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'What is CBT?', content: 'CBT stands for Computer Based Test, a method of administering tests in which the responses are electronically recorded.' },
                                { title: 'Benefits of CBT', content: 'CBT offers several benefits including immediate feedback, flexibility in timing, and enhanced security.' },
                                { title: 'How to Prepare for CBT', content: 'To prepare for CBT, familiarize yourself with the testing format, practice with sample tests, and ensure your computer meets the technical requirements.' },
                                { title: 'CBT vs Traditional Testing', content: 'While traditional testing methods involve paper and pencil, CBT uses digital devices for a more streamlined process. CBT reduces paper usage and allows for faster result processing.' },
                                { title: 'Future of CBT', content: 'The future of CBT looks promising with advancements in AI and machine learning. These technologies will enable more personalized and adaptive testing experiences, making assessments fairer and more accurate.' }
                            ].map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-md">
                                    <button
                                        className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{item.title}</span>
                                            <span>{activeIndex === index ? '-' : '+'}</span>
                                        </div>
                                    </button>
                                    {activeIndex === index && (
                                        <div className="p-4 bg-white">
                                            <p>{item.content}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Storytelling Section */}
                    <section className="pt-8 pb-3">
                        <h2 className="text-2xl font-bold text-center mb-8">The Journey of Computer Based Testing</h2>
                        <p className="text-justify">
                            The journey of Computer Based Testing (CBT) began with the need to make assessments more efficient and reliable. In the past, traditional paper-based tests were the norm, but they came with several limitations such as logistical challenges, high costs, and environmental concerns. The digital revolution brought about a change, introducing CBT as a modern alternative.
                        </p>
                        <p className="text-justify mt-4">
                            Initially, CBT faced skepticism regarding its reliability and security. However, as technology advanced, so did the methods for ensuring the integrity of online exams. Proctoring solutions, such as the one we are developing, leverage advanced algorithms and facial recognition to monitor test-takers in real-time, ensuring that the exams are conducted fairly and securely.
                        </p>
                        <p className="text-justify mt-4">
                            Today, CBT is widely accepted and continues to evolve. With the integration of AI and machine learning, the future of CBT holds immense potential for adaptive testing. These advancements promise to provide personalized assessments tailored to each individual&apos;s learning pace and style, making education more inclusive and effective.
                        </p>
                        <p className="text-justify mt-4">
                            As we continue to innovate and improve our CBT platform, we remain committed to enhancing the testing experience for both examiners and examinees. Our goal is to make assessments more accessible, efficient, and secure, paving the way for a brighter future in education.
                        </p>
                    </section>
                </div>

                {/* Right Column */}
                <div className="md:w-1/2 h-fit justify-center items-center relative">
                    {cameraAccessDenied ? (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
                            <p>Camera access denied. Please allow camera access to continue.</p>
                        </div>
                    ) : (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full rounded shadow-md -scale-x-100"
                            />
                            <canvas ref={canvasRef} className={`absolute top-0 left-0 h-full w-full -scale-x-100 ${!faceDetected ? 'hidden' : ''}`} />
                            {!faceDetected && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center -scale-x-100 bg-gray-800 bg-opacity-50 text-white">
                                    <p className='-scale-x-100'>No face detected</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Violation Images */}
            <div className="container mx-auto py-6 px-4 lg:px-0">
                <h2 className="text-2xl font-bold text-center mb-4">Violation Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {violationImages.map((imageSrc, index) => (
                        <Image width={360} height={240} key={index} src={imageSrc} alt={`Violation`} className="w-full rounded shadow-md" />
                    ))}
                </div>
            </div>

            {/* Cheating Modal */}
            {cheating && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-md text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">YOU ARE CHEATING</h2>
                        <p className="text-lg">The test has been terminated.</p>
                    </div>
                </div>
            )}

            {/* End Session Confirmation */}
            {showEndSessionConfirm && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-md text-center">
                        <h2 className="text-2xl font-bold mb-4">End Session</h2>
                        <p className="text-lg mb-4">Are you sure you want to end the session?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={endSession}
                                className="bg-red-500 text-white p-4 rounded-full"
                            >
                                Yes
                            </button>
                            <button
                                onClick={onCancelEndSession}
                                className="bg-gray-500 text-white p-4 rounded-full"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Multiple Faces Warning */}
            {multipleFacesDetected && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-md text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Multiple Faces Detected</h2>
                        <p className="text-lg">Please ensure only one person is in view.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default dynamic(() => Promise.resolve(TSHome), {
    ssr: false,
});

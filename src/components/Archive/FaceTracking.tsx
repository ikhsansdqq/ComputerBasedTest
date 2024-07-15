// "use client";

// import { useState, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import * as faceMesh from '@mediapipe/face_mesh';
// import * as camUtils from '@mediapipe/camera_utils';

// const FaceTracking = () => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const toggleAccordion = (index: number) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   useEffect(() => {
//     const onResults = (results: faceMesh.Results) => {
//       if (canvasRef.current) {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');
//         if (context && results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//           context.clearRect(0, 0, canvas.width, canvas.height);
//           const landmarks = results.multiFaceLandmarks[0];
//           const boundingBox = landmarks.reduce(
//             (box, landmark) => {
//               return {
//                 minX: Math.min(box.minX, landmark.x),
//                 minY: Math.min(box.minY, landmark.y),
//                 maxX: Math.max(box.maxX, landmark.x),
//                 maxY: Math.max(box.maxY, landmark.y),
//               };
//             },
//             { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
//           );

//           context.strokeStyle = 'red';
//           context.lineWidth = 2;
//           context.strokeRect(
//             boundingBox.minX * canvas.width,
//             boundingBox.minY * canvas.height,
//             (boundingBox.maxX - boundingBox.minX) * canvas.width,
//             (boundingBox.maxY - boundingBox.minY) * canvas.height
//           );
//         }
//       }
//     };

//     const faceMeshInstance = new faceMesh.FaceMesh({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//     });

//     faceMeshInstance.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMeshInstance.onResults(onResults);

//     if (webcamRef.current?.video) {
//       const camera = new camUtils.Camera(webcamRef.current.video, {
//         onFrame: async () => {
//           await faceMeshInstance.send({ image: webcamRef.current?.video });
//         },
//         width: 1280,
//         height: 720,
//       });
//       camera.start();
//     }
//   }, []);

//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="bg-gray-800 p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="text-white text-lg font-bold">CBT</div>
//           <div className="hidden md:flex space-x-4">
//             <a href="#home" className="text-white">Home</a>
//             <a href="#about" className="text-white">About</a>
//             <a href="#contact" className="text-white">Contact</a>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container mx-auto py-6 flex flex-col md:flex-row px-4 lg:px-0">
//         {/* Left Column */}
//         <div className="md:w-1/2 lg:pr-4">
//           {/* Hero Section */}
//           <section className="bg-blue-600 text-white text-center py-20 rounded">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Computer Based Test</h1>
//             <p className="text-lg md:text-xl">Efficient, Reliable, and Secure Online Testing</p>
//           </section>

//           {/* Accordion */}
//           <section className="pt-8 pb-3" id="about">
//             <h2 className="text-2xl font-bold text-center mb-8">About Computer Based Test</h2>
//             <div className="space-y-4">
//               {[
//                 { title: 'What is CBT?', content: 'CBT stands for Computer Based Test, a method of administering tests in which the responses are electronically recorded.' },
//                 { title: 'Benefits of CBT', content: 'CBT offers several benefits including immediate feedback, flexibility in timing, and enhanced security.' },
//                 { title: 'How to Prepare for CBT', content: 'To prepare for CBT, familiarize yourself with the testing format, practice with sample tests, and ensure your computer meets the technical requirements.' }
//               ].map((item, index) => (
//                 <div key={index} className="border border-gray-200 rounded-md">
//                   <button
//                     className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
//                     onClick={() => toggleAccordion(index)}
//                   >
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">{item.title}</span>
//                       <span>{activeIndex === index ? '-' : '+'}</span>
//                     </div>
//                   </button>
//                   {activeIndex === index && (
//                     <div className="p-4 bg-white">
//                       <p>{item.content}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* Right Column */}
//         <div className="md:w-1/2 lg:pl-4 justify-center items-center relative">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             className="w-full h-full rounded shadow-md"
//           />
//           <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceTracking;

import Link from 'next/link';

const DevLog = () => {
    const logs = [
        {
            date: '2024-07-31',
            task: 'Develop a Computer-Based Test (CBT) application with live face tracking and detection features.',
            changes: [
                'Initial Setup: Set up a basic Next.js project structure. Integrated @mediapipe/face_mesh and @mediapipe/camera_utils for face detection.',
                'Webcam and Face Detection: Implemented a component to capture video from the user\'s webcam using the Webcam library. Set up a face detection model using @mediapipe/face_mesh.',
                'Violation Detection Logic: Implemented face off-screen detection, multiple faces detection, and face orientation detection with appropriate warnings and violations.',
                'Screenshot Capture on Violation: Configured the application to take a screenshot each time a violation is triggered and displayed captured violation images in a grid on the page.',
                'Session Management: Added session management to handle the start and end of the test and implemented a modal to confirm the end of the session.',
                'Face Detection Visualization: Implemented visualization of face landmarks and bounding boxes on a canvas overlay. Ensured bounding boxes are drawn for all detected faces.',
                'Error Handling: Added checks to handle cases where the user denies camera access. Displayed appropriate messages and UI elements to inform the user about the camera access status.',
                'Logging and Debugging: Added console logs to track when multiple faces are detected and used these logs for debugging and ensuring the detection logic works correctly.',
                'Code Enhancements and Fixes: Ensured all hooks have the necessary dependencies to avoid eslint warnings. Improved the detection logic to prevent multiple increments of violations for the same event.',
            ],
            nextSteps: [
                'Further optimization to handle higher concurrency.',
                'Detailed testing to ensure the system\'s stability and accuracy under different conditions.'
            ],
            timestamp: '2024-07-31: Completed the core functionality for live face tracking, violation detection, and session management.'
        }
    ];

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Developer Logs</h1>
            {logs.map((log, index) => (
                <div key={index} className="border-b border-gray-300 pb-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2">{log.date}</h2>
                    <h3 className="text-xl font-semibold mb-2">Task:</h3>
                    <p>{log.task}</p>
                    <h3 className="text-xl font-semibold mt-4 mb-2">Summary of Changes and Implementations:</h3>
                    <ul className="list-disc list-inside">
                        {log.changes.map((change, idx) => (
                            <li key={idx}>{change}</li>
                        ))}
                    </ul>
                    <h3 className="text-xl font-semibold mt-4 mb-2">Next Steps:</h3>
                    <ul className="list-disc list-inside">
                        {log.nextSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ul>
                    <p className="mt-4"><strong>Timestamp:</strong> {log.timestamp}</p>
                </div>
            ))}
        </div>
    );
};

export default DevLog;

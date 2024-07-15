import { useEffect, useState } from 'react';

interface DeviceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceCheckModal: React.FC<DeviceCheckModalProps> = ({ isOpen, onClose }) => {
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [webGLSupport, setWebGLSupport] = useState(false);
  const [internetSpeed, setInternetSpeed] = useState<number | null>(null);

  useEffect(() => {
    // Check camera availability
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setCameraAvailable(true))
      .catch(() => setCameraAvailable(false));

    // Check WebGL support
    const canvas = document.createElement('canvas');
    setWebGLSupport(!!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

    // Check internet speed
    const image = new Image();
    const startTime = Date.now();
    image.onload = () => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = 5000000 * 8; // 5MB image size
      const speedBps = bitsLoaded / duration;
      const speedKbps = speedBps / 1024;
      const speedMbps = speedKbps / 1024;
      setInternetSpeed(speedMbps);
    };
    image.src = 'https://via.placeholder.com/5000';
  }, []);

  const allChecksPassed = cameraAvailable && webGLSupport && internetSpeed !== null && internetSpeed > 1;

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Checking Device’s Availability</h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span>Camera</span>
            <span>{cameraAvailable ? '✔️' : '❌'}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>WebGL Support</span>
            <span>{webGLSupport ? '✔️' : '❌'}</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Checking Internet Speed</span>
            <span>{internetSpeed !== null ? `${internetSpeed.toFixed(2)} Mbps` : '⏳'}</span>
          </li>
        </ul>
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-full"
            disabled={!allChecksPassed}
          >
            {allChecksPassed ? 'Continue' : 'Try Again'}
          </button>
          {!allChecksPassed && (
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default DeviceCheckModal;

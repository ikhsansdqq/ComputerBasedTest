import React, { useEffect, useState, useCallback } from 'react';

interface DeviceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MINIMUM_INTERNET_SPEED = 1; // Mbps

const useDeviceChecks = (isOpen: boolean) => {
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  const [webGLSupport, setWebGLSupport] = useState<boolean | null>(null);
  const [internetSpeed, setInternetSpeed] = useState<number | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  const runChecks = useCallback(() => {
    let isMounted = true;
    setChecking(true);
    setCameraAvailable(null);
    setWebGLSupport(null);
    setInternetSpeed(null);

    // Check camera availability
    const checkCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        if (isMounted) setCameraAvailable(true);
      } catch (error) {
        if (isMounted) setCameraAvailable(false);
      }
    };

    // Check WebGL support
    const checkWebGL = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (isMounted) setWebGLSupport(!!gl);
    };

    // Check internet speed
    const checkInternetSpeed = () => {
      const image = new Image();
      const startTime = Date.now();
      const imageSizeBytes = 5 * 1024 * 1024; // 5MB
      let timeoutId: NodeJS.Timeout;

      const onLoad = () => {
        if (!isMounted) return;
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = imageSizeBytes * 8;
        const speedBps = bitsLoaded / duration;
        const speedMbps = speedBps / (1024 * 1024);
        setInternetSpeed(speedMbps);
        clearTimeout(timeoutId);
      };

      const onError = () => {
        if (!isMounted) return;
        setInternetSpeed(null);
        clearTimeout(timeoutId);
      };

      image.onload = onLoad;
      image.onerror = onError;
      image.src = 'https://yourdomain.com/5MBImage.jpg'; // Use a real image URL

      // Timeout after 10 seconds
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setInternetSpeed(null);
      }, 10000);
    };

    checkCamera();
    checkWebGL();
    checkInternetSpeed();

    // Finish checking when all results are in
    const intervalId = setInterval(() => {
      if (
        cameraAvailable !== null &&
        webGLSupport !== null &&
        internetSpeed !== null
      ) {
        if (isMounted) setChecking(false);
        clearInterval(intervalId);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [cameraAvailable, webGLSupport, internetSpeed]);

  useEffect(() => {
    if (isOpen) {
      runChecks();
    }
  }, [isOpen, runChecks]);

  return {
    cameraAvailable,
    webGLSupport,
    internetSpeed,
    checking,
    runChecks,
  };
};

const DeviceCheckModal: React.FC<DeviceCheckModalProps> = ({ isOpen, onClose }) => {
  const {
    cameraAvailable,
    webGLSupport,
    internetSpeed,
    checking,
    runChecks,
  } = useDeviceChecks(isOpen);

  const allChecksPassed =
    cameraAvailable === true &&
    webGLSupport === true &&
    internetSpeed !== null &&
    internetSpeed > MINIMUM_INTERNET_SPEED;

  const handleRetry = () => {
    runChecks();
  };

  return isOpen ? (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-check-modal-title"
    >
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 id="device-check-modal-title" className="text-2xl font-bold mb-4">
          Checking Device’s Availability
        </h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span>Camera Access</span>
            <span>
              {cameraAvailable === null
                ? '⏳'
                : cameraAvailable
                  ? '✔️'
                  : '❌'}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>WebGL Support</span>
            <span>
              {webGLSupport === null
                ? '⏳'
                : webGLSupport
                  ? '✔️'
                  : '❌'}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span>Internet Speed</span>
            <span>
              {internetSpeed === null
                ? '⏳'
                : `${internetSpeed.toFixed(2)} Mbps`}
            </span>
          </li>
        </ul>
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-full"
            disabled={!allChecksPassed}
          >
            {allChecksPassed ? 'Continue' : 'Close'}
          </button>
          {!allChecksPassed && (
            <button
              onClick={handleRetry}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
              disabled={checking}
            >
              Retry
            </button>
          )}
        </div>
        {!allChecksPassed && !checking && (
          <div className="mt-4 text-red-500">
            <p>Please ensure all requirements are met to proceed:</p>
            <ul className="list-disc list-inside">
              {cameraAvailable === false && (
                <li>Allow camera access in your browser settings.</li>
              )}
              {webGLSupport === false && (
                <li>Update your browser to a version that supports WebGL.</li>
              )}
              {internetSpeed !== null &&
                internetSpeed <= MINIMUM_INTERNET_SPEED && (
                  <li>Your internet speed is too low. Please check your connection.</li>
                )}
            </ul>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default DeviceCheckModal;

import { mod } from '@tensorflow/tfjs-core';
import dynamic from 'next/dynamic';
import { WebcamProps } from 'react-webcam';

const DynamicWebcam = dynamic(() => import('react-webcam').then(mod => mod.default as any) as any, {
    ssr: false
})

export default DynamicWebcam;
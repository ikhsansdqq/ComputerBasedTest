import Head from 'next/head';
import ExamMonitoring from '../components/ExamMonitoring';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar/>
      <ExamMonitoring/>
    </>
  );
}

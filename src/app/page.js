import Head from 'next/head';
import ExamMonitoring from '../components/ExamMonitoring';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Exam Monitoring with TensorFlow.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Exam Monitoring using TensorFlow.js in Next.js</h1>
        <ExamMonitoring />
      </main>
    </div>
  );
}

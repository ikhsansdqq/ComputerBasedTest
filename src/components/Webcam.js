import Head from "next/head"

const Webcam = () => {
    return (
        <div>
            <Head>
                <title>Webcam</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="max-w-[960px] bg-gray-100 mx-auto py-3 lg:py-4">
                <h1 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">CBT Website for Student</h1>
                <div>
                    <video id="webcam" width="640" height="480"></video>
                </div>
            </main>
        </div>
    )
}

export default Webcam;
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8 px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Computer Based Test (CBT) System
          </h1>
          <p className="mt-8 text-center text-base text-gray-600">
            This examination will be conducted online. Please make sure you have a good internet connection and a compatible device. You can check your hardware compatibility below.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/check">
            <div className="group border rounded-lg p-6 bg-white transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
              <div className="flex items-center space-x-4">
                <Image width={240} height={240} src="/ts_logo.png" alt="Typescript Page" className="h-12 w-12 rounded" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Check Hardware Compatibility</h3>
                  <p className="text-sm text-gray-600">
                    Make sure to have your hardware ready, and you can start your examination. It&apos;s easy to use and you can do it by yourself.
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/js">
            <div className="group border rounded-lg p-6 bg-white shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
              <div className="flex items-center space-x-4">
                <Image width={240} height={240} src="/js_logo.png" alt="Javascript Page" className="h-12 w-12 rounded" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Javascript Page</h3>
                  <p className="text-sm text-gray-600">
                    It&apos;s a best option for you to explore or do something for all by yourself. Later, you can create a team workspace, that&apos;s easy.
                  </p>
                  <span className='text-sm font-normal text-gray-600 mt-4'>(On Progress)</span>
                </div>
              </div>
            </div>
          </Link>
          <button className='mt-12 w-full px-4 py-3 rounded text-white bg-red-700 hover:shadow-md hover:bg-red-800 transition duration-300'>Report any issue</button>
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Let&apos;s start
          </button>
        </div>
      </div>
    </div>
  );
};
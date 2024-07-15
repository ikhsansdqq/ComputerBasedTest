import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NotFoundPage = () => {
  const articles = [
    { title: 'Did You Know?', content: 'The first computer virus was created in 1983.' },
    { title: 'Did You Know?', content: 'The first 1GB hard drive, announced in 1980, weighed over 500 pounds.' },
    { title: 'Did You Know?', content: 'More than 3.5 billion Google searches are conducted worldwide each day.' },
    // Add more articles as needed
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex max-w-4xl w-full">
        {/* Left Side */}
        <div className="w-1/2 p-8">
          <Image width={240} height={240} src="/figma-logo.png" alt="Figma Logo" className="h-12 w-12 mb-6 rounded shadow-md" />
          <h2 className="text-2xl font-semibold mb-4">404 - Page Not Found</h2>
          <p className="text-gray-600 mb-2">Sorry, the page you are looking for does not exist.</p>
          <p className="text-gray-400 text-sm">
            © 2024-2025 ikhsansdq. All rights reserved.
            <br />
            Platform created using NextJS 14 by Ikhsan Assidiqie. For more details and legal notices, go to the About Project screen.
          </p>

          <Link href='/'><button className='mt-8 w-full px-4 py-3 rounded text-white bg-blue-600 hover:shadow-lg hover:bg-blue-700 transition duration-300'>Back to home</button></Link>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-8 bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Did You Know?</h3>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-md">
                <h4 className="text-lg font-semibold">{article.title}</h4>
                <p className="text-gray-700">{article.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ResultPage = () => {
    const [violations, setViolations] = useState<number | null>(null);
    const [violationImages, setViolationImages] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Retrieve violations data from sessionStorage
        const storedViolations = sessionStorage.getItem('violations');
        const storedImages = sessionStorage.getItem('violationImages');

        if (storedViolations) setViolations(parseInt(storedViolations, 10));
        if (storedImages) setViolationImages(JSON.parse(storedImages));
    }, []);

    const handleBackToHomepage = () => {
        // Clear data from sessionStorage
        sessionStorage.removeItem('violations');
        sessionStorage.removeItem('violationImages');

        // Redirect to homepage
        router.push('/');
    };

    return (
        <div className="container mx-auto py-6 px-4 lg:px-0">
            <h2 className="text-2xl font-bold text-center mb-4">Session Results</h2>

            <div className="text-center">
                <p className="text-lg font-medium">
                    Total Violations: {violations !== null ? violations : 'Loading...'}
                </p>
            </div>

            <div className="text-center mt-8">
                <h3 className="text-xl font-semibold mb-4">Violation Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {violationImages.length > 0 ? (
                        violationImages.map((src, index) => (
                            <Image
                                key={index}
                                width={360}
                                height={240}
                                src={src}
                                alt={`Violation ${index + 1}`}
                                className="w-full rounded shadow-md"
                            />
                        ))
                    ) : (
                        <p className="col-span-full">No violations recorded.</p>
                    )}
                </div>
            </div>

            <div className="text-center mt-10">
                <button
                    onClick={handleBackToHomepage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                    Back to Homepage
                </button>
            </div>
        </div>
    );
};

export default ResultPage;

"use client"
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Soal1 from '../assets/images/Soal1.png'
import Image from 'next/image'
import { RiArrowUpSLine, RiArrowDownSLine  } from "react-icons/ri";
import { useSelector } from 'react-redux';
const ExamMonitoring = () => {
    const webcamRef = useRef < Webcam > (null)
    const [isOpenClientInfo, setIsOpenClientInfo] = useState(false);
    const [isOpenMLInfo, setIsOpenMLInfo] = useState(false);
    var [valueFontSize, setValueFontSize] = useState(20)
    var [valueLineHeight, setValueLineHeight] = useState(32)
    var [valueLetter, setValueLetter] = useState(2.5)
    const webcam = useSelector(state => state.webcam);

    const toggleClientInformation = () => {
        setIsOpenClientInfo(!isOpenClientInfo);
    };
    const toggleMLInformation = () => {
        setIsOpenMLInfo(!isOpenMLInfo);
    };
    const increaseFontSize = () => {
        setValueFontSize(prevValue => (prevValue < 20 ? prevValue + 2 : prevValue));
        setValueLineHeight(prevValue => (prevValue < 32 ? prevValue + 4 : prevValue));
        setValueLetter(prevValue => (prevValue < 2.5 ? prevValue + 0.5 : prevValue));
    };

    const decreaseFontSize = () => {
        setValueFontSize(prevValue => (prevValue >= 10 ? prevValue - 2 : prevValue));
        setValueLineHeight(prevValue => (prevValue >= 12 ? prevValue - 4 : prevValue));
        setValueLetter(prevValue => (prevValue >= 0 ? prevValue - 0.5 : prevValue));
    };
    return (
        <div className='mx-[240px]'>
            <div className='relative flex justify-between'>
                <div className=' flex flex-col items-center gap-6'>
                    {webcam ? <Webcam className='w-[640px] h-[310px]' /> : ''}
                    <p>Violation Count: 0 / 10</p>
                    <div className='flex gap-3'>
                        <button onClick={increaseFontSize} className='border px-4 py-2 rounded-sm'>+</button>
                        <button onClick={decreaseFontSize} className='border px-4 py-2 rounded-sm'>-</button>
                    </div>
                    <div className=" bg-white border rounded-xl  w-full">
                        <div className="">
                            <div className="p-6">
                                <div className="flex justify-between items-center w-full">
                                    <div className=" text-[20px] text-black font-semibold">Client Information</div>
                                    <button onClick={toggleClientInformation} className="text-[24px] focus:outline-none">
                                        {isOpenClientInfo ? <RiArrowUpSLine/> : <RiArrowDownSLine/>}
                                    </button>
                                </div>
                                {isOpenClientInfo && (
                                    <div className="mt-4">
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Web camera name</span>
                                            <span className="font-medium">ZEISS Optic</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Video Resolution</span>
                                            <span className="font-medium">1920x1080 (60 FPS)</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Date Time Started</span>
                                            <span className="font-medium">Tuesday, 16 June 2024 12:02 GMT+7</span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-gray-500">Operating System</span>
                                            <span className="font-medium">Windows 11</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className=" bg-white rounded-xl  border w-full">
                        <div className="">
                            <div className="p-6">
                                <div className="flex justify-between items-center w-full">
                                    <div className=" text-[20px]  font-semibold">Machine Learning Information</div>
                                    <button onClick={toggleMLInformation} className=" focus:outline-none text-[28px]">
                                        {isOpenMLInfo ? <RiArrowUpSLine/> : <RiArrowDownSLine />}
                                    </button>
                                </div>
                                {isOpenMLInfo && (
                                    <div className="mt-4">
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Web camera name</span>
                                            <span className="font-medium">ZEISS Optic</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Video Resolution</span>
                                            <span className="font-medium">1920x1080 (60 FPS)</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 py-3">
                                            <span className="text-gray-500">Date Time Started</span>
                                            <span className="font-medium">Tuesday, 16 June 2024 12:02 GMT+7</span>
                                        </div>
                                        <div className="flex justify-between mt-3">
                                            <span className="text-gray-500">Operating System</span>
                                            <span className="font-medium">Windows 11</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[704px]'>
                    <h1 className='font-semibold text-[24px] leading-8 tracking-[2.5%] mb-6'>Question 1 of 5</h1>
                    <div className='flex flex-col gap-6 mb-6'>
                        <p className={`text-[${valueFontSize}px] leading-[${valueLineHeight}] tracking-[${valueLetter}%]`}>Describe the process of how a basic cryptographic system works, including the roles of encryption and decryption, keys, and algorithms. Illustrate your answer with an example of how data is encrypted and decrypted using both symmetric and asymmetric key encryption. Finally, explain the challenges associated with key management and distribution in cryptographic systems.</p>
                        <Image src={Soal1} />
                        <p className={`text-[${valueFontSize}px] leading-[${valueLineHeight}] tracking-[${valueLetter}%]`}>Asymmetric Key Encryption: Uses a pair of keys – a public key for encryption and a private key for decryption. The public key can be shared openly, but the private key must be kept secure.</p>
                        <p className={`text-[${valueFontSize}px] leading-[${valueLineHeight}] tracking-[${valueLetter}%]`}>Which property of a cryptographic system ensures that a message cannot be altered without detection?</p>
                    </div>
                    <p className='font-medium text-[20px] leading-8 tracking-[2.5%] italic text-[#5D5D5D] mb-5'>Select one answer</p>
                    <div className='flex flex-col gap-3'>
                        <div className="flex items-center px-6 py-4 rounded-lg border hover:bg-blue-50 transition cursor-pointer">
                            <input id="default-radio-1" type="radio" value="Binary Tree" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 " />
                            <label htmlFor="default-radio-1" className="ms-2 text-[18px] font-medium leading-6 tracking-[2.5%] cursor-pointer">Binary Tree</label>
                        </div>
                        <div className="flex items-center px-6 py-4 rounded-lg border hover:bg-blue-50 transition cursor-pointer">
                            <input id="default-radio-2" type="radio" value="Neural Network" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 " />
                            <label htmlFor="default-radio-2" className="ms-2 text-[18px] font-medium leading-6 tracking-[2.5%] cursor-pointer">Neural Network</label>
                        </div>
                        <div className="flex items-center px-6 py-4 rounded-lg border hover:bg-blue-50 transition cursor-pointer">
                            <input id="default-radio-3" type="radio" value="Blockchain" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 " />
                            <label htmlFor="default-radio-3" className="ms-2 text-[18px] font-medium leading-6 tracking-[2.5%] cursor-pointer">Blockchain</label>
                        </div>
                        <div className="flex items-center px-6 py-4 rounded-lg border hover:bg-blue-50 transition cursor-pointer">
                            <input id="default-radio-4" type="radio" value="Quantum Circuit" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 " />
                            <label htmlFor="default-radio-4" className="ms-2 text-[18px] font-medium leading-6 tracking-[2.5%] cursor-pointer">Quantum Circuit</label>
                        </div>
                    </div>
                    <button className='py-3 px-[42px] bg-black text-white w-fit rounded-lg my-[36px]'>Next</button>
                </div>
            </div>
        </div>
    )
}

export default ExamMonitoring
"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../assets/images/Logo.png'
import { useDispatch } from 'react-redux'
import { turnOffWebcam, turnOnWebcam } from '../../../redux'

const Navbar = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTurnOffWebcam = () => {
    setIsModalOpen(true);
  };

  const handleTurnOnWebcam = () => {
    dispatch(turnOnWebcam());
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmExit = () => {
    dispatch(turnOffWebcam());
    setIsModalOpen(false);
  };

  const DeleteModal = () => {
    return (
      <>
        <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-10 rounded-md">
            <div className="modal-content">
              <p className='mb-4'>Apakah Anda yakin ingin mengakhiri sesi ini?</p>
              <div className='flex items-center justify-between'>
                <button className='px-3 py-2 bg-green-500 rounded-md text-white' onClick={handleConfirmExit}>Ya</button>
                <button className='px-3 py-2 bg-red-500 rounded-md text-white' onClick={handleCloseModal}>Tidak</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='flex justify-between mx-[240px] items-center py-8'>
      <Image
        alt='Logo'
        src={Logo}
        height={48}
        width={172}
        onContextMenu={(e) => e.preventDefault()}
        draggable="false"
      />
      <p>Ikhsan Assidiqie (1301213047)</p>
      <button className='border rounded-sm px-4 py-2' onClick={handleTurnOffWebcam}>Exit</button>
      {isModalOpen && <DeleteModal />}
    </div>
  )
}

export default Navbar

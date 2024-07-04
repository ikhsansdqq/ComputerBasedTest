import Image from 'next/image'
import React from 'react'
import Logo from '../../assets/images/Logo.png'
const Navbar = () => {
  return (
    <div className='flex justify-between mx-[240px] items-center py-8'>
        <Image src={Logo} height={48} width={172}/>
        <p>Ikhsan Assidiqie (1301213047)</p>
        <button className='border rounded-sm px-4 py-2'>Exit</button>
    </div>
  )
}

export default Navbar
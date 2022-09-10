import React from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'



function Login() {
   const { openConnectModal } = useConnectModal();

  return (
    <div className='bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col items-center mb-10'>
        <img className='rounded-full h-56 w-56 mb-10 ' src='https://i.imgur.com/uPvFvZe.jpg' alt='' />
        <h1 className='text-6xl text-white font-bold'>SKU LOTTERY 🎰</h1>
        <h2 className='text-white'>Get Started by logging in with Metamask</h2>
        <button onClick={openConnectModal} className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Login With MetaMask</button>
        </div>
    </div>
  )
}

export default Login
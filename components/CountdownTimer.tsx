import React from 'react'
import { useContract, useContractRead } from 'wagmi'
import abi from '../assets/abi.json'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

type Props = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};


function CountdownTimer() {

  const { data: expiration, isLoading: isLoadingExpiration } = useContractRead({
    addressOrName: '0xE84D04412BF4a6bD5c6d2354b272aF098ae0F723',
    contractInterface: abi,
    functionName: 'expiration'
  })

  const renderer = ({ days, hours, minutes, seconds, completed }: Props) => {
    if (completed) {
      return (
        <div>
          <h2 className='text-white text-xl text-center animate-pulse pb-2'>Ticket Sales have now CLOSED for this draw</h2>

          <div className='flex space-x-6'>

          <div  className='flex-1'>
              <div className='countdown animate-pulse'>{days}</div>
              <div className='countdown-label'>days</div>
            </div>

            <div  className='flex-1'>
              <div className='countdown animate-pulse'>{hours}</div>
              <div className='countdown-label'>hours</div>
            </div>

            <div className='flex-1'>
              <div className='countdown animate-pulse'>{minutes}</div>
              <div className='countdown-label'>minutes</div>
            </div>

            <div className='flex-1'>
              <div className='countdown animate-pulse'>{seconds}</div>
              <div className='countdown-label'>seconds</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h3 className='text-white text-sm mb-2 italic'>Time Remaining</h3>
          <div className='flex space-x-6'>

          <div  className='flex-1'>
              <div className='countdown'>{days}</div>
              <div className='countdown-label'>days</div>
            </div>


            <div  className='flex-1'>
              <div className='countdown'>{hours}</div>
              <div className='countdown-label'>hours</div>
            </div>

            <div className='flex-1'>
              <div className='countdown'>{minutes}</div>
              <div className='countdown-label'>minutes</div>
            </div>

            <div className='flex-1'>
              <div className='countdown'>{seconds}</div>
              <div className='countdown-label'>seconds</div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <Countdown date={new Date(Number(expiration) * 1000)} renderer={renderer} />
    </div>
  )
}

export default CountdownTimer
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Login from '../components/Login'
import { useAccount, useContract, useProvider, useBalance, useContractRead, etherscanBlockExplorers, usePrepareContractWrite, useContractWrite } from 'wagmi'
import abi from '../assets/abi.json'
import { useState, useEffect } from 'react'
import LoadingSreen from '../components/LoadingSreen'
import { ethers } from 'ethers'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'
import errorHandle from "../assets/errorHandle"
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'


const Home: NextPage = () => {
  const { address } = useAccount();
  const [userTickets, setUserTickets] = useState(0)
  const [quantity, setQuantity] = useState<number>(1);
  const provider = useProvider()

  const { data: remainingTickets} = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'RemainingTickets',
    watch: true
  })

  const { data: winnings } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'getWinningsForAddress',
    args: address
  })

  const { data: expiration } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'expiration'
  })

  const {data: currentWinningReward } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'CurrentWinningReward',
    watch: true
  })

  const { data: tickets } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'getTickets',
  })

  const {data: currentTicketPrice } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'ticketPrice',
  })

  const {data: ticketComission } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'ticketCommission'
  })

  const {data: lastWinner } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'lastWinner'
  })

  const {data: lastWinnerAmount } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'lastWinnerAmount'
  })

  const {data: isLotteryOperator } = useContractRead({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'lotteryOperator'
  })

  const { config: buyConfig, error: buyError, isSuccess: buySuccess } = usePrepareContractWrite({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'BuyTickets',
    overrides: {
      from: address,
      value: ethers.utils.parseEther(String(Number('0.01') * quantity))
    }, 
  })

  const { config: withdrawConfig, error: withdrawError, isSuccess: withdrawSuccess } = usePrepareContractWrite({
    addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
    contractInterface: abi,
    functionName: 'WithdrawWinnings',
  })

  const { writeAsync: buyTicketsAsync } = useContractWrite(buyConfig)

  const { writeAsync: withdrawWinningsAsync } = useContractWrite(withdrawConfig)

  useEffect(() => {
    if (!tickets) return;

    const totalTickets = tickets;

    const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)

    setUserTickets(noOfUserTickets);
  }, [tickets, address])

  const handleClick = async () => {
    if (!currentTicketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      if (buySuccess) {
        await buyTicketsAsync?.()

        toast.success("Tickets purchased successfully!", {
        id: notification
        });

      } else {
        toast.error(buyError && await errorHandle(buyError), {
          id: notification
        });
      }
    }
    catch (e) {
      toast.error("Whoops something went wrong!", {
        id: notification
      });

      console.error("contract call failure", e);
    }
  }

  const onWithdrawWinnings = async () => {

    const notification = toast.loading("Withdrawing winnings...");

    try {
      if (withdrawSuccess) {
        await withdrawWinningsAsync?.();

        toast.success("Winnings withdrawn successfully!", {
          id: notification
        })
      }
    } catch (e) {
      toast.error("Whoops something went wrong!", {
        id: notification
      });
      console.log(e);
    }
  }

  if (!address) return (<Login />)

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>
        <div className='flex space-x-2 mx-10'>
          <h4 className='text-white font-bold'>Last Winner: {lastWinner}</h4>
          <h4 className='text-white font-bold '>Previous Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount)}{" "} ETH</h4>
        </div>
      </Marquee>

      {isLotteryOperator && String(isLotteryOperator) === address && (
        <div className='flex justify-center'>
          <AdminControls />
        </div>
      ) }

      {winnings && Number(winnings) > 0 && (
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
            <p className='font-bold text-white'>You have won!</p>
            <p className='text-white'>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "} ETH</p>
            <br />
            <p className='font-semibold text-white'>Click here to withdraw</p>
          </button>
        </div>
      )}

      <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
        <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center'>
            The Next Draw
          </h1>

          <div className='flex justify-between p2 space-x-2 mt-5'>
              <div className='stats'>
              <h2 className='text-sm'>Total Pool</h2>
              <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward)}{" "} ETH</p>
              </div>
              <div className="stats">
              <h2 className='text-sm'>Tickets Remaining </h2>
              <p className='text-xl'>{remainingTickets?.toNumber()}</p>
              </div>
          </div>
          <div className='mt-5 mb-3'>
            <CountdownTimer />
          </div>
        </div>

        <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className='flex justify-between items-center text-white pb-2'>
                <h2>Price per ticket</h2>
                <p>{currentTicketPrice && ethers.utils.formatEther(currentTicketPrice)}{" "} ETH</p>
              </div>

              <div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4'>
                <p>
                  TICKETS
                </p>
                <input className='flex w-full bg-transparent text-right outline-none' 
                type='number' 
                min={1} 
                max={10} 
                value={quantity} 
                onChange={e => setQuantity(Number(e.target.value))}/>
              </div>

              <div className='space-y-2 mt-5'>
                <div className='flex items-center justify-between text-emerald-300 text-sm italic font-extrabold'>
                  <p>Total cost of tickets</p>
                  <p>{currentTicketPrice && Number(ethers.utils.formatEther(currentTicketPrice)) * quantity}{" "} ETH</p>
                </div>

                <div className='flex  items-center justify-between text-emerald-300 text-xs italic'>
                  <p>Service fees</p>
                  <p>{ticketComission && ethers.utils.formatEther(ticketComission)}{" "} ETH</p>
                </div>

                <button 
                onClick={handleClick}
                disabled={expiration && expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0} 
                className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 font-semibold rounded-md text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-600 disabled:cursor-not-allowed'>
                  Buy {quantity} Tickets for {currentTicketPrice && Number(ethers.utils.formatEther(currentTicketPrice.toString())) * quantity}{" "} ETH
                  </button>

                {userTickets > 0 && <div className='stats'>
                  <p className='text-center mb-2 font-bold text-lg'>You have {userTickets} tickets in this draw</p>
                  <div className='flex max-w-m flex-wrap gap-x-2 gap-y-2'>
                    {Array(userTickets).fill("").map((_, index) => (
                      <p className='text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic' key={index}>{index + 1}</p>
                    ))}
                  </div>
                  </div>}
              </div>
            </div>
          </div>
      </div>

      <footer className='border-t border-emerald-500/20 flex items-center text-center text-white p-5 md:mt-80'>
          <img className='h-10 w-10 filter hue-rotate-30 opacity-20 rounded-full' src='https://i.imgur.com/uPvFvZe.jpg' alt=''></img>
          <p className='text-xs text-emerald-900 pl-5'> DISCLAIMER: PURCHASING A LOTTERY TICKET IS CONSIDERED GAMBLING. THEREFORE YOU FALL RESPONSIBLE OF THE FUNDS YOU DEPOSIT IN THE CONTRACT. PLEASE DEGEN RESPONSIBLY AS ALWAYS! GOODLUCK TO ALL PARTICIPANTS 🍀 </p>
      </footer>
    </div>
  )
}

export default Home

import React from 'react';
import {
    StarIcon, 
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnDownIcon,
} from '@heroicons/react/24/solid';
import { useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import abi from '../assets/abi.json';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

function AdminControls() {

    const {data: totalCommission } = useContractRead({
        addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
        contractInterface: abi,
        functionName: 'operatorTotalCommission'
    })

    const { config: drawWinnerConfig , error: drawWinnerError, isSuccess: drawWinnerSuccess } = usePrepareContractWrite({
        addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
        contractInterface: abi,
        functionName: 'DrawWinnerTicket'
    })

    const { config: withdrawConfig , error: withdrawError, isSuccess: withdrawSuccess } = usePrepareContractWrite({
        addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
        contractInterface: abi,
        functionName: 'WithdrawCommission'
    })

    const { config: restartConfig , error: restartError, isSuccess: restartSuccess } = usePrepareContractWrite({
        addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
        contractInterface: abi,
        functionName: 'restartDraw'
    })

    const { config: refundConfig , error: refundError, isSuccess: refundSuccess } = usePrepareContractWrite({
        addressOrName: '0xde1bAf277C6095d78A1B9938D2376dFd900Ff434',
        contractInterface: abi,
        functionName: 'RefundAll'
    })

    const { writeAsync:  DrawWinner } = useContractWrite(drawWinnerConfig);
    const { writeAsync: WithdrawComission } = useContractWrite(withdrawConfig);
    const { writeAsync: RestartDraw } = useContractWrite(restartConfig);
    const { writeAsync: RefundAll } = useContractWrite(refundConfig);

    const onDrawWinner = async () => {
        const notification = toast.loading('Drawing a winner from pool...');

        try {
            if (drawWinnerSuccess) {
                await DrawWinner?.()

                toast.success("Successfully drew winner", {
                    id: notification
                })
            }
        }
        catch (e) {
            toast.error("Whoops something went wrong!", {
                id: notification
              });
            console.log(e);
        }
    }

    const onWithdraw = async () => {
        const notification = toast.loading('Withdrawing Comission...');

        try {
            if (withdrawSuccess) {
                await WithdrawComission?.()

                toast.success("Successfully extracted funds from contract!", {
                    id: notification
                })
            }
        }
        catch (e) {
            toast.error("Whoops something went wrong!", {
                id: notification
              });
            console.log(e);
        }
    }

    const onRefund = async () => {
        const notification = toast.loading('Refunding Participants...');

        try {
            if (withdrawSuccess) {
                await RefundAll?.()

                toast.success("Successfully refunded participants!", {
                    id: notification
                })
            }
        }
        catch (e) {
            toast.error("Whoops something went wrong!", {
                id: notification
              });
            console.log(e);
        }
    }

    const onRestart = async () => {
        const notification = toast.loading('Restarting draw...');

        try {
            if (withdrawSuccess) {
                await RestartDraw?.()

                toast.success("Successfully restarted the draw!", {
                    id: notification
                })
            }
        }
        catch (e) {
            toast.error("Whoops something went wrong!", {
                id: notification
              });
            console.log(e);
        }
    }


  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>Admin Controls</h2>
        <p className='mb-5'>Total Commission to be withdrawn: {totalCommission && ethers.utils.formatEther(totalCommission)}{" "} ETH </p>

        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={onDrawWinner} className='admin-button'>
                <StarIcon className='h-6 mx-auto mb-2' /> 
                Draw Winner
            </button>
            <button onClick={onWithdraw} className='admin-button'>
                <CurrencyDollarIcon className='h-6 mx-auto mb-2'/>
                Withdraw Comission
            </button>
            <button onClick={onRestart} className='admin-button'>
                <ArrowPathIcon className='h-6 mx-auto mb-2' />
                Restart Draw
            </button>
            <button onClick={onRefund} className='admin-button'>
                <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                Refund All
            </button>
        </div>
    </div>
  )
}

export default AdminControls
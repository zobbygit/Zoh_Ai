import React, { useEffect, useState } from 'react'
import { dummyCreationData} from '../assets/assets'
import {  Podcast, Sparkles, TrendingUp, Crown } from 'lucide-react'
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from '../components/CreationItem';
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


const Dashboard = () => {
  
  const [creations,setCreations]=useState([])
  const [loading,setLoading]=useState(true)
  const {getToken}=useAuth()


  const getDashboardData=async()=>{
  
  try {
    const {data}=await axios.get('/api/user/get-user-creations',{
        headers: { Authorization: `Bearer ${await getToken()}` },
    })
    if(data.success){
      setCreations(data.creations)
    }
    else{
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
    
  }
  setLoading(false)
  }  
    useEffect(()=>{
getDashboardData()
    },[])
  
  return (
<div className='min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-50 overflow-y-scroll p-6'>
  
  {/* Header Section */}
  <div className='mb-8'>
    <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4'>
      <Sparkles className='w-4 h-4 text-green-600' />
      <span className='text-sm font-semibold text-green-700'>Dashboard Overview</span>
    </div>
    <h1 className='text-4xl font-bold text-slate-800 mb-2'>Welcome Back!</h1>
    <p className='text-slate-600'>Here's what's happening with your creations today</p>
  </div>

  {/* Stats Cards */}
  <div className='flex justify-start gap-6 flex-wrap mb-10'>

    {/* Total Creations Card */}
    <div className='group relative w-80 p-6 bg-white rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-green-300 hover:-translate-y-1'>
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-400/20 rounded-full blur-3xl'></div>
      <div className='relative flex justify-between items-start'>
        <div className='text-slate-700'>
          <p className='text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            Total Creations
          </p>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent'>{creations.length}</h2>
          <p className='text-xs text-slate-500 mt-2 flex items-center gap-1'>
            <TrendingUp className='w-3 h-3' />
            All time
          </p>
        </div>
        <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex justify-center items-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
          <Sparkles className='w-7 h-7 text-white'/>
        </div>
      </div>
      <div className='mt-4 h-1 bg-gradient-to-r from-green-200 to-green-200 rounded-full overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-green-500 to-green-500 rounded-full w-3/4'></div>
      </div>
    </div>

    {/* Active Plan Card */}
    <div className='group relative w-80 p-6 bg-white rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-green-300 hover:-translate-y-1'>
      <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-400/20 rounded-full blur-3xl'></div>
      <div className='relative flex justify-between items-start'>
        <div className='text-slate-700'>
          <p className='text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            Active Plan
          </p>
          <h2 className='text-3xl font-bold flex items-center gap-2'>
            <Protect plan='premium' fallback={<span className='bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent'>Free</span>}>
              <span className='bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent flex items-center gap-2'>
                Premium
                <Crown className='w-6 h-6 text-yellow-500' />
              </span>
            </Protect>
          </h2>
          <p className='text-xs text-slate-500 mt-2'>Unlimited access</p>
        </div>
        <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex justify-center items-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
          <Podcast className='w-7 h-7 text-white'/>
        </div>
      </div>
      <div className='mt-4 flex gap-1'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex-1 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full'></div>
        ))}
      </div>
    </div>

  </div>

  {/* Recent Creations Section */}
  <div className='bg-white rounded-2xl border-2 border-green-200 shadow-xl p-8'>
    <div className='flex items-center justify-between mb-6 pb-4 border-b-2 border-green-100'>
      <div className='flex items-center gap-4'>
        <div className='p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-lg'>
          <Sparkles className='w-6 h-6 text-white'/>
        </div>
        <div>
          <h2 className='text-2xl font-bold text-slate-800'>Recent Creations</h2>
          <p className='text-sm text-slate-500'>Your latest generated content</p>
        </div>
      </div>
      <div className='px-4 py-2 bg-green-100 rounded-lg'>
        <span className='text-sm font-bold text-green-700'>{creations.length} Total</span>
      </div>
    </div>
    
{
  loading ? (

    <div>
      <div className='animate-spin rounded-full h-11 w-11 border-3 border-teal-500 border-t-transparent'>

      </div>
    </div>
  ) :(

   <div className='space-y-4'>
      {creations.length > 0 ? (
        creations.map((item) => <CreationItem key={item.id} item={item}/>)
      ) : (
        <div className='text-center py-16'>
          <div className='relative inline-block mb-6'>
            <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-green-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
            <div className='relative p-8 bg-gradient-to-br from-green-100 to-green-100 rounded-full border-4 border-green-200'>
              <Sparkles className='w-16 h-16 text-green-600'/>
            </div>
          </div>
          <h3 className='text-xl font-bold text-slate-700 mb-2'>No creations yet</h3>
          <p className='text-slate-500'>Start creating amazing content to see it here!</p>
        </div>
      )}
    </div>

  )
}



 
  </div>

</div>
  )
}

export default Dashboard
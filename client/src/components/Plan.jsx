import React from 'react'
import {PricingTable} from '@clerk/clerk-react'
const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
      <div className='text-center'>
       <h2 className='text-slate-800 text-[50px] font-semibold'>Upgrade Your Experience</h2>
       <p className='text-gray-500 max-w-lg mx-auto'>Explore a range of plans built to match your workflow, offering the right balance of features, performance, and value for growing projects and teams.</p> 
      </div>
      <div className='mt-14 max-sm:mx-8'>
        <PricingTable/>
      </div>
    </div>
  )
}

export default Plan

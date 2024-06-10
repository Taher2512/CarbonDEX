import React from 'react'
import Subcard from '../../../Components/Subcard.jsx'




function page() {


  const Plans = [
    {
      title: 'Eco-Supporter',
      image: "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: '5',
      description: 'Equivalent to planting 2 cedar trees every month.',
      offset: '125',
    },
    {
      title: 'Eco-Supporter',
      image: "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: '5',
      description: 'Equivalent to planting 2 cedar trees every month.',
      offset: '125',
    },
    {
      title: 'Eco-Supporter',
      image: "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: '5',
      description: 'Equivalent to planting 2 cedar trees every month.',
      offset: '125',
    },
    {
      title: 'Eco-Supporter',
      image: "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: '5',
      description: 'Equivalent to planting 2 cedar trees every month.',
      offset: '125',
    }
  ]

  return (
    <>
    <div className=' grid grid-flow-col w-1/2'>
      
   {Plans.map((plans,index) => (
      <Subcard key={index} plans={plans} />
    )
   )}
    </div>
    </>
  )
}

export default page
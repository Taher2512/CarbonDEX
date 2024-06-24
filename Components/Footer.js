import React from 'react'
import Button from './Button'

function Footer() {
  return (
    <footer className='w-screen py-16 flex flex-col justify-between px-40 text-white items-center'>
        <span className='w-full flex items-center justify-between'>

        <ul className='flex gap-4'>
            <a>
                <li>Home</li>
            </a>
            <a>
                <li>About</li>
            </a>
            <a>
                <li>Services</li>
            </a>
            <a>
                <li>Contact</li>
            </a>

        </ul>
        <Button text='Subscribe' url='#'/>
        </span>
        <p>
            &copy; 2021 All rights reserved
        </p>
    
    </footer>
  )
}

export default Footer
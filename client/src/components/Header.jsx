import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import { useSelector} from 'react-redux'

const Header = () => {
    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm);
        const searchQuary = urlParams.toString()
        navigate(`/search?${searchQuary}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')

        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }

    },[location.search])
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>Aban</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
            </Link>
            
            <form
            onSubmit={handleSubmit}
            className='bg-slate-100 p-3 rounded-lg flex items-center ' >
                <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                
                <button>

                    <FaSearch className='text-slate-500' />
                </button>
            </form>
            <ul className='flex gap-4 '>
                <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'> Home </li>
                </Link>
                <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'> About </li>
                </Link>
                <Link to='/profile'>
                {currentUser? (
                    <img src={currentUser.avatar} alt= 'Profile' className='rounded-full h-8 w-8 object-cover'/>
                ): (
                    <li className=' text-slate-700 hover:underline cursor-pointer'> Sign in </li>
                     )}
                 </Link> 
                
            </ul>
        </div>
    </header>
  )
}

export default Header

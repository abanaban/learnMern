import React, { useEffect, useState } from 'react'
import { IoLocationSharp } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaParking, FaShare } from 'react-icons/fa'
import Contact from '../components/Contact'
const Listing = () => {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing, setListing] =useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]=useState(false)
    const [copied, setCopied] = useState(false)
    const {currentUser} = useSelector((state)=> (state.user))
    const [contact, setContact] = useState(false)
    useEffect(()=>{
        const fetchListing = async ()=> {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success === false ){
                    setLoading(false)
                    setError(true)
                   return
                }
                
                setLoading(false)
                setError(false)
                setListing(data)
            } catch (error) {
                setLoading(false)
                setError(true)
             }
        }
        fetchListing()
    },[params.listingId])
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Somthing went wrong</p>}
      {listing && !loading && !error && (
        <div >
            <Swiper navigation>
                {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[550px]' style={{background: `url(${url}) center 
                        no-repeat`, backgroundSize: 'cover'}}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare className='text-slate-500'
                onClick={()=> {
                    navigator.clipboard.writeText(window.location.href)
                    setCopied(true);
                    setTimeout(()=> {
                        setCopied(false)

                    }, 2000);
                }} />
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>
                )}
            </div>
            <div className='p-3 flex flex-col max-w-4xl mx-auto my-7 gap-4'>

                <div>
                    <h1 className=' font-semibold text-2xl'>{listing.name} - $ 
                        {listing.offer
                        ? listing.discountPrice.toLocaleString('en-US') 
                        : listing.regularPrice.toLocaleString('en-US')} 
                        {listing.type === 'rent' && '/ month '}</h1>
                    <p className='flex mt-10'> <IoLocationSharp className='text-green-700 mr-1 mt-1'/> {listing.address}</p>
                </div>
                <div className='flex gap-4'>
                    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>{ listing.type === 'rent'? 'For Rent' : 'For Sale'}</p>
                    {listing.offer && (
                        <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>${+listing.regularPrice - +listing.discountPrice}</p>
                    )}
                </div>
                
                
                    <p className='text-slate-800'> <span className='font-semibold text-black'>Description -</span> {listing.description}</p>
                    <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='flex items-center gap-1 whitespace-nowrap  '>
                            <FaBed className='text-lg'/>
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds`: `${listing.bedrooms} bed`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap  '>
                            <FaBath className='text-lg'/>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths`: `${listing.bathrooms} bath`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap  '>
                            <FaBath className='text-lg'/>
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths`: `${listing.bathrooms} bath`}
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap  '>
                            <FaParking className='text-lg'/>
                            {listing.parking ? 'Parking spot' : 'No parking'}
                           
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap  '>
                            <FaChair className='text-lg'/>
                            {listing.furnished ? 'Furnished' : 'Not furnished'}
                           
                        </li>
                    </ul>
                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                        
                    <button onClick={()=> setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact landlord</button>
                    )}
                    {contact && <Contact listing = {listing} />}
            </div>  

        </div>
      )}
    </main>
  )
}

export default Listing

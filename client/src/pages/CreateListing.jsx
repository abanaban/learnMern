import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [formData, setFormData]= useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false);
    
    const handleImageSubmit = (e)=>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = [];

            for(let i=0; i< files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=> {
                setFormData({...formData, 
                    imageUrls: formData.imageUrls.concat(urls)
                })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image Upload faild (2 Mb max per image) ')
            })
                
            
        }else{
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)
        }
    }
    const storeImage = async (file)=>{
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    console.log(`Uploading files... ${progress}%`)
                },

                (error) =>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    })
                }

            )
        })
    }
    console.log(formData)
    const handleRemoveImage = (index)=>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index )
        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4' >
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg ' id='name'
                 maxLength={62} minLength={10} required/>
                 <textarea type="text" placeholder='Description' className='border p-3 rounded-lg ' id='description'
                  required/>
                 <input type="text" placeholder='Address' className='border p-3 rounded-lg ' id='address'
                  required/>
                  <div className='flex gap-6 flex-wraps'>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='sale' /> 
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='rent' /> 
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='parking' /> 
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='furnished' /> 
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='offer' /> 
                        <span>Offer</span>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min={1} max={10} required />
                      
                            <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min={1} max={10} required />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min={1} max={10} required />
                        <div className='flex flex-col items-center'>
                            <p>Reular Price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discoutPrice' min={1} max={10} required />
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
                  </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold' >Images: 
                    <span className='font-normal text-gray-600 ml-2'>The fist image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input  onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} 
                    className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                        {uploading? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                 <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                 {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                        <button type='button' onClick={()=> handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-70'>Delete</button>
                    </div>
                 ))
                 }

                 <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing

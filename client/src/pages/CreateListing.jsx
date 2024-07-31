import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
const CreateListing = () => {
    const navigate = useNavigate()
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 60,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const {currentUser} = useSelector(state => state.user)
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload faild (2 Mb max per image) ");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading files... ${progress}%`);
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  console.log(formData);
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if(e.target.id === 'sale'|| e.target.id === 'rent'){
        setFormData({
            ...formData,
            type: e.target.id
        })
    }
    if( e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer'){
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked
        })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
        if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price!')
        setError(false)
        setLoading(true)
        const res = await fetch('/api/listing/create', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            ...formData,
            userRef: currentUser._id
            })
        })
        const data = await res.json()
        console.log(data)
        setLoading(false)
        if(data.success === true){
            setError(data.message)

        }
        navigate(`/listing/${data.listing._id}`)

    } catch (error) {
        setLoading(false)
        setError(error.message)
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input onChange={handleChange}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength={62}
            minLength={10}
            required
            value={formData.name}
          />
          <textarea
          onChange={handleChange}
          
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
            value={formData.description}
          />
          <input
          onChange={handleChange}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required
            value={formData.address}
          />
          <div className="flex gap-6 flex-wraps">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parking" onChange={handleChange} checked={formData.parking === true} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" onChange={handleChange} checked={formData.furnished === true} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={formData.offer === true} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
              onChange={handleChange}
              value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />

              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
              onChange={handleChange}
              value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
              onChange={handleChange}
              value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min='50'
                max='100000'
                required
              />
              <div className="flex flex-col items-center">
                <p>Reular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            {formData.offer && (
            <div className="flex items-center gap-2">
              <input
              onChange={handleChange}
              value={formData.discountPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min='0'
                max='10000000000'
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The fist image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading? 'Creating...' : 'Create Listing'}

          </button>
          {error && <p className="text-red-700 text-sm" >{error}</p> }
        </div>
      </form>
    </main>
  );
};

export default CreateListing;

import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Perks from '../Components/Perks'
import ImageUpload from '../Components/ImageUpload'
import AccountNav from '../Components/AccountNav'
import { useNavigate, useParams } from 'react-router-dom'

const PlacesFormPage = () => {

    const {id} = useParams()
    const navigate = useNavigate();
    const [title,setTitle] = useState('')
    const [address,setAddress] = useState('')
    const [addPhotos,setAddPhotos] = useState([])
    const [description,setDescription] = useState('')
    const [perks,setPerks] = useState([])
    const [extraInfo,setExtraInfo] = useState('')
    const [checkInTime,setCheckInTime] = useState('')
    const [checkOutTime,setCheckOutTime] = useState('')
    const [maxGuests,setMaxGuests] = useState('')
    const [price,setPrice] = useState(100)

    useEffect(()=>{
      if(!id){
        return;
      }
      axios.get('/places/'+id).then(response => {
        const {data} = response;
        setTitle(data.title)
        setAddress(data.address)
        setAddPhotos(data.photos)
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckInTime(data.checkIn)
        setCheckOutTime(data.checkOut)
        setMaxGuests(data.maxGuests)
        setPrice(data.price)
      })
    },[id])
    const inputHeader = (text) => {
    return (
      <h2 className='text-2xl mt-4'>{text}</h2>
    );
  }

  const inputDescription = (text) => {
    return (
      <p className='text-gray-500 text-sm'>{text}</p>
    );
  }

  const preInput = (header,description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  const savePlace = async(e) => {
    e.preventDefault()
    const placeData = {
      id,
      title,
      address,
      addPhotos,
      description,
      perks,
      extraInfo,
      checkInTime,
      checkOutTime,
      maxGuests,
      price
    }
    if(id){
      //update place
    await axios.put('/places',{id,...placeData})
    navigate('/account/places')
    }
    else{
      //new place
    await axios.post('/places',placeData)
    navigate('/account/places')
    }
    
  }

  return (
    <>
      <div>
          <AccountNav />
          <form onSubmit={savePlace}>
            {preInput('Title','Title for your place, should be short and catchy just like the advertisememt')}
            <input 
                  type="text" 
                  value={title} 
                  onChange={ev => setTitle(ev.target.value)} 
                  placeholder='Title' 
            />
            {preInput('Address','Address to this place')}
            <input 
                  type="text" 
                  value={address} 
                  onChange={ev => setAddress(ev.target.value)} 
                  placeholder='Address'
            />
            {preInput('Photos','More = better')}
            <ImageUpload addPhotos={addPhotos}  setAddPhotos={setAddPhotos} />
            {preInput('Description','Description to this place')}
            <textarea 
                value={description} 
                onChange={ev => setDescription(ev.target.value)}
            />

            {preInput('Perks','Select all the perks for your place')}
            <Perks selected={perks} onChange={setPerks} />

            {preInput('Extra Info','hotel rules, etc')}
            <textarea 
                value={extraInfo}  
                onChange={ev => setExtraInfo(ev.target.value)}
            />
            {preInput('Check in&out times','Add check in and out times, remember to have some time window foe cleaning the room between guests')}
            <div  className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              <div>
                <h3 className='mt-2 -mb-1 '>Check in time</h3>
                <input 
                  type="text" 
                  value={checkInTime} 
                  onChange={ev => setCheckInTime(ev.target.value)} 
                  placeholder='14:00' 
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1 '>Check out time</h3>
                <input 
                    type="text" 
                    value={checkOutTime} 
                    onChange={ev => setCheckOutTime(ev.target.value)} 
                    placeholder='12:00' 
                />
              </div>
              <div>
                <h3 className='mt-2 -mb-1 '>Max number of guests</h3>
                <input 
                    type="number" 
                    value={maxGuests} 
                    onChange={ev => setMaxGuests(ev.target.value)} 
                    placeholder='2-4'
                />
              </div>
                <div>
                <h3 className='mt-2 -mb-1 '>Price</h3>
                <input 
                    type="number" 
                    value={price} 
                    onChange={ev => setPrice(ev.target.value)} 
                    placeholder='2-4'
                />
              </div>
            </div>
            <div>
              <button className='primary my-4'>Save</button>
            </div>
          </form>
        </div>
    </>
  )
}

export default PlacesFormPage

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingWidget from '../Components/BookingWidget'
import PlaceGallery from '../Components/PlaceGallery'
import AddressLink from '../Components/AddressLink'

const PlacePage = () => {
    const {id} = useParams()
    const [places,setPlaces] = useState(null)
    

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlaces(response.data)
        })
    },[id])

    if(!places){
        return 'No data'
    }


  return (
    <div className='mt-4 bg-gray-100 -mx-8 px-8 pt-8'>
        <h1 className='text-2xl '>{places.title}</h1>
        <AddressLink places={places}/>
        <PlaceGallery places={places}/>
            
            <div className='mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
                <div>
                    <div className='my-4'>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                            {places.description}
                        </div>
                    Check-in: {places.checkIn} <br />
                    Check-out: {places.checkOut} <br />
                    Max Number of Guests: {places.maxGuests} <br />
                    
                </div>
                <div>
                    <BookingWidget places = {places}/>
                </div>
            </div>
            <div className='bg-white -mx-8 px-8 py-8 border-t'>
                <div>
                <h2 className='font-semibold text-2xl'>Extra Info</h2>
                <div className='mb-4 mt-2 text-sm text-gray-700 leading-5'>{places.extraInfo}</div>
            </div>
            </div>
    </div>

  )
}

export default PlacePage

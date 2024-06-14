import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import axios from 'axios'
import PlaceGallery from '../Components/PlaceGallery'
import AddressLink from '../Components/AddressLink'
import BookingDates from '../Components/BookingDates'

const SingleBooking = () => {
    const {id} = useParams()
    const [bookings,setBookings] = useState(null)

    useEffect(()=>{
        if(id){
            axios.get('/bookings').then((response) => {
                const foundBooking = response.data.find(({_id}) => id === _id)
                if(foundBooking){
                    setBookings(foundBooking)
                }
            })
        }
    },[id])

    if(!bookings){
        return '';
    }

  return (
    <div className='my-8'>
      <h1 className='text-3xl'>{bookings.place.title}</h1>
      <AddressLink places={bookings.place}/>
      <div className='bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between'>
        <div>
        <h2 className='text-2xl mb-4'>Your Booking Information:</h2>
        <BookingDates booking={bookings}/>
        </div>
        <div className='bg-primary p-6 text-white rounded-2xl'>
        <div>Total price:</div>
        <div className='text-3xl'>${bookings.price}</div>
        </div>
      </div>
      <PlaceGallery places={bookings.place}/>
    </div>
  )
}

export default SingleBooking

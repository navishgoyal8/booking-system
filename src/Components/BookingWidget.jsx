import React, { useContext, useEffect, useState } from 'react'
import {differenceInCalendarDays} from 'date-fns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext} from '../Context/Context'

const BookingWidget = ({places}) => {

  const navigate = useNavigate()
  const [checkIn,setCheckIn] = useState('')
  const [checkOut,setCheckOut] = useState('')
  const [maxGuests,setMaxGuests] = useState(1)
  const [fullName,setFullName] = useState('')
  const [mobile,setMobile] = useState('')
  const {user} = useContext(UserContext)

  useEffect(() => {
    if(user){
        setFullName(user.name)
    }
  },[user])


  const bookThisPlace = async() => {    

    const data = {place:places._id,checkIn,checkOut,maxGuests,fullName,mobile,price:places.price*numberOfNights}
    const response = await axios.post('/booking',data)
    const id = response.data._id;
    navigate(`/account/bookings/${id}`);
  }

  let numberOfNights = 0;
  if(checkIn && checkOut){
    numberOfNights = differenceInCalendarDays(new Date (checkOut),new Date (checkIn));
  }
  return (
    <>
      <div className='bg-white shadow p-4 rounded-2xl'>
                    <div className='text-2xl text-center'>
                        Price: ${places.price} / per night
                    </div>
                    <div className="border rounded-2xl mt-4">
                        <div className="flex">
                            <div className='py-3 px-4'>
                                <label>Check in: </label>
                                <input type="date" 
                                       value={checkIn} 
                                       onChange={e => setCheckIn(e.target.value)} 
                                /> 
                            </div>
                            <div className='py-3 px-4 border-l'>
                                <label>Check out: </label>
                                <input type="date" 
                                       value={checkOut} 
                                       onChange={e => setCheckOut(e.target.value)} 
                                /> 
                            </div>
                        </div>
                            <div className='py-3 px-4 border-t'>
                                <label>Max Guests: </label>
                                <input type="number" 
                                       value = {maxGuests} 
                                       onChange={e => setMaxGuests(e.target.value)}
                                /> 
                            </div>
                            {numberOfNights > 0 && (
                                <div className='py-3 px-4 border-t'>
                                <label>Your full name: </label>
                                <input type="text" 
                                       value = {fullName} 
                                       onChange={e => setFullName(e.target.value)}
                                /> 
                                <label>Phone Number: </label>
                                <input type="tel" 
                                       value = {mobile} 
                                       onChange={e => setMobile(e.target.value)}
                                /> 
                            </div>
                            )}
                        </div>
                    <button onClick={bookThisPlace} className='primary mt-4'>Boook this place
                    {   numberOfNights > 0 &&
                        (   
                            <span> ${numberOfNights * places.price}</span>
                        )
                    }
                    </button>
                         
                    
                </div>
    </>
  )
}

export default BookingWidget

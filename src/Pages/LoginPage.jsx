import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../Context/Context'

const LoginPage = () => {

  const navigate = useNavigate()
  const [data,setData] = useState({
    email: "",
    password: ""
  })
  const {setUser} = useContext(UserContext)

  console.log(data)

  const handleChange = (e) => {
    const {name,value} = e.target
    setData((preve) => {
        return {
            ...preve,
        [name]: value
        }
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
        const response = await axios.post('/login',data);
        console.log(response.data)
        setUser(response.data)
        alert("Login successfully!")
        navigate("/")
    }
    catch(e){
        alert("Login failed!")
    }
  }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Login</h1>
            <form action="" className='max-w-md mx-auto' onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder='Your Email Address' 
                    name="email"
                    id="email"
                    value = {data.email}
                    onChange={handleChange}
                    />
                <input 
                    type="password" 
                    placeholder='Password'
                    name="password" 
                    id="password"
                    value = {data.password}
                    onChange = {handleChange}
                    />
                <button className='primary'>Login</button>
                <div className='text-center py-2 text-gray-500'>
                    Don't have an account? <Link className='underline text-black' to={"/register"}>Register Now</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoginPage

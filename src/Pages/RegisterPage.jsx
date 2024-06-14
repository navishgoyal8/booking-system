import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {

const navigate = useNavigate()
const [data,setData] = useState({
    name:"",
    email:"",
    password:""
});

console.log(data)

const handleChange = (e) => {
    const {name,value} = e.target
    setData((preve) => {
        return {
            ...preve,
            [name]:value
        }
    })
}

const handleSubmit = async(e) => {
    e.preventDefault()
    try{
        await axios.post('/register',data);
        alert('Registration is successful!! You can now log in..');
        navigate("/login")
    }
    catch(e){
        alert('Regsitration failed!! Try again later...');
    }

}

return (
      <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Register</h1>
            <form action="" className='max-w-md mx-auto' onSubmit={handleSubmit}>
                <input 
                    type="text"  
                    placeholder='Your Name' 
                    id='name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                />
                <input 
                    type="email" 
                    placeholder='Your Email Address' 
                    id='email'
                    name='email'
                    value={data.email}
                    onChange={handleChange}
                />
                <input 
                    type="password" 
                    placeholder='Password'
                    id='password'
                    name='password'
                    value={data.password}
                    onChange={handleChange} 
                />
                <button className='primary'>Register</button>
                <div className='text-center py-2 text-gray-500'>
                    Already a member? <Link className='underline text-black' to={"/login"}>Login</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default RegisterPage

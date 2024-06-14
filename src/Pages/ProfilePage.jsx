import React, { useContext} from 'react'
import { UserContext } from '../Context/Context'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import PlacesPage from './PlacesPage'
import AccountNav from '../Components/AccountNav'

const ProfilePage = () => {
  
  const navigate = useNavigate()
  let {subpage} = useParams();
  if(subpage === undefined){
    subpage = 'profile';
  }
  
  const {ready,user,setUser} = useContext(UserContext)

  if(!ready){
    return 'Loading.....';
  }

  if(ready && !user){
    return <Navigate to={'/login'} />
  }

  const handleLogout = async() => {
    await axios.post('/logout')
    setUser(null)
    navigate('/login')
    alert("LogOut successfully!")
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" &&
        (
            <div className='text-center max-w-lg mx-auto'>
                Logged in as {user.name}({user.email}) <br />
                <button onClick={handleLogout} className='primary max-w-sm mt-2'>Logout</button>
            </div>
        )
      }
      {
        subpage === 'places' && <PlacesPage />
      }
    </div>
  )
}

export default ProfilePage

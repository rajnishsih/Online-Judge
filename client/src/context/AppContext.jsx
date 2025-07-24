import axios from 'axios'
import React from 'react'; 
import { createContext,useState,useEffect } from 'react'
import {toast} from 'react-toastify';

export const AppContext =createContext();

export const AppContextProvider = (props)=>{
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [isLoggedin,setIsLoggedIn] = useState(false);
  const [userData,setUserData] = useState(false);

   const getAuthState = async()=>{
    console.log("autstate")
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
      if(data.success){
        setIsLoggedIn(true);
        getUserData();
      }
      else{
        console.log(data)
        toast.error("verify your email")
      }
    } catch (error) {
        toast.error(error.message)
    }
  }

   const getUserData = async()=>{
    console.log("userdata")
    try {
       axios.defaults.withCredentials = true;
      const {data} = await axios.get(backendUrl+'/api/user/data',{});
      console.log(data);
      data.success ? setUserData(data.userData): toast.error(data.message);
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    // console.log("yes");
    getAuthState();
  },[])


  const value = {
    backendUrl,
    isLoggedin,setIsLoggedIn,
    userData,setUserData,
    getUserData
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
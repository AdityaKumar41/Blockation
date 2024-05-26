
import axios from 'axios'
import {LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_FAIL,LOGIN_REQUEST,LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS} from "../constants/userConstants"

//Login User
export const login=(email,password)=>async (dispatch)=>{
    try{
        dispatch({type:LOGIN_REQUEST})
        
    const config = { headers: { "Content-Type": "application/json" } };
        const {data}=await axios.post(
            `https://blockation-s3uo.onrender.com/auth/login`,
            {email,password},
            config
        )
        console.log(data);
        dispatch({type:LOGIN_SUCCESS,payload:data.user})
    }catch(error){
        dispatch({type:LOGIN_FAIL,payload:error.response.data.message})
    }
}


//Logout  user details
export const logout=()=>async (dispatch)=>{
    try{

     await axios.get(`hhttps://blockation-s3uo.onrender.com/auth/logout`);


        
        dispatch({type:LOGOUT_SUCCESS})
    }catch(error){
        dispatch({type:LOGOUT_FAIL,payload:error.response.data.message})
    }
}

//Register User
export const register=(userData)=>async (dispatch)=>{
    try{
        dispatch({type:REGISTER_USER_REQUEST})
        
    const config = { headers: { "Content-Type": "application/json" } };
    
        const {data}=await axios.post(
            "https://blockation-s3uo.onrender.com/auth/register",
            userData,
            config,
        )
        console.log(data)
        dispatch({type:REGISTER_USER_SUCCESS,payload:data.newUser})
    }catch(error){
        console.log(error)
        dispatch({type:REGISTER_USER_FAIL,payload:error.message})
    }
}



//Load user details
export const laodUser=()=>async (dispatch)=>{
    try{
        dispatch({type:LOAD_USER_REQUEST})
        
   
        const {data}=await axios.get(`https://blockation-s3uo.onrender.com/auth/me`);

console.log(data)
        
        dispatch({type:LOAD_USER_SUCCESS,payload:data.userDetails})
    }catch(error){
        dispatch({type:LOAD_USER_FAIL,payload:error.response.data.message})
    }
}
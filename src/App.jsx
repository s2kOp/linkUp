import { useState, useRef, useEffect } from "react";
import AuthUser from "./components/AuthUser";
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import {signOut} from "firebase/auth";
import {auth} from "./firebase";

import "./App.css";

const cookie = new Cookies();

export default function App(){
    const [authState, setAuthState] = useState(null);
    const [room, setRoom] = useState(null);
    const roomRef = useRef();

    useEffect(() =>{
      const token = cookie.get("auth-token");
      if(token) setAuthState(token);
      const storedRoom = localStorage.getItem("chat-room");
      if (storedRoom) setRoom(storedRoom);
    }, []);
  if(!authState){
    return(
      <div>
        <AuthUser setAuthState={setAuthState} />
      </div>
    )
  }

  const signOutHandle = async () => {
    await signOut(auth);
    cookie.remove("auth-token");
    setAuthState(null);
    setRoom(null);
  }

  return(
      <div>
        {room ? ( <Chat room = {room} setRoom={setRoom}/> ):(<div className = "wrapRoom">
          <h2>Enter Room</h2>
          <input type="text" placeholder="Enter room name..." ref={roomRef}></input>
          <button onClick={() =>{
            setRoom(roomRef.current.value);
            localStorage.setItem("chat-room", roomRef.current.value);
          }}>Enter room</button>
          </div>)}
        <div className="signOutContainer">
          <button onClick={signOutHandle}>Sign Out</button>  
        </div> 
      </div>)

  }

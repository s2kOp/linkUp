import { collection, addDoc , onSnapshot , query, serverTimestamp, where, orderBy} from "firebase/firestore";
import { auth,db } from "../firebase";
import { useState,useEffect,useRef } from "react";

import styles from "../stylesheets/Chat.module.css";

export default function Chat({room,setRoom}){
    const [newMessage,setNewMessage] = useState("")
    const [messages,setMessages] = useState([]);

    const dbRef = collection(db,"messages");
    const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [room]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

    useEffect(() => {
        const queryMessage = query(dbRef,where("room","==",room), orderBy("createdAt"));
         const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(),id: doc.id})
            })
            setMessages(messages);
        })
        return () => {unsubscribe};
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newMessage == "") return;
        await addDoc(dbRef,{
            text: newMessage,
            createdAt: serverTimestamp() ,
            user: auth.currentUser.displayName,
            room
        })
        setNewMessage("");

    }

    const handleLeaveRoom = () => {
        setRoom(null);
        localStorage.removeItem("chat-room");
    }

    return(
    <div>
        <div className={styles.leaveContainer}>
            <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>
        <div className={styles.wrapper}>
            <h2>{room.toUpperCase()}</h2>
            <div className={styles.msgContainer} ref={containerRef}>{messages.map((msg) => (
                <div key = {msg.id} className={styles.msgInnerContainer}>
                    <span>{msg.user}:</span><p>{msg.text}</p>
                
                </div>
            ))}</div>
            <form className={styles.msgForm}onSubmit={handleSubmit}>
                <input type = "text" placeholder="Enter your text..." value = {newMessage} onChange={(e) => setNewMessage(e.target.value)}></input>
                <button type = "submit">Send</button>
            </form>
        </div>
    </div>)
}
import { useState } from "react";
import {auth,provider} from "../firebase";
import {signInWithPopup} from "firebase/auth";
import Cookies from "universal-cookie";

import styles from "../stylesheets/AuthUser.module.css";

const cookie = new Cookies();

export default  function AuthUser({setAuthState}){

    const user = async ()=>{
        try{
            const response = await signInWithPopup(auth,provider);
            cookie.set("auth-token",response.user.refreshToken);   
            setAuthState(cookie.get("auth-token"));      
        }catch(err){
            console.error(err);
        }
    }        
    return(
        <div className = {styles.container}>
        <div className={styles.wrapper}>
            <div className={styles.part1}>
                <h1>LinkUp</h1>
                <p>Create. Connect. Converse.</p>
            </div>
            <div className={styles.part2}>
                <button onClick={user}>Sign In</button>
            </div>
        </div>
        </div>
    )
}

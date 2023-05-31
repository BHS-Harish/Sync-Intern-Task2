import React, { useEffect, useState } from 'react';
import _ from 'underscore';
import { auth, database } from '../firebaseConfig';
import { collection, addDoc, onSnapshot,serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getCollectionName } from '../utils';
import date from 'date-and-time';
import { BsFillBackspaceFill } from 'react-icons/bs';
import '../styles/ChatPage.css';
function Chat({ user, isOpen, setIsOpen }) {
    const [currentUser] = useAuthState(auth);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [allow, setAllow] = useState(false);

    useEffect(() => {
        if ((message.trim()) === "")
            setAllow(false)
        else
            setAllow(true);
    }, [message]);
    useEffect(() => {
        onSnapshot(collection(database, getCollectionName(currentUser.uid, user.uid)), (querySnapshot) => {
            let messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });
            setChatMessages(_.sortBy(messages, 'timeStamp'));
        })
    }, [currentUser.uid,user.uid])
    useEffect(()=>{
        document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight;
    },[chatMessages])
    //Store message function for add new message
    const storeMessage = async () => {
        try {
            const date=serverTimestamp();
            await addDoc(collection(database, getCollectionName(currentUser.uid, user.uid)), {
                messageBy: currentUser.uid,
                message,
                timeStamp:date
            })
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }
    const applyStyle=(value)=>{
        return(
            value.messageBy===currentUser.uid?
            {
                backgroundColor:"#002651",alignSelf:"end",borderBottomRightRadius:"0"
            }
            :
            {
                backgroundColor:"#FF304F",alignSelf:"start",borderBottomLeftRadius:"0"
            }
        );
        
    }

    return (
        <div className='chat-container' style={{ display: `${isOpen ? "flex" : "none"}` }}>
            <div className='chat-submenu'>
                <div className='chat-profile'>
                    <img src={user.photoURL} alt="profile-pic" />
                    <p>{user.displayName}</p>
                </div>
                <div>
                    <BsFillBackspaceFill className='chat-submenu-back-icon' onClick={() => {
                        setIsOpen(false);
                    }} /> Back
                </div>
            </div>
            <div className='chats' id="chats">
                {
                    chatMessages && chatMessages.length > 0 && chatMessages.map((value,index) => {
                        return (
                            <div className='chat' key={index} style={applyStyle(value)}>
                                <p>{value.message}</p>
                                <p>{date.format(new Date(value.timeStamp?.seconds*1000), 'YYYY MMM DD hh:mm:ss A')}</p>
                            </div>
                        )
                    })
                }   
            </div>
            <div className='messagebox-container'>
                <input type={'text'} placeholder="Enter Your Message here..." value={message} onChange={(e) => {
                    setMessage(e.target.value);
                }} />
                <button className='send-btn' disabled={!allow} onClick={storeMessage}>SEND</button>
            </div>
        </div >
    )
}
export default Chat;
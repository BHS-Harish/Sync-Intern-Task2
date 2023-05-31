import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { AiFillMessage } from 'react-icons/ai';
import '../styles/ChatPage.css';
import Chat from './Chat';
function ChatPage() {
    const [user] = useAuthState(auth);
    const [otherUsers, setOtherUsers] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    async function fetchData() {
        const q = query(collection(database, 'users'), where('uid', '!=', user.uid));
        const fetchedUsers = await getDocs(q);
        if (fetchedUsers.docs.length > 0) {
            setOtherUsers(fetchedUsers.docs.map((item) => {
                return item.data();
            }))
        }
    };
    useEffect(() => {
        // eslint-disable-next-line
        fetchData();
        // eslint-disable-next-line
    }, []);
    return (
        <>
            {
                isOpen ?
                    <Chat isOpen={isOpen} user={selectedUser} setIsOpen={setIsOpen} />
                    :
                    <>
                        <div className='subMenu'>
                            <p>Welcome Back,{user?.displayName}</p>
                            <img src={`${user?.photoURL}`} alt="avatar" />
                        </div>
                        <div className='chatList-container'>
                            {
                                otherUsers && otherUsers.map((otherUser, index) => {
                                    return (
                                        <div className='chatList' key={index}>
                                            <img src={otherUser.photoURL} alt="profile-pic" />
                                            <p className='chatList-name'>{otherUser.displayName}</p>
                                            <AiFillMessage className='message-icon' title={`Start chatting with ${otherUser.displayName}`} onClick={() => {
                                                setSelectedUser(otherUsers[index]);
                                                setIsOpen(true);
                                            }} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
            }
        </>
    );
}

export default ChatPage;
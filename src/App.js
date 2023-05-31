import React from 'react';
import { auth, database } from './firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ChatPage from './components/ChatPage';
import './App.css';
import  illustration from './assets/signinillu.png';

function App() {
  const [user] = useAuthState(auth);
  const provider = new GoogleAuthProvider();
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const { uid, displayName, email, photoURL } = result.user;
      const q = query(collection(database, 'users'), where('uid', '==', uid));
      const existingUser = await getDocs(q);
      if (existingUser.docs.length === 0) {
        await addDoc(collection(database, 'users'), {
          uid, displayName, email, photoURL
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log(user);
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className='body'>
      <header>
        <nav>
          <h1>CHAT<span>ZEE</span></h1>
          {
            !user ?
              <button className='btn' onClick={handleSignIn}>SIGN IN</button>
              :
              <button className='btn' onClick={handleSignOut}>SIGN OUT</button>
          }
        </nav>
      </header>
      <main>
          {
            !user?
            <div className='signInPage'>
              <img src={illustration} alt="chatapp-signin-page-illustration"/>
              <h2>Welcome to ChatZee</h2>
              <p>SignIn to Continue</p>
              <p>Developed By Balaharisankar</p>
            </div>
            :
            <ChatPage/>
          }
      </main>
    </div>
  );
}

export default App;

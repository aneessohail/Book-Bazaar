import React,{useState,useEffect} from 'react'
import { auth } from './firebase'
import { GoogleAuthProvider ,signInWithPopup,onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
function Register() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [User, setUser] = useState(null)
    const navigate =useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
            }
          });
    }, [])

  

    const isloggedin=User?true:false

    useEffect(() => {
        if (isloggedin == true) {
            navigate('/')
        }
        }, [isloggedin,navigate])
        
    const provider = new GoogleAuthProvider();
    function googlesignin(){
        signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
    }
    function registeruser (e){
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
    }
  return (
    <>
     <Form className='container'>
      <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setemail(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)} />
      </Form.Group>
      <Button onClick={registeruser} variant="primary" type="submit">
        Register
      </Button>
    </Form>
    <div className='container mt-3 mb-2'>
        <h3 style={{fontFamily:'initial'}}>OR</h3>
    </div>
    <div className='container mt-3 mb-3'>
    <Button variant='danger' onClick={googlesignin}>
        Sign In With Google
    </Button>
    </div>
    </>
  )
}

export default Register
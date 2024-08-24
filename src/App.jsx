import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false); 
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (user) {
                navigate('/');
            } else {
                navigate('/login');
            }
        }
    }, [user, loading, navigate]);

    function logout() {
        signOut(auth).then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error("Sign out error: ", error);
        });
    }

    return (
        <>
            {user && (
                <Button onClick={logout}>
                    Sign Out
                </Button>
            )}
        </>
    );
}

export default App;

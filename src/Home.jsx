import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Cards from './Cards';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [info, setInfo] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                listUsers();
            } else {
                setUser(null);
                navigate('/register');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const listUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "books"));
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setInfo(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {loading ? (
                <div className='text-center mt-5'>
                    <Spinner animation="border" variant="primary" />
                    <p>Loading...</p>
                </div>
            ) : user ? (
                <div className='container mt-5'>
                    <Row>
                        {info.map((item) => (
                            <Col xs={12} sm={6} md={4} lg={4} key={item.id} className='mb-4'>
                                <Cards item={item} />
                            </Col>
                        ))}
                    </Row>
                </div>
            ) : (
                <p>Please log in to view this content.</p>
            )}
        </>
    );
}

export default Home;

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { storage } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import { ref, uploadBytes } from 'firebase/storage';
import Spinner from 'react-bootstrap/Spinner'; 

function Listingform() {
    const [name, setName] = useState('');
    const [isbn, setIsbn] = useState('');
    const [price, setPrice] = useState('');
    const [pic, setPic] = useState(null);
    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState('');
    const [email, setEmail] = useState('');
    const [ownerPic, setOwnerPic] = useState(null);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                console.log(user);
            } else {
                console.log('No user found');
            }
        });

        return () => unsubscribe(); 
    }, []);

    const handleData = async (name, isbn, price, pic, owner, email, ownerPic) => {
        const storageRef = ref(storage, `images/${Date.now()}-${pic.name}`);
        const result = await uploadBytes(storageRef, pic);

        const ownRef = ref(storage, `owner/${Date.now()}-${ownerPic.name}`);
        const res = await uploadBytes(ownRef, ownerPic);
        
        return await addDoc(collection(db, 'books'), {
            name,
            isbn,
            price,
            imageurl: result.ref.fullPath,
            owner,
            email,
            ownerpic: res.ref.fullPath
        });
    };

    const submitData = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            await handleData(name, isbn, price, pic, owner, email, ownerPic);
            navigate('/');
        } catch (error) {
            console.error("Error submitting data:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            <Form className='container'>
                <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Book Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>ISBN NUMBER</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="ISBN Number"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Cover Pic</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setPic(e.target.files[0])}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Seller Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Seller Name"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Seller Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Seller email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Seller Pic</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setOwnerPic(e.target.files[0])}
                    />
                </Form.Group>

                <Button
                    onClick={submitData}
                    variant="primary"
                    type="submit"
                    disabled={loading} 
                >
                    {loading ? (
                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                className="mr-2"
                            />
                            Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </Form>
        </>
    );
}

export default Listingform;

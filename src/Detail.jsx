import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth, storage } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, getDownloadURL } from 'firebase/storage';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner'; // Import Bootstrap Spinner
import emailjs from '@emailjs/browser';

function Detail() {
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const [data, setData] = useState(null);
    const [url, setUrl] = useState(null);
    const [ownerUrl, setOwnerUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const { bookid } = useParams();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null); // Ensure user state is reset if not authenticated
            }
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, []);

    const findBook = async () => {
        try {
            const docRef = doc(db, "books", bookid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching book:", error);
        }
    };

    useEffect(() => {
        findBook();
    }, [bookid]);

    useEffect(() => {
        if (data) {
            if (data.imageurl) {
                getDownloadURL(ref(storage, data.imageurl))
                    .then((url) => setUrl(url))
                    .catch((error) => console.error("Error fetching image URL:", error));
            }
            if (data.ownerpic) {
                getDownloadURL(ref(storage, data.ownerpic))
                    .then((url) => setOwnerUrl(url))
                    .catch((error) => console.error("Error fetching owner picture URL:", error));
            }
        }
    }, [data]);

    const placeOrder = async () => {
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        setLoading(true); // Set loading to true when order placement starts

        try {
            // Place the order
            const ordersCollectionRef = collection(db, "books", user.uid, 'orders');
            await addDoc(ordersCollectionRef, {
                bookId: bookid,
                bookName: data.name,
                price: data.price,
                quantity: qty,
                orderDate: new Date(),
            });

            // Prepare email parameters for the buyer
            const templateParamsBuyer = {
                to_name: user.displayName || 'Customer',
                from_name: data.owner,
                book_name: data.name,
                quantity: qty,
                total_price: data.price * qty,
                message: `Thank you for your purchase of ${qty} copy(ies) of ${data.name}. The total price is Rs${data.price * qty}.`,
                to_email: user.email, // Send email to buyer's email
            };

            // Prepare email parameters for the seller
            const templateParamsSeller = {
                to_name: data.owner,
                from_name: user.displayName || 'Customer',
                book_name: data.name,
                quantity: qty,
                total_price: data.price * qty,
                message: `You have received an order for ${qty} copy(ies) of ${data.name} from ${user.displayName || 'a customer'}. The total price is Rs${data.price * qty}.`,
                to_email: 'aneessohail31d@gmail.com', // Send email to seller's email
            };

            // Send email to buyer
            await emailjs.send(
                'service_e8xnsoc',
                'template_fnzuhpr',
                templateParamsBuyer,
                'f0ubH5j0LmAgHT_b6'
            );

            // Send email to seller
            await emailjs.send(
                'service_e8xnsoc',
                'template_fnzuhpr',
                templateParamsSeller,
                'f0ubH5j0LmAgHT_b6'
            );

            
            navigate('/book/order');
        } catch (error) {
            console.error("Error placing order or sending emails:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {data ? (
                <div className="container mt-5">
                    <div className="card mb-3 shadow-lg rounded border-0 overflow-hidden">
                        <div className="row no-gutters">
                            
                            <div className="col-md-4">
                                <img
                                    src={url}
                                    className="card-img h-100"
                                    alt="Book Cover"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            
                            <div className="col-md-8 bg-light">
                                <div className="card-body">
                                    
                                    <center>
                                        <h2 className="card-title text-primary">{data.name}</h2>
                                    </center>
                                    <br />
                                    <h5 className="card-text text-success mb-3">Price: Rs{data.price}</h5>
                                    <b className="card-text text-danger">ISBN: {data.isbn}</b>
                                    <br /><br />
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Quantity"
                                            min={1}
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        />
                                    </Form.Group>

                                   
                                    <br /><br />
                                    <h4>Seller Information</h4>
                                    <div className="d-flex align-items-center mt-4">
                                        <img
                                            src={ownerUrl}
                                            className="rounded-circle mr-3 mx-3 border border-secondary"
                                            alt="User Profile"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-0 text-dark">Seller Name: {data.owner}</h6>
                                            <p className="mb-0 text-muted">Email: {data.email}</p>
                                        </div>
                                    </div>
                                  
                                    <div className="mt-4">
                                        <button
                                            className="btn btn-primary btn-lg w-100"
                                            onClick={placeOrder}
                                            disabled={loading} 
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner
                                                        animation="border"
                                                        size="sm"
                                                        className="mr-2"
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Buy Now'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
}

export default Detail;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Orderpage.css'; 

function Orderpage() {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                fetchOrders(user.uid); 
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchOrders = async (uid) => {
        try {
            const ordersCollectionRef = collection(db, "books", uid, 'orders');
            const q = query(ordersCollectionRef, where("orderDate", ">=", new Date(0)));
            const querySnapshot = await getDocs(q);
            const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersList);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleDelete = async (orderId) => {
        if (user && orderId) {
            try {
                await deleteDoc(doc(db, "books", user.uid, 'orders', orderId));
                setOrders(orders.filter(order => order.id !== orderId)); 
                alert('Order deleted successfully!');
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    return (
        <div className="container mt-5 order-page">
            <h2 className="text-center mb-4 order-header">Order History</h2>
            {user ? (
                orders.length > 0 ? (
                    <ul className="list-group order-list">
                        {orders.map((order, index) => (
                            <li key={index} className="list-group-item order-item">
                                <h5>Book: {order.bookName}</h5>
                                <p>Price: Rs{order.price}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Date: {new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</p>
                                <p>Time: {new Date(order.orderDate.seconds * 1000).toLocaleTimeString()}</p>
                               
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted">No orders found.</p>
                )
            ) : (
                <p className="text-center text-muted">Please log in to view your orders.</p>
            )}
        </div>
    );
}

export default Orderpage;

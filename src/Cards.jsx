import React,{useState,useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import {  ref, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';
function Cards({item}) {
  const navigate=useNavigate();
const [Url, setUrl] = useState()
  function photo(){
    getDownloadURL(ref(storage, item.imageurl))
  .then((url) => {setUrl(url)})
  }
  useEffect(() => {
    photo()
  },[] )
  
  return (
    <>
  <Card  className="shadow-lg rounded-lg m-3  overflow-hidden mx-3 mb-4" style={{ width: '18rem',border:'2px' }}>
      <Card.Img variant="top" src={Url} style={{ height: '200px', objectFit: 'fill' }} />
      <Card.Body className='rounded-bottom'>
        <Card.Title className="text-center">{item.name}</Card.Title>
        <Card.Text className="text-center text-muted">
        {item.name} is available for just <b>Rs {item.price}</b>. With an ISBN of {item.isbn} .
        </Card.Text>
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={()=>{navigate(`/book/${item.id}`)}}>Check It Now</Button>
        </div>
      </Card.Body>
    </Card>
    </>
  )
  
}

export default Cards
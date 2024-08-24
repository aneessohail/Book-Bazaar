import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes,Route, Router} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Register from './Register.jsx'
import Login from './Login.jsx'
import Listingform from './Listingform.jsx'
import Navvbar from './Navvbar.jsx'
import Home from './Home.jsx'
import Detail from './Detail.jsx'
import Orderpage from './Orderpage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
  <BrowserRouter>
  <Navvbar/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/book/list' element={<Listingform/>}/>
    <Route path='/book/:bookid' element={<Detail/>}/>
    <Route path='/book/order' element={<Orderpage/>}/>
    </Routes>
  </BrowserRouter>
  </StrictMode>
)

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./Home";
import Products from "./Products";
import Product from "./Product";
import Cancel from "./Cancel";
import CancelConfirm from "./CancelConfirm";
import NotFound from "./NotFound";

function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/:id" element={<Product />}/>
        <Route path="/products/:id/cancel" element={<Cancel/>}/>
        <Route path="/products/:id/cancel/:token" element={<CancelConfirm/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    )
}

export default App;

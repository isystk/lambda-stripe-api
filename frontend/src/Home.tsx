import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 商品一覧にとばす
    navigate("/products");
  }, [])
  
  return <></>
}

export default Products;

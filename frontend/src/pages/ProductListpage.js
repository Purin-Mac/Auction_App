import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { db, timestamp } from "../service/firebase";
import { Link } from 'react-router-dom';

const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);

    const location = useLocation();
    const categoryName = location.state.categoryName;
    const categoryID = location.state.categoryID;

    useEffect(() => {
        const productsTemp = [];
        const productsCol = collection(db, "Products");
        const q = query(productsCol, where("categoryID", "==", categoryID), where("duration", ">=", timestamp));  
        getDocs(q).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(productsTemp);
        })
    }, [categoryID]);
    
    return (
        <>
            <Header />
            <h1>Product: {categoryName}</h1>
            <Row style= {{ margin: "0 20px" }}>
                {products.length !== 0 ?  
                    products.map((product) => (
                        <Col key={product.id} md={3}>
                            <Card style={{ border: "1px solid #e5e5e5", height: "100%" }}>
                                <Card.Img variant='top' src={product.productPhoto} style={{ backgroundColor: "#F1F1F1", height: "80%" }}/>
                                <Link to="/product" state={{ id: product.id }} style={{ textDecoration: "none", color: "black"}}>
                                    <Card.Body>
                                        <Card.Title>{product.productName}</Card.Title>
                                        <Card.Text>{product.productInfo}</Card.Text>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))
                : <h3>None</h3> }
            </Row>
        </>
    );
};

export default ProductListpage;

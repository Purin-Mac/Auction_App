import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { CardGroup, Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../service/AuthContext";
import { db } from "../service/firebase";
import { Link } from 'react-router-dom';

const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);
    const { categoryID } = useContext(AuthContext);

    const location = useLocation();
    const state = location.state;

    useEffect(() => {
        const productsTemp = [];
        const productsCol = collection(db, "Products");
        const q = query(productsCol, where("categoryID", "==", categoryID[state]));  
        getDocs(q).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(productsTemp);
        })
    }, [categoryID, state]);

    console.log(products)
    
    return (
        <>
            <Header />
            <h1>Product: {state}</h1>
            <Row style= {{ margin: "0 20px" }}>
                {products.length !== 0 ?  
                    products.map((product) => (
                        <Col key={product.id} md={3}>
                            <Card style={{ border: "1px solid #e5e5e5", height: "100%" }}>
                                <Card.Img variant='top' src={product.productPhoto} style={{ backgroundColor: "#F1F1F1", height: "80%" }}/>
                                {/* <Link to={} state={"Shoes"} > */}
                                    <Card.Body>
                                        <Card.Title>{product.productName}</Card.Title>
                                        <Card.Text>{product.startPrice} Bahts</Card.Text>
                                    </Card.Body>
                                {/* </Link> */}
                            </Card>
                        </Col>
                    ))
                : <h3>loading...</h3> }
            </Row>
        </>
    );
};

export default ProductListpage;

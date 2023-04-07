import { collection, doc, getDoc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { db, timestamp } from "../service/firebase";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer.js";

const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);
    const [ categoryName, setCategoryName ] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryID = searchParams.get("id");

    useEffect(() => {
        const categoryRef = doc(db, "Categories", categoryID);
        getDoc(categoryRef).then((doc) => {
            if (doc.exists()) {
                setCategoryName(doc.data().categoryName);
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, [categoryID]);

    useEffect(() => {
        // console.log(categoryName, categoryID)
        const productsCol = collection(db, "Products");
        const q = query(productsCol, where("categoryID", "==", categoryID), where("duration", ">=", Timestamp.now()), where("isBrought", "==", false));  
        const unsub = onSnapshot(q, (querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(productsTemp);
        });

        // getDocs(q).then(querySnapshot => {
        //     querySnapshot.forEach(doc => {
        //         productsTemp.push( { id: doc.id, ...doc.data() } );
        //     });
        //     setProducts(productsTemp);
        // })

        return () => {
            unsub();
        };
    }, [categoryID]);
    
    return (
        <>
            <Header/>
            <h1 style= {{ margin: "50px 0 0 5%" }}>Product: {categoryName}</h1>
            <Row style= {{ margin: "5% 5% 5% 5%"}}>
                {/* style= {{ marginTop: "5%"}} */}
                {products.length !== 0 ?  
                    products.map((product) => (
                        <Col key={product.id} md={3} style= {{ margin: "0 0 5% 0"}}>
                            <Card style={{ border: "1px solid #e5e5e5", height: "100%"}}>
                                <Card.Img variant='top' src={product.productPhoto} style={{ backgroundColor: "#F1F1F1", height: "80%" }}/>
                                <Link to={`/product?id=${product.id}`} style={{ textDecoration: "none", color: "black"}}>
                                    <Card.Body>
                                        <Card.Title className="text-truncate">{product.productName}</Card.Title>
                                        <Card.Text className="text-truncate">{product.productInfo}</Card.Text>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))
                : <h3>None</h3> }
            </Row>
            <Footer/>
        </>
    );
};

export default ProductListpage;

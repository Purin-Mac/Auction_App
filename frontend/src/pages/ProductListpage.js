import { collection, doc, getCountFromServer, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAt, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { db, timestamp } from "../service/firebase";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer.js";
import Paginate from "../components/Paginate";

const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);
    const [ categoryName, setCategoryName ] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 12;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryID = searchParams.get("id");

    //get category info
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

    //get number of products
    useEffect(() => {
        const fetchProductCount = async() => {
            const productCol = collection(db, "Products");
            const snapshot = await getCountFromServer(productCol);
            console.log('count: ', snapshot.data().count);
            setTotalPages(Math.ceil(snapshot.data().count / productsPerPage))
        }

        fetchProductCount();
    }, []);

    //get products
    useEffect(() => {
        // console.log(categoryName, categoryID)
        const productsCol = collection(db, "Products");
        const startIndex = (currentPage - 1) * productsPerPage;
        const q = query(productsCol, 
            where("categoryID", "==", categoryID), 
            where("duration", ">=", Timestamp.now()), 
            where("isBrought", "==", false),
            orderBy("duration"),
            startAt(startIndex),
            limit(productsPerPage)
        );
        getDocs(q).then((querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach((doc) => {
              productsTemp.push({ id: doc.id, ...doc.data() });
            });
            setProducts(productsTemp);
        });  
        // const unsub = onSnapshot(q, (querySnapshot) => {
        //     const productsTemp = [];
        //     querySnapshot.forEach(doc => {
        //         productsTemp.push( { id: doc.id, ...doc.data() } );
        //     });
        //     setProducts(productsTemp);
        // });

        // return () => {
        //     unsub();
        // };
    }, [categoryID, currentPage]);
    
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
            {totalPages && 
                <Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPage={totalPages} />
            }
            <Footer/>
        </>
    );
};

export default ProductListpage;

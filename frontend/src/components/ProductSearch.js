import { useState, useEffect } from "react";
import { db } from "../service/firebase";
import { collection, endAt, onSnapshot, orderBy, query, startAt, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";


const ProductSearch = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([])
        console.log(searchTerm, typeof(searchTerm))
        const productsCol = collection(db, "Products");
        const term = searchTerm.toLowerCase();
        const substrings = term.split(" ");
        const productsQuery = searchTerm ? query(productsCol, 
            where('searchName', '>=', searchTerm.toLowerCase()), 
            where('searchName', '<=', searchTerm.toLowerCase() + '\uf8ff')) : productsCol;
        // const productsQuery = searchTerm ? query(productsCol, 
        //     orderBy("searchName"), 
        //     startAt(searchTerm.toLowerCase()), 
        //     endAt(searchTerm.toLowerCase() + '\uf8ff')) : productsCol;
        const partialsQuery = searchTerm ? query(productsCol, 
            where('searchPartial', 'array-contains-any', substrings)) : productsCol;
        
        const unsub1 = onSnapshot(productsQuery, (querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(prevProducts => [...prevProducts, ...productsTemp]);
        });

        const unsub2 = onSnapshot(partialsQuery, (querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach(doc => {
              productsTemp.push({ id: doc.id, ...doc.data() });
            });
            setProducts(prevProducts => [...new Set([...prevProducts, ...productsTemp])]);
        });

        return () => {
            unsub1();
            unsub2();
        };
    }, [searchTerm]);

    return (
        <>
            <Row style= {{ margin: "5% 5% 5% 5%"}}>
                {products.length !== 0 ?  
                    products.map((product) => (
                        <Col key={product.id} md={3} style= {{ margin: "0 0 5% 0"}}>
                            <Card style={{ border: "1px solid #e5e5e5", height: "100%"}}>
                                <Card.Img variant='top' src={product.productPhoto} style={{ backgroundColor: "#F1F1F1", height: "80%" }}/>
                                <Link to="/product" state={{ id: product.id }} style={{ textDecoration: "none", color: "black"}}>
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
            {/* {products.length !== 0 ?  
                products.map((product) => (
                    <div key={product.id}>
                        <Link to="/product" state={{ id: product.id }} style={{ textDecoration: "none", color: "black"}}>
                            <h3>{product.productName}</h3>
                            <img src={product.productPhoto}></img>
                            <p>{product.productInfo}</p>         
                        </Link>
                    </div>
                ))
            : <h3>None</h3> } */}
        </>
    );
};

export default ProductSearch;
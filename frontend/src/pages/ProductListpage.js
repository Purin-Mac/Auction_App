import { collection, doc, getCountFromServer, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, endBefore, Timestamp, where, limitToLast } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { db, timestamp } from "../service/firebase";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer.js";
import Paginate from "../components/Paginate";
import "../style/productlist.css";


const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);
    const [ categoryName, setCategoryName ] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 12;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryID = searchParams.get("id");
    const [firstProduct, setFirstProduct] = useState(null);
    const [lastProduct, setLastProduct] = useState(null);
    const [auctionType, setAuctionType] = useState('All');

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
            if (auctionType === 'All') {
                const q = query(productCol,  
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false));
                const snapshot = await getCountFromServer(q);
                // console.log('count: ', snapshot.data().count);
                // console.log('total page: ', Math.ceil(snapshot.data().count / productsPerPage));
                setTotalPages(Math.ceil(snapshot.data().count / productsPerPage))
            } else{
                const q = query(productCol,  
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    where("auctionType", "==", auctionType)
                );
                const snapshot = await getCountFromServer(q);
                // console.log('count: ', snapshot.data().count);
                // console.log('total page: ', Math.ceil(snapshot.data().count / productsPerPage));
                setTotalPages(Math.ceil(snapshot.data().count / productsPerPage))
            }
        }

        fetchProductCount();
    }, [categoryID, auctionType, currentPage]);

    // const fetchProducts = async(query) => {
    //     getDocs(query).then((querySnapshot) => {
    //         const productsTemp = [];
    //         querySnapshot.forEach((doc) => {
    //           productsTemp.push({ id: doc.id, ...doc.data() });
    //         });
    //         // console.log(productsTemp)
    //         // console.log(productsTemp[0])
    //         // console.log(productsTemp[productsTemp.length - 1])
    //         setProducts(productsTemp);
    //         // setFirstProduct(productsTemp[0]);
    //         // setLastProduct(productsTemp[productsTemp.length - 1]);
    //         setFirstProduct(querySnapshot.docs[0]);
    //         setLastProduct(querySnapshot.docs[querySnapshot.docs.length - 1]);
    //         // console.log(querySnapshot.docs[querySnapshot.docs.length - 1])
    //     });  
    // }

    //get products
    useEffect(() => {
        // console.log(categoryName, categoryID)
        // console.log(currentPage)
        const productsCol = collection(db, "Products");
        // const startIndex = (currentPage - 1) * productsPerPage;
        // console.log(startIndex)
        let q;

        if (auctionType === 'All') {
            if (firstProduct && !lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    orderBy("duration"),
                    endBefore(firstProduct),
                    limitToLast(productsPerPage)
                );
                // fetchProducts(q);
            } else if (!firstProduct && lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    orderBy("duration"),
                    startAfter(lastProduct),
                    limit(productsPerPage)
                );
                // fetchProducts(q);
            } else if (!firstProduct && !lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    orderBy("duration"),
                    limit(productsPerPage)
                );
                // fetchProducts(q);
            }
        } else {
            if (firstProduct && !lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    where("auctionType", "==", auctionType),
                    orderBy("duration"),
                    endBefore(firstProduct),
                    limitToLast(productsPerPage)
                );
                // fetchProducts(q);
            } else if (!firstProduct && lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    where("auctionType", "==", auctionType),
                    orderBy("duration"),
                    startAfter(lastProduct),
                    limit(productsPerPage)
                );
                // fetchProducts(q);
            } else if (!firstProduct && !lastProduct) {
                // const q = query(productsCol, 
                q = query(productsCol, 
                    where("categoryID", "==", categoryID), 
                    where("duration", ">=", Timestamp.now()), 
                    where("isBrought", "==", false),
                    where("auctionType", "==", auctionType),
                    orderBy("duration"),
                    limit(productsPerPage)
                );
                // fetchProducts(q);
            }
        }


        const unsub = onSnapshot(q, (querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(productsTemp);
            setFirstProduct(querySnapshot.docs[0]);
            setLastProduct(querySnapshot.docs[querySnapshot.docs.length - 1]);
        });

        return () => {
            unsub();
        };
    }, [categoryID, currentPage, auctionType]);

    const handleAuctionTypeChange = (type) => {
        // console.log(type)
        setAuctionType(type);
        setCurrentPage(1);
        setFirstProduct(null);
        setLastProduct(null);
    };
    
    return (
        <>
            <Header/>
            <h1 style= {{ margin: "5% 0 0 5%" }}>Category : {categoryName}</h1>
            <p style= {{ margin: "2% 0 0 5%" }}>This is the products that we have !</p>
            <div className="Dropdown">  
            <Dropdown style= {{ margin: "3% 0 0 5%" }}>
                <Dropdown.Toggle id="dropdown-auction-type">
                    {auctionType}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleAuctionTypeChange('All')}>All type</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAuctionTypeChange('English')}>English Auction</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAuctionTypeChange('FirstPrice')}>First-Price Seal-Bid Auction</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAuctionTypeChange('SecondPrice')}>Second-Price Seal-Bid Auction</Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => handleAuctionTypeChange('Dutch')}>Dutch Auction</Dropdown.Item> */}
                </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className="list-cards">
                <div className="row" >
                    {products.length !== 0 ?
                        products.map((product) => (
                        <div className="listcolumn" key={product.id}>
                            <Link to={`/product?id=${product.id}`} style={{ textDecoration: "none", color: "black"}}>
                                <div className="list-card">
                                    <img src={product.productPhoto} alt=""/>
                                    <div className="bottomcard">
                                        <h6>{product.productName}</h6>
                                        <p>Now {product.currentPrice} THB</p><br></br><br></br>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                    : <h3>None</h3> }
                </div>
            </div>
            
            {/* {totalPages && 
                <Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            } */}
            <Paginate currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} setFirstProduct={setFirstProduct} setLastProduct={setLastProduct}/>
            <Footer/>
        </>
    );
};

export default ProductListpage;

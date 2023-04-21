import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap'
// import { useEffect, useState } from 'react';
// import { db, storage } from '../service/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import { getDownloadURL, ref } from 'firebase/storage';
import { AuthContext } from '../service/AuthContext';

const Category = ( {link} ) => {
    const { appsPicture, categoryIDs } = useContext(AuthContext); 
    // const [categoryIDs, setCategoryIDs] = useState({});

    // useEffect(() => {
    //     const fetchCategoryID = async() => {
    //         const categoriesCol = collection(db, "Categories");
    //         const querySnapshot = await getDocs(categoriesCol);
    //         const tempCategoryID = {};
    //         querySnapshot.forEach((doc) => {
    //             // doc.data() is never undefined for query doc snapshots
    //             // console.log(doc.id, " => ", doc.data().categoryName);
    //             tempCategoryID[doc.data().categoryName] = doc.id;
    //         });
    //         setCategoryIDs(tempCategoryID);
    //     };
    //     fetchCategoryID();
    // }, []);

    return (
        <>
            <div className="category-cards">
                <div className="row">
                        <div className="column">
                            <Link to={`${link}?id=${categoryIDs["Shoes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>  
                                <div className="category-card">
                                    <img src={appsPicture["Shoes.png"]} alt="" />
                                    <div className="bottomcard">
                                        <h5>Shoes</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="column">
                            <Link to={`${link}?id=${categoryIDs["Men's clothes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                                <div className="category-card">
                                    <img src={appsPicture["Men clothes.png"]} alt="" />
                                    <div className="bottomcard">
                                        <h5>Men's Clothes</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="column">
                            <Link to={`${link}?id=${categoryIDs["Women's clothes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                                <div className="category-card">
                                    <img src={appsPicture["Women clothes.png"]} alt="" />
                                    <div className="bottomcard">
                                        <h5>Woman's Clothes</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="column">
                            <Link to={`${link}?id=${categoryIDs["Accessories"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                                <div className="category-card">
                                    <img src={appsPicture["Accessories.png"]} alt="" />
                                    <div className="bottomcard">
                                        <h5>Accessories</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                </div>
            </div>
            {/* <CardGroup style={{ margin: "5% auto 0 auto", width: "80%", display: "flex", justifyContent: "space-between" }}>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Shoes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={`${link}?id=${categoryIDs["Shoes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Shoes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Men clothes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={`${link}?id=${categoryIDs["Men's clothes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Men's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Women clothes.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={`${link}?id=${categoryIDs["Women's clothes"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Women's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={appsPicture["Accessories.png"]} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={`${link}?id=${categoryIDs["Accessories"]}`} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Accessories</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
            </CardGroup> */}
        </>
    )
}

export default Category
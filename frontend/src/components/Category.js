// import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap'
import ShoesPic from "../resources/Sneaker2.png";
import MenClothPic from "../resources/Diesel.png"
import WomenClothPic from "../resources/Women's clothes.png"
import WatchPic from "../resources/Watch.png"
import { useEffect, useState } from 'react';
import { db } from '../service/firebase';
import { collection, getDocs } from 'firebase/firestore';
// import { AuthContext } from '../service/AuthContext';

const Category = ( {link} ) => {
    // const { categoryID } = useContext(AuthContext); 
    const [categoryIDs, setCategoryIDs] = useState({});

    useEffect(() => {
        const fetchCategoryID = async() => {
            const categoriesCol = collection(db, "Categories");
            const querySnapshot = await getDocs(categoriesCol);
            const tempCategoryID = {};
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data().categoryName);
                tempCategoryID[doc.data().categoryName] = doc.id;
            });
            setCategoryIDs(tempCategoryID);
        };
        fetchCategoryID();
    }, []);

    return (
        <>
            <main>
            <h1>Plaese Select Category</h1>
            <p>Select your category</p>
            </main>
            <CardGroup style={{ margin: "5% auto 0 auto", width: "80%", display: "flex", justifyContent: "space-between" }}>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={ShoesPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Shoes", categoryID: categoryIDs["Shoes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Shoes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={MenClothPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Men's clothes", categoryID: categoryIDs["Men's clothes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Men's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={WomenClothPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Women's clothes", categoryID: categoryIDs["Women's clothes"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Women's clothes</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
                <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                    <Card.Img variant='top' src={WatchPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                    <Link to={link} state={{ categoryName: "Accessories", categoryID: categoryIDs["Accessories"] }} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                        <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <Card.Title>Accessories</Card.Title>
                        </Card.Body>
                    </Link>
                </Card>
            </CardGroup>
        </>
    )
}

export default Category
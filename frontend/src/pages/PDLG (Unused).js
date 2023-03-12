import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { db, timestamp } from "../service/firebase";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer.js";
import '../style/main.css';

const ProductListpage = () => {
    const [ products, setProducts ] = useState([]);

    const location = useLocation();
    const categoryName = location.state.categoryName;
    const categoryID = location.state.categoryID;

    useEffect(() => {
        console.log(categoryName, categoryID)
        const productsCol = collection(db, "Products");
        const q = query(productsCol, where("categoryID", "==", categoryID), where("duration", ">=", timestamp), where("isBrought", "==", false));  
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
            <h1>Product: {categoryName}</h1>
            <div class="reccommend">
            <h1>Result for : Nike</h1>
            <p>Eplore the various product form your keyword.</p>
            <div class="cards">
                <div class="row">
                    <div class="column">
                        <div class="card">
                            <img src="image/Watch 1.svg"/>
                            <h3>Accesssories</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                
                    <div class="column">
                        <div class="card">
                            <img src="image/Sneaker2 1.svg"/>
                            <h3>Shoes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src="image/Men's clothes 1.svg"/>
                            <h3>Men's Clothes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src="image/Women's clothes 1.svg"/>
                            <h3>Woman's Clothes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="column">
                        <div class="card">
                            <img src="image/Watch 1.svg"/>
                            <h3>Accesssories</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                
                    <div class="column">
                        <div class="card">
                            <img src="image/Sneaker2 1.svg"/>
                            <h3>Shoes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src="image/Men's clothes 1.svg"/>
                            <h3>Men's Clothes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="card">
                            <img src="image/Women's clothes 1.svg"/>
                            <h3>Woman's Clothes</h3>
                            <p style="text-align: center;">Now 200+ Products</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductListpage;

import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonSwitch from "../components/ButtonSwitch";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../service/AuthContext";
import { db } from "../service/firebase";

const SellingHistorypage = () => {
    const { currentUser, userData } = useContext(AuthContext);
    const [activeButton, setActiveButton] = useState("current");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const showToastMessage = (msg) => {
        toast(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000,
        });
    };

    const fetchData = async() => {
        setIsLoading(true);
        if (activeButton === "current") {
            const productsCols = collection(db, "Products");
            const productsTemp = [];
            const q = query(
                productsCols,
                where("isBrought", "==", false),
                where("sellerEmail", "==", currentUser.email)
            );
            getDocs(q)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        productsTemp.push({ id: doc.id, ...doc.data() });
                    });
                    setProducts(productsTemp);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                });
        } else if (activeButton === "history") {
            const productsTemp = [];
            const itemsCols = collection(db, "Users", userData.id, "Items");
            getDocs(itemsCols)
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        productsTemp.push({ id: doc.id, ...doc.data() });
                    });
                    setProducts(productsTemp);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                });
        } else {
            console.log("Empty Active Button");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeButton]);
    
    return (
        <div>
            <Header />
            <Sidebar /> 
            <h3>SellingHistorypage</h3>
            <ButtonSwitch activeButton={activeButton} setActiveButton={setActiveButton}/>

            <br/>
            {isLoading ? (
                <p>Loading...</p>
            ) : activeButton === "current" ? (
                products.length !== 0 ? (
                    products.map((product) => (
                        <div key={product.id}>
                            <img src={product.productPhoto}></img>
                            <h3>{product.productName}</h3>
                            {product.duration > Timestamp.now() ? (
                                <p>Highest Bid: {product.currentPrice}</p>                
                            ) : <p>Price: {product.currentPrice}</p>}
                        </div>
                    ))
                ) : (
                    <h4>None</h4>
                )
            ) : activeButton === "history" ? (
                products.length !== 0 ? (
                    products.map((product) => (
                        <div key={product.id}>
                            <img src={product.productPhoto}></img>
                            <h3>{product.productName}</h3>
                            <p>{product.price}</p>
                            <p>
                                Date:{" "}
                                {product.broughtAt &&
                                    product.broughtAt
                                        .toDate()
                                        .toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <h4>None</h4>
                )
            ) : null}
            <Footer />
        </div>
    );
};

export default SellingHistorypage;

import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import ButtonSwitch from "../components/ButtonSwitch";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileBanner from "../components/ProfileBanner";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../service/AuthContext";
import { db } from "../service/firebase";
import { Link } from "react-router-dom";

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

    
    useEffect(() => {
        setIsLoading(true);
        if (activeButton === "current") {
            const productsCols = collection(db, "Products");
            const q = query(
                productsCols,
                where("isBrought", "==", false),
                where("sellerEmail", "==", currentUser.email),
                );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const productsTemp = [];
                querySnapshot.forEach((doc) => {
                    productsTemp.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productsTemp);
                setIsLoading(false);
            }, error => {
                console.log(error);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } else if (activeButton === "history") {
            const productsTemp = [];
            const itemsCols = collection(db, "Users", userData.id, "Items");
            const sellerItemSnapshot = query(
                itemsCols,
                where("sellerEmail", "==", currentUser.email),
            );
            getDocs(sellerItemSnapshot)
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
    }, [activeButton]);

    const handleDeliver = async (productID) => {
        const productRef = doc(db, "Products", productID);
        await updateDoc(productRef, {
            isSend: true,
            sendAt: Timestamp.now()
        });
    };

    const renderer = (
        { days, hours, minutes, seconds, completed },
        productID,
        productPrice,
        currentBidder,
        productIsSend
    ) => {
        if (completed) {
            return (
                <div>
                    <p>Price: {productPrice} THB</p>
                    {currentBidder ? (
                        productIsSend ? <p>Waiting for payment.</p> : <button onClick={() => handleDeliver(productID)}>Deliver</button>
                    ) : (
                        <div>
                            <p>No one bid this product :{"("}</p>
                            <Link to={`/sell_item_details?productID=${productID}`}>
                                <button >Re Auction</button>
                            </Link>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div>
                    <p>Highest Bid: {productPrice} THB</p>
                    <p>
                        Remaning Time: {days} day, {hours} hours, {minutes}{" "}
                        minutes, {seconds} seconds
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="paint">
            <Header />
            <ProfileBanner/>
            <div className="Historymain">
                <Sidebar />
                <div className="History-container" >
                    <div className="topside">
                        <h3>SellingHistorypage</h3>
                        <ButtonSwitch
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                            />
                    </div>
                    {isLoading ? (
                        <p>Loading...</p>
                        ) : activeButton === "current" ? (
                            products.length !== 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="History-products">
                                        <img src={product.productPhoto} alt={"product pic"}></img>
                                        <h5>{product.productName}</h5>
                                        <div>{product.duration && (
                                            <Countdown
                                            date={product.duration.toDate()}
                                            renderer={(props) =>
                                                renderer(
                                                    props,
                                                    product.id,
                                                    product.currentPrice,
                                                    product.currentBidder,
                                                        product.isSend
                                                        )
                                                    }
                                                    />
                                        )}
                                        </div>
                                    </div>
                            ))
                            ) : (
                            <h4>None</h4>
                            )
                            ) : activeButton === "history" ? (
                            products.length !== 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="History-products">
                                        <img src={product.productPhoto} alt={"product pic"}></img>
                                        <h5>{product.productName}</h5>
                                        <h5>Price: {product.price} THB</h5>
                                        {product.payAt ? 
                                            <h5>
                                                Date:{" "}
                                                {product.payAt &&
                                                    product.payAt
                                                    .toDate()
                                                    .toLocaleDateString()}
                                            </h5>
                                        : 
                                            <h5>
                                                Date:{" "}
                                                {product.broughtAt &&
                                                    product.broughtAt
                                                    .toDate()
                                                    .toLocaleDateString()}
                                            </h5>
                                        }
                                    </div>
                            ))
                            ) : (
                                <h4>None</h4>
                                )
                                ) : null}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SellingHistorypage;

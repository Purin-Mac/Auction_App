import React, { useContext, useEffect, useState } from "react";
import "../style/History.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";
import Countdown from "react-countdown";

const BuyingHistorypage = () => {
    const { currentUser, userData } = useContext(AuthContext);
    const [activeButton, setActiveButton] = useState("current");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleCurrentClick = () => {
        if (activeButton !== "current") {
            setActiveButton("current");
        }
    };

    const handleHistoryClick = () => {
        if (activeButton !== "history") {
            setActiveButton("history");
        }
    };

    const limitPayTime = (time) => {
        let dueDate = time.toDate();
        return dueDate.setHours(dueDate.getHours() + 72);
    };

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            if (activeButton === "current") {
                const productsCols = collection(db, "Products");
                const productsTemp = [];
                const q = query(
                    productsCols,
                    where("duration", "<", Timestamp.now()),
                    where("isBrought", "==", false),
                    where("currentBidder", "==", currentUser.email)
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

        fetchData();
    }, [activeButton]);

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <p>Out of time</p>;
        } else {
            return (
                <div>
                    <p>Remaning Time: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds</p>
                    <button>Pay</button>
                </div>
            )
        }
    };

    return (
        <div>
            <Header />
            <Sidebar />
            <h3>BuyingHistorypage</h3>
            <button
                onClick={handleCurrentClick}
                className={activeButton === "current" ? "active-current" : ""}
            >
                Current
            </button>
            <button
                onClick={handleHistoryClick}
                className={activeButton === "history" ? "active-history" : ""}
            >
                History
            </button>

            <br />

            {isLoading ? (
                <p>Loading...</p>
            ) : activeButton === "current" ? (
                products.length !== 0 ? (
                    products.map((product) => (
                        <div key={product.id}>
                            <img src={product.productPhoto}></img>
                            <h3>{product.productName}</h3>
                            <p>Price: {product.currentPrice}</p>
                            {product.duration && (
                                <Countdown
                                    date={limitPayTime(product.duration)}
                                    renderer={renderer}
                                />
                            )}
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
                            <p>{product.buyNowPrice}</p>
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

export default BuyingHistorypage;

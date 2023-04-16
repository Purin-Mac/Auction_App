import React, { useContext, useEffect, useState } from "react";
import "../style/History.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    runTransaction,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import ButtonSwitch from "../components/ButtonSwitch";
import ProfileBanner from "../components/ProfileBanner";


const BuyingHistorypage = () => {
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

    // const handleCurrentClick = () => {
    //     if (activeButton !== "current") {
    //         setActiveButton("current");
    //     }
    // };

    // const handleHistoryClick = () => {
    //     if (activeButton !== "history") {
    //         setActiveButton("history");
    //     }
    // };

    const handlePayment = async (productID) => {
        try {
            const productRef = doc(db, "Products", productID);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                const productData = productSnapshot.data();
                const userRef = doc(db, "Users", userData.id);
                const userItemsRef = doc(userRef, "Items", productID);
                const currentDate = Timestamp.now();

                await runTransaction(db, async (transaction) => {
                    const userSnapshot = await transaction.get(userRef);
                    const sellerQuerySnapshot = await getDocs(query(collection(db, "Users"),where("email", "==", productData.sellerEmail)));
                    const userData = userSnapshot.data();

                    if (userData.money < productData.currentPrice) {
                        throw new Error("You don't have enough money to pay this product");
                    }
                    
                    if (!sellerQuerySnapshot.empty) {
                        const sellerDoc = sellerQuerySnapshot.docs[0];
                        const sellerItemRef = doc(sellerDoc.ref, 'Items', productID);
                        const sellerData = sellerDoc.data();
                        
                        transaction.update(productRef,{
                            isBrought: true,
                            currentBuyer: currentUser.email,
                            broughtAt: currentDate
                        });
    
                        transaction.set(userItemsRef, {
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            price: productData.currentPrice,
                            broughtAt: productData.duration,
                            payAt: currentDate,
                            productRef: productRef,
                            sellerEmail: productData.sellerEmail
                        });

                        transaction.set(sellerItemRef, {
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            price: productData.currentPrice,
                            broughtAt: productData.duration,
                            payAt: currentDate,
                            productRef: productRef,
                            sellerEmail: productData.sellerEmail
                        });

                        transaction.update(userRef, {
                            money: userData.money - productData.currentPrice
                        });
                        
                        transaction.update(sellerDoc.ref, {
                            money: sellerData.money + productData.currentPrice
                        });
                    }
                })

                // await fetchData();
                showToastMessage("Payment successful");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const limitPayTime = (time) => {
        let dueDate = time.toDate();
        return dueDate.setHours(dueDate.getHours() + 72);
    };
    
    
    useEffect(() => {
        setIsLoading(true);
        if (activeButton === "current") {
            const bidsCols = collectionGroup(db, "Bids");
            const q = query(
                bidsCols,
                where("bidder", "==", currentUser.email)
            );
            getDocs(q).then((querySnapshot) => {
                const productsTemp = [];
                const productsUnique = new Set();
                const promises = [];
                querySnapshot.forEach(doc => {
                    // console.log(doc.id)
                    const productRef = doc.ref.parent.parent;
                    const productId = productRef.id;
                    if (!productsUnique.has(productId)) {
                        productsUnique.add(productId)
                        const promise = getDoc(productRef).then((productDoc) => {
                            if (productDoc.exists && !productDoc.data().isBrought && 
                                (productDoc.data().currentBidder === currentUser.email || productDoc.data().duration > Timestamp.now())) {
                                // console.log(productDoc.id)
                                productsTemp.push({ id: productDoc.id, ...productDoc.data() });
                            }
                        })
                        promises.push(promise);
                    }
                });
                // console.log(productsTemp)
                Promise.all(promises).then(() => {
                    setProducts(productsTemp);
                    setIsLoading(false);
                });
            }, error => {
                console.log(error);
                setIsLoading(false);
            });
            // const productsCols = collection(db, "Products");
            // const q = query(
            //     productsCols,
            //     where("duration", "<", Timestamp.now()),
            //     where("isBrought", "==", false),
            //     where("currentBidder", "==", currentUser.email)
            // );
            // const unsubscribe = onSnapshot(q, querySnapshot => {
            //     const productsTemp = [];
            //     querySnapshot.forEach(doc => {
            //         productsTemp.push({ id: doc.id, ...doc.data() });
            //     });
            //     setProducts(productsTemp);
            //     setIsLoading(false);
            // }, error => {
            //     console.log(error);
            //     setIsLoading(false);
            // });

            // return () => unsubscribe();
        } else if (activeButton === "history") {
            const productsTemp = [];
            const itemsCols = collection(db, "Users", userData.id, "Items");
            const buyerItemSnapshot = query(
                itemsCols,
                where("sellerEmail", "!=", currentUser.email),
            );
            getDocs(buyerItemSnapshot)
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

    const renderer = (
        { days, hours, minutes, seconds, completed },
        productID, productSendTime
    ) => {
        if (completed) {
            return <p>Out of time</p>;
        } else {
            return (
                <div>
                    <p>
                        Remaning Time: {days} day, {hours} hours, {minutes}{" "}
                        minutes, {seconds} seconds
                    </p>
                    <button onClick={() => handlePayment(productID)}>Pay</button>
                    {/* <button onClick={() => console.log(productID)}>Pay</button> */}
                </div>
            );
        }
    };

    const rendererAuction = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <p>Auction has end</p>;
        } else {
            return (
                <div>
                    <p>
                        Time left: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds
                    </p>
                </div>
            );
        }
    }

    return (
        <div className="paint">
            <Header />
            <ProfileBanner/>
            <div className="Historymain">
                <Sidebar />
                <div className="History-container" >
                    <div className="topside">
                    <h3>BuyingHistorypage</h3>
                        <ButtonSwitch activeButton={activeButton} setActiveButton={setActiveButton}/>
                    </div>
                    <div className="content">
                    {isLoading ? (
                        <p>Loading...</p>
                        ) : activeButton === "current" ? (
                            products.length !== 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="History-products">
                                        <img src={product.productPhoto} alt="product pic"></img>
                                        <h5>{product.productName}</h5>
                                        {product.duration && product.duration > Timestamp.now() ? (
                                            <>
                                                {/* <h5>Highest Bid: {product.currentPrice?.toLocaleString()} THB</h5> */}
                                                <Countdown
                                                date={product.duration.toDate()}
                                                renderer={(props) => rendererAuction(props, product.currentPrice)}/>
                                            </>
                                        ) : (
                                            <>
                                                <h5>Price: {product.currentPrice?.toLocaleString()} THB</h5>
                                                {product.isSend ? (
                                                    <Countdown
                                                    date={limitPayTime(product.sendAt)}
                                                    renderer={(props) =>
                                                        renderer(props, product.id)
                                                    }
                                                    />
                                                ) : <h5>Waiting for seller.</h5>}
                                            </>
                                        )
                                        }
                                    </div>
                            ))
                        ) : (
                            <h4>None</h4>
                        )
                        ) : activeButton === "history" ? (
                            products.length !== 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="History-products">
                                        <img src={product.productPhoto} alt="product pic"></img>
                                        <h5>{product.productName}</h5>
                                        <h5>{product.price?.toLocaleString()} THB</h5>
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
            </div>
            
            <Footer />
        </div>
    );
};

export default BuyingHistorypage;

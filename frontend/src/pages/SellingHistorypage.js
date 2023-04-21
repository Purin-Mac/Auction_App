import "../style/History.css";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
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
    const [buyers, setBuyers] = useState({});

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
                orderBy("createAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const productsTemp = [];
                querySnapshot.forEach((doc) => {
                    const productData = doc.data();
                    productsTemp.push({ id: doc.id, ...productData });
                    if (!buyers[productData.currentBidder] && productData.duration < Timestamp.now()) {
                        // If the buyer does not exist, fetch their user data and add it to the users object
                        const buyerQuerySnapshot = query(collection(db, "Users"),where("email", "==", productData.currentBidder))
                        getDocs(buyerQuerySnapshot).then((querySnapshot) => {
                            if (!querySnapshot.empty) {
                                const buyerDoc = querySnapshot.docs[0];
                                setBuyers(prevBuyers => ({ ...prevBuyers, [productData.currentBidder]: buyerDoc.data().address}));
                            }
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                });
                // console.log(buyers)
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
                orderBy("broughtAt", "desc")
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

    const handleDeliver = async(productID) => {
        const productRef = doc(db, "Products", productID);
        await updateDoc(productRef, {
            isSend: true,
            sendAt: Timestamp.now()
        });
    };

    const handleConfirmPayment = async(productID) => {
        const productRef = doc(db, "Products", productID);
        const sellerRef = doc(db, "Users", userData.id);
        const sellerItemsRef = doc(sellerRef, 'Items', productID);
        const currentDate = Timestamp.now();
        runTransaction(db, async(transaction) => {
            const productDoc = await transaction.get(productRef);
            const sellerDoc = await transaction.get(sellerRef);
            if (!productDoc.exists() || !sellerDoc.exists()) {
                // console.log("Document does not exist!");
                // return;
                throw new Error("Document does not exist!");
            }
            
            const productData = productDoc.data();
            // const sellerData = sellerDoc.data();
            if (!productData.isBrought) {
                const buyerQuerySnapshot = await getDocs(query(collection(db, "Users"),where("email", "==", productData.currentBidder)));  
                
                if (!buyerQuerySnapshot.empty) {
                    const buyerDoc = buyerQuerySnapshot.docs[0];
                    const buyerItemRef = doc(buyerDoc.ref, 'Items', productID);
                    // const buyerData = buyerDoc.data();

                    transaction.update(productRef,{
                        isBrought: true,
                        currentBuyer: productData.currentBidder,
                        broughtAt: currentDate
                    });
                    
                    transaction.set(buyerItemRef, {
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        price: productData.currentPrice,
                        broughtAt: productData.duration,
                        payAt: currentDate,
                        productRef: productRef,
                        sellerEmail: productData.sellerEmail
                    });

                    transaction.set(sellerItemsRef, {
                        productName: productData.productName,
                        productPhoto: productData.productPhoto,
                        price: productData.currentPrice,
                        broughtAt: productData.duration,
                        payAt: currentDate,
                        productRef: productRef,
                        sellerEmail: productData.sellerEmail
                    });
                }
            }
        }).then(() => {
            console.log("Transaction completed.");
            showToastMessage(`Payment succesful`);
            // updateUserData(userData.id)
            // navigate('/category_product', { state: { categoryName: categoryName, categoryID: product.categoryID} });
        }).catch((error) => {
            console.log("Transaction failed: ", error);
            showToastMessage(error.message);
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
                    <p>Price: {productPrice?.toLocaleString()} THB</p>
                    {currentBidder ? (
                        productIsSend ? (
                            <div>
                                <p>Waiting for payment.</p>
                                <button onClick={() => handleConfirmPayment(productID)}>Confirm Payment</button>
                            </div>
                        ) : <button onClick={() => handleDeliver(productID)}>Deliver</button>
                    ) : (
                        <div>
                            <p>No one bid this product :{"("}</p>
                            <Link to={`/sell_item_details?productID=${productID}`}>
                                <button >Re Auction</button>
                            </Link>
                        </div>
                    )}
                    <p>{currentBidder}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Highest Bid: {productPrice?.toLocaleString()} THB</p>
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
                        <h3>Selling History</h3>
                        <ButtonSwitch
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                            />
                    </div>
                    <div className="content">
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
                                        <h5>Price: {product.price?.toLocaleString()} THB</h5>
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

export default SellingHistorypage;

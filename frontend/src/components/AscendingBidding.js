import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../service/AuthContext";
import { Timestamp, collection, doc, getDocs, onSnapshot, query, runTransaction, where } from "firebase/firestore";
import { db } from "../service/firebase";

const AscendingBidding = ({ product, setProduct, productID, showToastMessage }) => {
    const { currentUser, userData } = useContext(AuthContext);
    const incrementBid = Math.ceil((product.startPrice/100) * 115)

    const inputRef = useRef(null);
    const inputAutoBidRef = useRef(null);
    const previousBidPriceRef = useRef(null);
    const [bidPrice, setBidPrice] = useState(0);
    const [autoBidPrice, setAutoBidPrice] = useState(0);
    

    //submit bid price
    const handleBid = () => {
        const inputBidValue = Number(inputRef.current.value);
        if (currentUser.email === product.currentBidder) {
            showToastMessage(`You are already the highest bidder with ${product.currentPrice} Baht.`);
        }
        else if (inputBidValue < product.currentPrice + incrementBid) {
            console.log("Input Bid", inputRef.current.value);
            console.log("Least highest bid price: ", product.currentPrice + incrementBid)
            showToastMessage(`You need to bid at least ${product.currentPrice + incrementBid} Baht.`);
        }
        else {
            // console.log("Input Bid", inputBidValue);
            setBidPrice(inputBidValue);
        }
        // console.log("Product current price: ", product.currentPrice);
    };

    const handleIncreaseBid = (amount) => {
        const inputBidValue = Number(inputRef.current.value);
        inputRef.current.value = inputBidValue + Number(amount);
    };

    const handleAutoBid = () => {
        const inputAutoBidValue = Number(inputAutoBidRef.current.value);
        setAutoBidPrice(inputAutoBidValue);
        showToastMessage(`Set the auto bid ceiling to ${inputAutoBidValue} Baht.`);
        console.log(inputAutoBidValue)
        inputAutoBidRef.current.value = null;
    };

    const handleBuyNow = () => {
        const productRef = doc(db, "Products", productID);
        const userRef = doc(db, "Users", userData.id);
        const userItemsRef = doc(userRef, 'Items', productID);
        const currentDate = Timestamp.now();
        runTransaction(db, async(transaction) => {
            const productDoc = await transaction.get(productRef);
            const userDoc = await transaction.get(userRef);
            if (!productDoc.exists() || !userDoc.exists()) {
                // console.log("Document does not exist!");
                // return;
                throw new Error("Document does not exist!");
            }
            
            const productData = productDoc.data();
            const userDataFB = userDoc.data();
            if (!productData.isBrought) {
                if (userDataFB.money < productData.buyNowPrice) {
                    throw new Error("You don't have enough money to buy this product");
                }
                else {
                    const sellerQuerySnapshot = await getDocs(query(collection(db, "Users"),where("email", "==", productData.sellerEmail)));  
                    
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
                            price: productData.buyNowPrice,
                            broughtAt: currentDate,
                            productRef: productRef,
                            sellerEmail: productData.sellerEmail
                        });

                        transaction.set(sellerItemRef, {
                            productName: productData.productName,
                            productPhoto: productData.productPhoto,
                            price: productData.buyNowPrice,
                            broughtAt: currentDate,
                            productRef: productRef,
                            sellerEmail: productData.sellerEmail
                        });
                        
                        transaction.update(userRef, {
                            money: userDataFB.money - productData.buyNowPrice
                        });

                        transaction.update(sellerDoc.ref, {
                            money: sellerData.money + productData.buyNowPrice
                        });
                    }
                }
            }
        }).then(() => {
            console.log("Transaction completed.");
            showToastMessage(`You have buy ${product.productName}`);
            // updateUserData(userData.id)
            // navigate('/category_product', { state: { categoryName: categoryName, categoryID: product.categoryID} });
        }).catch((error) => {
            console.log("Transaction failed: ", error);
            showToastMessage(error.message);
        });
    };

    //set the minimum bid
    useEffect(() => {
        if (product && inputRef.current && incrementBid) {
            inputRef.current.value = product.currentPrice + incrementBid
        }
    }, [product, incrementBid]);

    //set highest bid
    useEffect(() => {
        const docRef = doc(db, "Products", productID);
        const userRef = doc(db, "Users", userData.id);
        // console.log("Bid price: ", bidPrice);
        const updateBid = async (transaction) => {
            const doc = await transaction.get(docRef);
            const userDoc = await transaction.get(userRef);
            if (!doc.exists()) {
                console.log("Document does not exist!");
                return;
            }
            const docData = doc.data();
            const userDataFB = userDoc.data();
            // console.log(docData);
            // console.log(userDataFB.money);
            if (
                currentUser.email !== docData.currentBidder &&
                bidPrice > Number(docData.currentPrice) &&
                bidPrice >= docData.currentPrice + incrementBid &&
                bidPrice <= userDataFB.money
            ) {
                transaction.update(docRef, {
                    currentPrice: bidPrice,
                    currentBidder: currentUser.email,
                });
                console.log("New bid update successfully");
            } else if (
                bidPrice < docData.currentPrice + incrementBid
            ) {
                return Promise.reject("Not enough bidding price.");
            } else if (bidPrice > userDataFB.money) {
                return Promise.reject("You don't have enough money.");
            } else {
                // console.log(bidPrice)
                // console.log(userDataFB.money)
                return Promise.reject("Something is worng.");
            }
        };

        if (bidPrice > Number(product.currentPrice)) {
            runTransaction(db, updateBid)
                .then(() => {
                    showToastMessage(
                        `You are now the current highest bidder with ${bidPrice} Baht.`
                    );
                    console.log("Transaction completed.");
                })
                .catch((error) => {
                    showToastMessage(error);
                    console.log("Transaction failed: ", error);
                    setBidPrice(0);
                    setAutoBidPrice(0);
                });
        }

        const unsub = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setProduct({ id: doc.id, ...doc.data() });
                const docData = doc.data();

                if (
                    docData.isBrought &&
                    currentUser.email !== docData.currentBuyer
                ) {
                    showToastMessage(
                        `The product has been purchased by someone else.`
                    );
                }

                if (
                    currentUser.email !== docData.currentBidder &&
                    docData.currentPrice !== docData.startPrice &&
                    (previousBidPriceRef.current === null ||
                        docData.currentPrice > previousBidPriceRef.current)
                ) {
                    // console.log(docData.currentBidder)
                    showToastMessage(
                        `There is a new highest bid with ${docData.currentPrice} Baht.`
                    );
                    previousBidPriceRef.current = docData.currentPrice;
                }

                if (
                    autoBidPrice !== 0 &&
                    currentUser.email !== docData.currentBidder
                ) {
                    const newBidPrice = docData.currentPrice + incrementBid;
                    console.log(newBidPrice);
                    if (
                        newBidPrice < autoBidPrice &&
                        newBidPrice !== docData.currentPrice
                    ) {
                        setBidPrice(newBidPrice);
                    } else {
                        showToastMessage(
                            `Bid price already pass the ceiling with ${newBidPrice} Baht.`
                        );
                        setAutoBidPrice(0);
                    }
                }
            }
        });

        return () => {
            unsub();
        };
    }, [bidPrice, productID, autoBidPrice, currentUser]);

    return (
        <>
            <h2>Manual Bid</h2>
            <div>
                <label>Enter your Price</label>
                <br />
                <input
                    ref={inputRef}
                    placeholder="0"
                    type="number"
                    name="price"
                    readOnly
                ></input>
                <br />
                <input
                    type="submit"
                    value="+10"
                    onClick={() => handleIncreaseBid(10)}
                    disabled={product.isBrought}
                />
                <input
                    type="submit"
                    value="+100"
                    onClick={() => handleIncreaseBid(100)}
                    disabled={product.isBrought}
                />
                <input
                    type="submit"
                    value="+1,000"
                    onClick={() => handleIncreaseBid(1000)}
                    disabled={product.isBrought}
                />
                <br />
                <div className="confirm">
                    <input
                        type="submit"
                        value="Place Bid"
                        onClick={handleBid}
                        disabled={product.isBrought}
                    />
                </div>
            </div>

            <br />
            <h2>Auto Bid</h2>
            <div>
                <label>Enter your Ceiling</label>
                <br />
                <input
                    ref={inputAutoBidRef}
                    placeholder="0"
                    type="number"
                    name="price"
                    readOnly={product.isBrought}
                ></input>
                <div className="confirm">
                    <input
                        type="submit"
                        value="Place Auto Bid"
                        onClick={handleAutoBid}
                        disabled={product.isBrought}
                    />
                </div>
            </div>

            {product.buyNowPrice !== 0 ? (
                <div>
                    <br />
                    <h2>Buy Now</h2>
                    <div>
                        <h4>
                            Buy Now: {product.buyNowPrice.toLocaleString()} THB
                        </h4>
                        <div className="confirm">
                            <input
                                type="submit"
                                value="Buy Now"
                                onClick={handleBuyNow}
                                disabled={product.isBrought}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default AscendingBidding;

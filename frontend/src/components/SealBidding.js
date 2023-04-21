import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../service/AuthContext";
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, runTransaction, where } from "firebase/firestore";
import { db } from "../service/firebase";

const SealBidding = ({ product, setProduct, productID, showToastMessage }) => {
    const { currentUser, userData } = useContext(AuthContext);
    const [currentUserBid, setCurrentUserBid] = useState(null);
    const inputRef = useRef(null);

    const handleSealBid = () => {
        const inputBidValue = Number(inputRef.current.value)
        // console.log("Bid: ", inputBidValue)
        // console.log("StartPrice: ", product.startPrice)
        if (!inputBidValue || inputBidValue <= product.startPrice) {
            showToastMessage("Please enter a valid seal bid higher than the minimum price.");
            inputRef.current.value = null;
            return;
        } else {
            addNewBid(inputBidValue);
            inputRef.current.value = null;
        }
    };

    const addNewBid= async(bid) => {
        const bidsRef = collection(db, "Products", productID, "Bids");
        const userRef = doc(db, "Users", userData.id);
        const newBidData = {
            bidder: currentUser.email,
            price: bid,
            timestamp: Timestamp.now()
        };
        getDoc(userRef).then((doc) => {
            if (doc.exists() && doc.data().money > bid) {
                addDoc(bidsRef, newBidData).then(() => {
                    showToastMessage(`You have bid ${product.productName} with ${bid} baht`);
                })
            } else if (doc.exists() && doc.data().money < bid) {
                showToastMessage("You don't have enough money.");
            } else {
                console.log("No such document!");
            }
        }).catch(error => {
            console.log("Error getting document: ", error);
        });
    }

    //listening to current user bid in Bids sub-collection
    useEffect(() => {
        const bidsCols = collection(db, "Products", productID,"Bids");
        const q = query(
            bidsCols,
            where("bidder", "==", currentUser.email)
        );
        const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.docs.length > 0) {
                const bidData = snapshot.docs[0].data();
                setCurrentUserBid(bidData)
            } else {
                setCurrentUserBid(null)
            }
        });
        
        return () => {
            unsub();
        };
    }, [currentUser.email, productID]);

    //listening to Bids sub-collection to update highest bid
    useEffect(() => {
        const bidsRef = collection(db, "Products", productID, "Bids");
        const productRef = doc(db, "Products", productID);
        const q = query(bidsRef, orderBy("price", "desc"), orderBy("timestamp"));

        const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.docs.length > 0) {
                const highestBid = snapshot.docs[0];
                const highestBidData = highestBid.data();
                const highestBidAmount = highestBidData.price;
                const highestBidder = highestBidData.bidder;
                const secondHighestBid = snapshot.docs[1];
                const secondHighestBidData = secondHighestBid?.data();
                const secondHighestBidAmount = secondHighestBidData?.price;
                console.log(secondHighestBidAmount)

                let currentPrice = highestBidAmount;
                let currentBidder = highestBidder;

                if (product.auctionType === "SecondPrice" && secondHighestBidAmount) {
                    currentPrice = secondHighestBidAmount;
                }
        
                if (product.currentPrice < currentPrice || product.currentBidder !== currentBidder) {
                    runTransaction(db, async(transaction) => {
                        const productDoc = await transaction.get(productRef);
                        if (!productDoc.exists()) {
                            console.log("Document does not exist!");
                            return;
                        }

                        const productData = productDoc.data();
                        if (productData.currentPrice < currentPrice || product.currentBidder !== currentBidder) {
                            transaction.update(productRef, {
                                currentPrice: currentPrice,
                                currentBidder: currentBidder,
                            });
                        }
                    }).catch((error) => {
                        console.log("Transaction failed: ", error);
                    });
                }
            }
        });
        
        return () => {
            unsub();
        };
    }, [productID]);
      
      

    //listening to product
    useEffect(() => {
        const productRef = doc(db, "Products", productID);
        const unsub = onSnapshot(productRef, (doc) => {
            if (doc.exists()) {
                setProduct({ id: doc.id, ...doc.data() });
            }
        });
        
        return () => {
            unsub();
        };
    }, [productID]);

    return (
        <div className="auto">
            {currentUserBid ? (
                <h2>Your Seal Bid: ${currentUserBid.price}</h2>
                ) : (
                <div>
                    <h2>Seal bidding</h2>
                    <label>Enter your seal bid</label>
                    <br />
                    <input
                        ref={inputRef}
                        placeholder="0"
                        type="number"
                        name="price"
                        readOnly={product.isBrought}
                        onWheel={event => event.currentTarget.blur()}
                        ></input>
                    <div className="confirm">
                        <input
                            type="submit"
                            value="Place Seal Bid"
                            onClick={handleSealBid}
                            disabled={product.isBrought}
                            />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SealBidding;

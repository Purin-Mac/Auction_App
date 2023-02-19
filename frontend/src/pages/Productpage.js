import { doc, getDoc, onSnapshot, runTransaction, updateDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
// import UseIsMount from "../components/UseIsMount";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { AuthContext } from "../service/AuthContext";
import { db } from "../service/firebase";
// import User from "../service/User";

function Productpage() {
    const { currentUser } = useContext(AuthContext);
    const [ product, setProduct ] = useState([]);

    const location = useLocation();
    const productID = location.state.id;

    const inputRef = useRef(null);
    const [bidPrice, setBidPrice] = useState(0);

    //submit bid price
    const handleBid = () => {
        if (currentUser.email === product.currentBidder) {
            showToastMessage(`You are already the highest bidder with ${product.currentPrice} Baht.`);
        }
        else if (inputRef.current.value < Math.ceil((product.currentPrice/100) * 110)) {
            console.log(inputRef.current.value);
            console.log(Math.ceil((product.currentPrice/100) * 110))
            showToastMessage(`You need to bid at least ${Math.ceil((product.currentPrice/100) * 110)} Baht.`);
        }
        else {
            setBidPrice(inputRef.current.value);
        }
        console.log(product.currentPrice);
        inputRef.current.value = null;
    };

    //Show alert message
    const showToastMessage = (msg) => {
        if (product) {
            toast(msg, {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                autoClose: 3000,
            });
        }
    };

    //get product data from firebase
    useEffect(() => {
        const docRef = doc(db, "Products", productID);
        getDoc(docRef).then(doc => {
            if (doc.exists()) {
                setProduct(doc.data());
            } 
            else {
            console.log("No such document!");
            }
        }).catch(error => {
            console.log("Error getting document: ", error);
        });
    }, [productID]);

    //set highest bid
    useEffect(() => {
        const docRef = doc(db, "Products", productID);
        console.log(bidPrice);

        const updateBid = async(transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists()) {
                console.log("Document does not exist!");
                return;
            }
            const docData = doc.data();
            console.log(docData);
            if (currentUser.email !== docData.currentBidder && bidPrice > docData.currentPrice && bidPrice >= Math.ceil((docData.currentPrice/100) * 110)) {
                transaction.update(docRef,{
                    currentPrice: bidPrice,
                    currentBidder: currentUser.email
                });
                console.log("New bid update successfully");
            }
        };

        // // console.log(typeof( Number(product.currentPrice)))
        // if (Number(product.currentPrice) < bidPrice) {
        //     const newHighestBid = bidPrice;
        //     updateDoc(docRef, {
        //         currentPrice: newHighestBid,
        //         currentBidder: currentUser.email
        //     }).then(() => {
        //         console.log("New bid update successfully");
        //     }).catch((error) => {
        //         console.log("Error updating bid: ", error);
        //     });
        // } 
        // else if (Number(product.currentPrice) >= bidPrice) {
        //     showToastMessage(`${bidPrice.toString() || 0} is not the highest bid.`);
        //     // console.log(product.sellerEmail)
        //     // console.log(highestBid);
        // }

        if (bidPrice > Number(product.currentPrice)){
            runTransaction(db, updateBid)
                .then(() => {
                    showToastMessage(`You are now the current highest bidder with ${bidPrice}.`)
                    console.log("Transaction completed.")
                })
                .catch((error) => {
                    console.log("Transaction failed: ", error)
                });
        };

        const unsub = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setProduct(doc.data());
            }
        });

        return () => {
            unsub();
        };
    }, [bidPrice, productID]);

    if (product === []) {
        return <h3>Loading...</h3>;
    }

    return (
        <>
            <Header />
            <h1>Product page</h1>
            <img src={product.productPhoto} alt="Item_Picture"></img>
            <h2>Product name: {product.productName}</h2>
            <p>Product info: {product.productInfo}</p>
            {/* <p>Time: {product.duration}</p> */}
            <h3>Highest Bit: {product.currentPrice} Baht</h3>
            {currentUser.email !== product.sellerEmail ?        
                <div>
                    <label>Enter your Price</label>
                    <input
                    ref={inputRef}
                    placeholder="0"
                    type="number"
                    name="price"
                    ></input>
                    <button onClick={handleBid}>Submit</button>   
                </div>
            : <h3>You are the owner.</h3>}
        </>
    );
}

export default Productpage;

import { doc, getDoc, onSnapshot, runTransaction, updateDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import UseIsMount from "../components/UseIsMount";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { AuthContext } from "../service/AuthContext";
import { db } from "../service/firebase";
import Countdown from 'react-countdown';
import '../style/main.css';
import Footer from "../components/Footer";
import Hood from '../resources/Bronx Hoodie.png';

// import User from "../service/User";

function Productpage() {
    const { currentUser, userData } = useContext(AuthContext);
    const [ product, setProduct ] = useState([]);

    // const navigate = useNavigate();
    const location = useLocation();
    const categoryName = location.state.categoryName;
    const productID = location.state.id;

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
        else if (inputBidValue < Math.ceil((product.currentPrice/100) * 110)) {
            console.log("Input Bid", inputRef.current.value);
            console.log("Least highest bid price: ", Math.ceil((product.currentPrice/100) * 110))
            showToastMessage(`You need to bid at least ${Math.ceil((product.currentPrice/100) * 110)} Baht.`);
        }
        else {
            console.log("Input Bid", inputBidValue);
            setBidPrice(inputBidValue);
        }
        console.log("Product current price: ", product.currentPrice);
        // inputRef.current.value = Math.ceil((product.currentPrice/100) * 110);
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
        const docRef = doc(db, "Products", productID);
        // const userItemsRef = doc(db, "Users", userData.id, 'Items', productID);
        runTransaction(db, async(transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists()) {
                console.log("Document does not exist!");
                return;
            }

            const docData = doc.data();
            if (!docData.isBrought) {
                transaction.update(docRef,{
                    isBrought: true,
                    currentBuyer: currentUser.email
                });
            }
        }).then(() => {
            console.log("Transaction completed.")
            showToastMessage(`You have buy ${product.productName}`);
            // navigate('/category_product', { state: { categoryName: categoryName, categoryID: product.categoryID} });
        }).catch((error) => {
            console.log("Transaction failed: ", error)
        });
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

    //set the minimum bid
    useEffect(() => {
        if (product && inputRef.current) {
            inputRef.current.value = Math.ceil((product.currentPrice/100) * 110)
        }
    }, [product]);

    //set highest bid
    useEffect(() => {
        const docRef = doc(db, "Products", productID);
        // console.log("Bid price: ", bidPrice);
        
        const updateBid = async(transaction) => {
            const doc = await transaction.get(docRef);
            if (!doc.exists()) {
                console.log("Document does not exist!");
                return;
            }
            const docData = doc.data();
            console.log(docData);
            if (currentUser.email !== docData.currentBidder && 
                bidPrice > Number(docData.currentPrice) && bidPrice >= Math.ceil((docData.currentPrice/100) * 110)) {
                transaction.update(docRef,{
                    currentPrice: bidPrice,
                    currentBidder: currentUser.email
                });
                console.log("New bid update successfully");
            }
            else if (bidPrice < Math.ceil((docData.currentPrice/100) * 110)) {
                return Promise.reject("Not enough bidding price.");
            }
            else {
                // return Promise.reject(`${currentUser.email}, ${docData.currentBidder}, ${bidPrice}, ${docData.currentPrice}, ${Math.ceil((docData.currentPrice/100) * 110)}`);
                // return Promise.reject(typeof(bidPrice));
                return Promise.reject("Something is worng.");
            }
        };

        if (bidPrice > Number(product.currentPrice)){
            runTransaction(db, updateBid)
                .then(() => {
                    showToastMessage(`You are now the current highest bidder with ${bidPrice} Baht.`)
                    console.log("Transaction completed.")
                })
                .catch((error) => {
                    console.log("Transaction failed: ", error)
                });
        };

        const unsub = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setProduct(doc.data());
                const docData = doc.data();
                
                if (docData.isBrought && currentUser.email !== docData.currentBuyer) {
                    showToastMessage(`The product has been purchased by someone else.`);
                    // navigate('/category_product', { state: { categoryName: categoryName, categoryID: docData.categoryID} });
                }

                if (currentUser.email !== docData.currentBidder && 
                    docData.currentPrice !== docData.startPrice && 
                    (previousBidPriceRef.current === null || docData.currentPrice > previousBidPriceRef.current)) {
                    console.log(docData.currentBidder)
                    showToastMessage(`There is a new highest bid with ${docData.currentPrice} Baht.`);
                    previousBidPriceRef.current = docData.currentPrice;
                }

                if (autoBidPrice !== 0 && currentUser.email !== docData.currentBidder) {
                    const newBidPrice = Math.ceil((docData.currentPrice / 100) * 110);
                    console.log(newBidPrice);
                    if (newBidPrice < autoBidPrice && newBidPrice !== docData.currentPrice) {
                        setBidPrice(newBidPrice);
                    }
                    else{
                        showToastMessage(`Bid price already pass the ceiling with ${newBidPrice} Baht.`);
                        setAutoBidPrice(0);
                    }
                };
            }
        });

        return () => {
            unsub();
        };
    }, [bidPrice, productID, autoBidPrice, currentUser]);

    if (product === []) {
        return <h3>Loading...</h3>;
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <h3>Auction has end.</h3>
        }
        else{
            return (
                <>
                    {currentUser.email !== product.sellerEmail ?    
                        <div>
                            {product.isBrought ?
                                (currentUser.email !== product.currentBuyer ?
                                    <>
                                        <h3>This product has been purchased.</h3>
                                    </>
                                : <h3>You have purchased this product.</h3>)
                            : null}
                            <h5 style={{ textAlign: "left", font: "bold"}}>Time left: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds</h5>
                            <h5 style={{ textAlign: "left", font: "bold"}}>Highest Bid: {product.currentPrice} Baht</h5>
                            <h2>Manual Bid</h2>
                                <div>
                                    <label>Enter your Price</label><br/>
                                    <input
                                    ref={inputRef}
                                    placeholder="0"
                                    type="number"
                                    name="price"
                                    readOnly
                                    ></input><br/>
                                    {/* <input type="text" id="fname" name="firstname" placeholder="Enter Price ..."/><br/> */}
                                    <input type="submit" value="+10" onClick={() => handleIncreaseBid(10)} disabled={product.isBrought} />
                                    <input type="submit" value="+100" onClick={() => handleIncreaseBid(100)} disabled={product.isBrought}/>
                                    <input type="submit" value="+1,000" onClick={() => handleIncreaseBid(1000)} disabled={product.isBrought}/><br/>
                                    {/* <button onClick={() => handleIncreaseBid(10)}>+10</button>
                                    <button onClick={() => handleIncreaseBid(100)}>+100</button>
                                    <button onClick={() => handleIncreaseBid(1000)}>+1000</button> */}
                                    <div class="confirm">
                                        <input type="submit" value="Place Bid" onClick={handleBid} disabled={product.isBrought}/>
                                    {/* <button onClick={handleBid}>Submit</button>    */}
                                    </div>
                                </div>

                            <br/>
                            <h2>Auto Bid</h2>
                            {/* <h3>Time left: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds</h3> */}
                            {/* <h3>Highest Bid: {product.currentPrice} Baht</h3>      */}
                            <div>
                                <label>Enter your Ceiling</label><br/>
                                <input
                                ref={inputAutoBidRef}
                                placeholder="0"
                                type="number"
                                name="price"
                                readOnly={product.isBrought}
                                ></input>
                                <div class="confirm">
                                        <input type="submit" value="Place Auto Bid" onClick={handleAutoBid} disabled={product.isBrought}/>
                                    {/* <button onClick={handleAutoBid}>Submit</button>    */}
                                </div>
                            </div>

                            {product.buyNowPrice !== 0 ? 
                                <div>
                                    <br/>
                                    <h2>Buy Now</h2>
                                    {/* <h3>Time left: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds</h3> */}
                                    <div>
                                        <h4>Buy Now: {product.buyNowPrice} THB</h4>
                                        <div class="confirm">
                                            <input type="submit" value="Buy Now" onClick={handleBuyNow} disabled={product.isBrought}/>
                                            {/* <button onClick={handleBid}>Submit</button>    */}
                                        </div>
                                        {/* <button onClick={handleBuyNow}>Buy Now</button> */}
                                    </div>
                                </div>
                            : null}
                        </div>    
                    : <h3>You are the owner.</h3>}
                </>    
            )
        }
    };

    return (
        <>
            <Header />
            {/* <h1>Product page</h1> */}
            

        <main>
            <div class="reccommend">
                <h1>Product name: {product.productName}</h1>
                <div class="cards">
                    <div class="row">
                        <div class="column-sale">
                            <div class="card-sale-1">
                                <img src={product.productPhoto} alt="Item_Picture" style={{ backgroundColor: "#F1F1F1", width: "100%",maxheight: "280px" }}></img>
                                <h3>Description</h3>
                                <p>Product info: {product.productInfo}</p>
                            </div>
                        </div>
                    
                        <div class="column-sale">
                            {/* <div class="switch-card">
                                <ul>
                                    <li><a href="#">Place Bid</a></li>
                                    <li><a href="#">Auto Bid</a></li>
                                    <li><a href="#">Buy Now</a></li>
                                </ul>
                            </div> */}
                            <div class="card-sale-2">
                            {product.duration && (
                                <Countdown
                                    date={product.duration.toDate()}
                                    renderer={renderer}
                                />
                            )}
                                {/* <h3>Highest Bid : 1500 Baht</h3><br/>
                                <h3>Buy now Price : 3000 Baht</h3><br/>
                                <h3>Time Left : </h3><br/>
                                <h2>Enter Your Price (THB)</h2>
                                <div class="form-sale">
                                    <input type="text" id="fname" name="firstname" placeholder="Enter Price ..."/><br/>
                                    <input type="submit" value="+10"/>
                                    <input type="submit" value="+100"/>
                                    <input type="submit" value="+1,000"/>
                                </div>
                                <div class="confirm">
                                    <input type="submit" value="Place Bid"/>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div class="related">
                        <h1>Related</h1>
                        <div class="cards">
                            <div class="row">
                                <div class="column">
                                    <div class="card">
                                        <img src={Hood} alt="Fist Related" />
                                        <h3>Nike Air Max 90</h3>
                                        <p>2000 baht</p>
                                    </div>
                                </div>
                            
                                <div class="column">
                                    <div class="card">
                                        <img src={Hood} alt="Second Related" />
                                        <h3>Jacket Rush Harrington</h3>
                                        <p>955 baht</p>
                                    </div>
                                </div>
                                
                                <div class="column">
                                    <div class="card">
                                        <img src={Hood} alt="Third Related" />
                                        <h3>Bronx Hoodie</h3>
                                        <p>963 baht</p>
                                    </div>
                                </div>
                                
                                <div class="column">
                                    <div class="card">
                                        <img src={Hood} alt="Forth Related" />
                                        <h3>Nike Air Max 270 React</h3>
                                        <p>1500 baht</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    );
}

export default Productpage;

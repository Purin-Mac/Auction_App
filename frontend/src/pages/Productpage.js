import { collection, doc, getDoc, getDocs, onSnapshot, query, runTransaction, Timestamp, updateDoc, where } from "firebase/firestore";
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
import RelatedProduct from "../components/RelatedProduct";
import Createchat from "../components/Createchat";
import AscendingBidding from "../components/AscendingBidding";
import SealBidding from "../components/SealBidding";

// import User from "../service/User";

function Productpage() {
    const { currentUser, userData, updateUserData } = useContext(AuthContext);
    const [ product, setProduct ] = useState([]);
    const [ sellerData, setSellerData ] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    // const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productID = searchParams.get("id");

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
                setProduct({ id: doc.id, ...doc.data() });
            } 
            else {
                console.log("No such document!");
            }
        }).catch(error => {
            console.log("Error getting document: ", error);
        });
    }, [productID]);

    //get seller data
    useEffect(() => {
        if (product.sellerEmail) {
            const usersCol = collection(db, "Users");
            const q = query(usersCol, where("email", "==", product.sellerEmail));
            getDocs(q).then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const sellerData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                    setSellerData(sellerData);
                } else {
                    console.log("No seller found.");
                }
            });
        }
    }, [product.sellerEmail]);

    //set waiting
    useEffect(() => {
        if (product.startTime && product.startTime > Timestamp.now) {
          setIsWaiting(true);
        }
    }, [product.startTime]);

    const handleCountdownComplete = () => {
        setIsWaiting(false);
    };

    if (product === []) {
        return <h3>Loading...</h3>;
    }

    const waitingRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            handleCountdownComplete();
            return null;
        }
        else {
            return (
                <>
                    <h3>Auction Type : {product.auctionType}</h3>
                    <h5 style={{ textAlign: "left", font: "bold"}}>Time before auction start: {days} day, {hours} hours, {minutes} minutes, {seconds} seconds</h5>
                </>
            );
        }
    };

    const AuctionRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <h3>Auction has end.</h3>
        }
        else{
            return (
                <>
                    {/* {currentUser.email !== product.sellerEmail ?     */}
                        <div className="bid-detail">
                            {product.isBrought ?
                                (currentUser.email !== product.currentBuyer ?
                                    <>
                                        <h3>This product has been purchased.</h3>
                                    </>
                                : <h3>You have purchased this.</h3>)
                            : null}
                            <h3>Auction Type : {product.auctionType}</h3>
                            
                            {product.currentPrice === product.startPrice || product.auctionType !== "English"? 
                            <h1 style={{ textAlign: "middle", font: "bold"}}>Start Price : <span>{product.startPrice?.toLocaleString()} THB</span></h1>
                            : <h1 style={{ textAlign: "middle", font: "bold"}}>Highest Bid : <span>{product.currentPrice?.toLocaleString()} THB</span></h1>}
                            <h5 style={{ textAlign: "left", font: "bold"}}>Time left : {days} days, {hours} hours, {minutes} minutes, {seconds} seconds</h5>

                        </div>
                        <div className="countdown">
                            {product.auctionType === "English" ? (
                                <AscendingBidding product={product} setProduct={setProduct} productID={productID} showToastMessage={showToastMessage}/>
                            ) : product.auctionType === "FirstPrice" || product.auctionType === "SecondPrice"?(
                                <SealBidding product={product} setProduct={setProduct} productID={productID} showToastMessage={showToastMessage}/>
                            ) : null}
                        </div>    
                    {/* : <h3>You are the owner.</h3>} */}
                </>    
            )
        }
    };

    return (
        <>
            <Header />
            

        <main>
            <div className="reccommend">
                <h1> {product.productName}</h1>
                <div className="cards">
                    <div className="row">
                        <div className="column-sale">
                            <div className="card-sale-1">
                                <img src={product.productPhoto} alt="Item_Picture" style={{ backgroundColor: "#F1F1F1", width: "100%",maxheight: "280px" }}></img>
                                <div className="sale-text">
                                    <br></br>
                                    <h3>Description</h3>
                                    <p>{product.productInfo}</p>
                                    <p>Sell by : {sellerData.userName}</p>
                                    <br></br>
                                    {product.sellerEmail !== currentUser.email ? <Createchat sellerData={sellerData}/> : null}
                                </div>
                            </div>
                        </div>
                    
                        <div className="column-sale">
                            <div className="card-sale-1">
                                {currentUser.email !== product.sellerEmail ?
                                    (product.startTime && isWaiting? (
                                        <Countdown
                                            date={product.startTime.toDate()}
                                            renderer={waitingRenderer}
                                        />
                                    ) : (
                                        (product.duration && (
                                            <Countdown
                                                date={product.duration.toDate()}
                                                renderer={AuctionRenderer}
                                            />
                                        ))
                                    ))
                                
                                : <div className="owner"><h3>You are the owner.</h3></div>}
                            </div>
                        </div>
                    </div>
                    <RelatedProduct categoryID={product.categoryID} currentProductDuration={product.duration}/>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    );
}

export default Productpage;

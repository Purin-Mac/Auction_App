import React, { useState, useEffect, useRef} from "react";
import UseIsMount from "../components/UseIsMount";
import {ToastContainer, toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header";
import ItemPic from "../resources/Nike Air Max 270 React (1).png";

function Item() {
    const inputRef = useRef(null);
    const isMount = UseIsMount();
    const [highestBid, setHighestBid] = useState(1200);
    const [bidPrice, setBidPrice] = useState(0);
    const highestBidRef = useRef(highestBid);
    
    //submit bid price
    const handleBid = () => {
        setBidPrice(inputRef.current.value);
        // console.log(inputRef.current.value);
        inputRef.current.value = null;
    };

    //Show alert message
    const showToastMessage = (price) => {
        toast(`${price} is not the highest bid.`, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000
        });
    };

    //set initial value
    // useEffect(() => {
    //     inputRef.current.value = 0;
    // }, []);

    //set highest bid
    useEffect(() => {
        if (!isMount) {
            if(highestBidRef.current < bidPrice){
                setHighestBid(bidPrice.replace(/^0+(?=\d)/, ''));
                highestBidRef.current = bidPrice;
            }
            else{
                showToastMessage(bidPrice);
                // console.log(highestBid);
            }
        }
    }, [bidPrice, isMount]);

    return (
        <>
            <Header />
            <h1>Item</h1>
            <img src={ItemPic} alt="Item_Picture"></img>
            <h2>Highest Bit: {highestBid} Baht</h2>
            <div>
                <label>Enter your Price</label>
                <input ref={inputRef} placeholder='0' type="number" name="price"></input>
                <button onClick={handleBid}>Submit</button>
            </div>
            <ToastContainer/>
        </>
    );
}

export default Item;

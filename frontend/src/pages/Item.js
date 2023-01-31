import React, { useState, useEffect, useRef } from "react";
// import UseIsMount from "../components/UseIsMount";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import ItemPic from "../resources/Nike Air Max 270 React (1).png";
// import User from "../service/User";

function Item({ socket }) {
    // const user = User();
    const inputRef = useRef(null);
    // const isMount = UseIsMount();
    const isMount = useRef(true);
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
        toast(`${price || 0} is not the highest bid.`, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000,
        });
    };

    //set initial value
    // useEffect(() => {
    //     inputRef.current.value = 0;
    // }, []);

    // const sendHighestBid = () => {
    //     console.log(socket)
    //     socket.emit('updateHighestBid', {
    //         userID: user.uid,
    //         userName: user.displayName,
    //         userEmail: user.email,
    //         highestBid
    //     });
    // };

    //write data to firestore
    

    //set highest bid
    useEffect(() => {
        if (!isMount.current) {
            if (highestBidRef.current < bidPrice) {
                setHighestBid(bidPrice.replace(/^0+(?=\d)/, ""));
                highestBidRef.current = bidPrice;
                // sendHighestBid();
            } else {
                showToastMessage(bidPrice.replace(/^0+(?=\d)/, ""));
                // console.log(highestBid);
            }
        } else {
            isMount.current = false;
        }
    }, [bidPrice]);

    return (
        <>
            <Header />
            <h1>Item</h1>
            <img src={ItemPic} alt="Item_Picture"></img>
            <h2>Highest Bit: {highestBid} Baht</h2>
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
        </>
    );
}

export default Item;

import React, { useContext, useRef } from "react";
import { AuthContext } from "../service/AuthContext";

const SealBidding = ({ product, setProduct, productID, showToastMessage }) => {
    const { currentUser, userData } = useContext(AuthContext);
    const inputRef = useRef(null);

    return (
        <>
            <h2>Your seal bidding</h2>
            <div>
                <label>Enter your seal bid</label>
                <br />
                <input
                    ref={inputRef}
                    placeholder="0"
                    type="number"
                    name="price"
                    readOnly={product.isBrought}
                ></input>
                <div className="confirm">
                    <input
                        type="submit"
                        value="Place Seal Bid"
                        // onClick={handleSelBid}
                        disabled={product.isBrought}
                    />
                </div>
            </div>
        </>
    );
};

export default SealBidding;

import React, { useEffect, useState } from "react";
import { Timestamp, collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../service/firebase";
import { Link } from "react-router-dom";
import '../style/main.css';

const Discover = () => {
    const [discoverProducts, setDiscoverProducts] = useState([]);

    useEffect(() => {
        const productsRef = collection(db, "Products");
        const q = query(
            productsRef,
            where("duration", ">=", Timestamp.now()),
            where("isBrought", "==", false),
            orderBy("duration"),
            limit(4)
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
            const products = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDiscoverProducts(products);
        });

        return () => {
            unsub();
        };
    }, []);

    return (
        <div className="discover-cards">
            <div className="row">
                {discoverProducts.map((product) => (
                    <div className="column" key={product.id}>
                        <Link to={`/product?id=${product.id}`} style={{ textDecoration: "none", color: "black"}}>
                            <div className="discover-card">
                                <img src={product.productPhoto} alt={product.productName} />
                                <div className="bottomcard">
                                    <h5>{product.productName}</h5>
                                    <p> {product.currentPrice?.toLocaleString()} THB</p><br></br><br></br><br></br>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;

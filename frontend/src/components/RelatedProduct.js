import {
    Timestamp,
    collection,
    getDocs,
    limit,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../service/firebase";
import "../style/main.css";
import { Link } from "react-router-dom";

const RelatedProduct = ({ categoryID, currentProductDuration }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            // console.log(currentProductDuration.toDate())
            if (categoryID && currentProductDuration) {
                // const currentProductDurationDate = currentProductDuration.toDate();
                const productsRef = collection(db, "Products");
                const q = query(
                    productsRef,
                    where("categoryID", "==", categoryID),
                    where("duration", ">=", Timestamp.now()),
                    where("duration", "!=", currentProductDuration),
                    where("isBrought", "==", false),
                    limit(4)
                );
                const querySnapshot = await getDocs(q);
                const products = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRelatedProducts(products);
            }
            // console.log(products)
        };

        fetchRelatedProducts();
    }, [categoryID, currentProductDuration]);

    return (
        <>
            <div className="related">
                <h1>Related</h1>
                <div className="related-cards">
                    <div className="row">
                        {relatedProducts.map((product) => (
                            <div className="column" key={product.id}>
                                <Link
                                    to={`/product?id=${product.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                >
                                    <div className="related-card">
                                        <img
                                            src={product.productPhoto}
                                            alt="Related Product"
                                        />
                                        <div className="bottomcard">
                                            <h6>{product.productName}</h6>
                                            <p>{product.currentPrice} THB</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RelatedProduct;

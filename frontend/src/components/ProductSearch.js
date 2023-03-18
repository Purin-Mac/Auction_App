import { useState, useEffect } from "react";
import { db } from "../service/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";


const ProductSearch = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsCol = collection(db, "Products");
        const productsQuery = searchTerm ? query(productsCol, where('searchName', '>=', searchTerm.toLowerCase()), where('searchName', '<=', searchTerm.toLowerCase() + '\uf8ff')) : productsCol;
        const unsub = onSnapshot(productsQuery, (querySnapshot) => {
            const productsTemp = [];
            querySnapshot.forEach(doc => {
                productsTemp.push( { id: doc.id, ...doc.data() } );
            });
            setProducts(productsTemp);
        });

        return () => {
            unsub();
        };
    }, [searchTerm]);

    return (
        <>
            {products.length !== 0 ?  
                products.map((product) => (
                    <div key={product.id}>
                        <h3>{product.productName}</h3>
                        <img src={product.productPhoto}></img>
                        <p>{product.productName}</p>
                    </div>
                ))
            : <h3>None</h3> }
        </>
    );
};

export default ProductSearch;
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../service/AuthContext";
import { db, storage, timestamp } from "../service/firebase";
import { toast } from "react-toastify"

const SellItemPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const categoryName = location.state.categoryName;
    const categoryID = location.state.categoryID;

    const itemTitle = useRef();
    const itemInfo = useRef();
    const startPrice = useRef();
    const buyNowPrice = useRef();
    const itemDuration = useRef();
    const itemImage = useRef();
    const imgTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const showToastMessage = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000
        });
    };
    
    const handleSubmit = async(event) => {
        event.preventDefault();

        // let currentDate = new Date();
        // let dueDate = new Date(currentDate);
        // dueDate.setHours(currentDate.getHours() + Number(itemDuration.current.value));

        let currentDate = Timestamp.now();
        let dueDate = currentDate.toDate();
        dueDate.setHours(dueDate.getHours() + Number(itemDuration.current.value));

        
        if (!imgTypes.includes(itemImage.current.files[0].type)) {
            return showToastMessage("Only JPEG, JPG and PNG files are accepted");
        }

        const nameArray = itemTitle.current.value.toLowerCase().split(' ');
        const searchPartial = nameArray.slice(1);

        const productsData = {
                sellerEmail: currentUser.email,
                categoryID: categoryID,
                productName: itemTitle.current.value,
                searchName: itemTitle.current.value.toLowerCase(),
                searchPartial: searchPartial,
                productPhoto: itemImage.current.files[0],
                productInfo: itemInfo.current.value,
                startPrice: Number(startPrice.current.value),
                currentPrice: Number(startPrice.current.value),
                buyNowPrice: 0 || Number(buyNowPrice.current.value),
                currentBidder: null,
                isBrought: false,
                isSend: false,
                createAt: currentDate,
                duration: dueDate          
        };

        const imageRef = ref(storage, `images/${productsData.productName}`);
        uploadBytes(imageRef, productsData.productPhoto).then((snapshot) => {
            console.log('Uploaded a file!');
            getDownloadURL(ref(storage, `images/${productsData.productName}`)).then((url) => {
                // console.log(url);
                productsData.productPhoto = url;
                const productCol = collection(db, "Products");
                addDoc((productCol), productsData);
                navigate('/sell');
            });
        });
    };

    return (
        <>
            <Header />
            <h1>Sell Item Page</h1>
            {/* <p>Category: {categoryName}</p> */}
            <Form style={{ margin: "0 20px" }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" required ref={itemTitle} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" value={categoryName} disabled readOnly/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Product Info</Form.Label>
                    <Form.Control type="text" required ref={itemInfo} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Start Price</Form.Label>
                    <Form.Control type="number" required ref={startPrice} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Buy Now Price (default: none)</Form.Label>
                    <Form.Control type="number" ref={buyNowPrice} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Auction Duration (Hours, Max 7 days)</Form.Label>
                    <Form.Control type="number" max={168} required ref={itemDuration} />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Product Image</Form.Label>
                    <Form.Control type="file" required ref={itemImage}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Seller</Form.Label>
                    <Form.Control type="text" value={currentUser.email} disabled readOnly/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SellItemPage;

import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../service/AuthContext";
import { db, storage } from "../service/firebase";
import { toast } from "react-toastify"
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { add } from 'date-fns';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "../style/tooltip.css"

const SellItempage = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [ categoryName, setCategoryName ] = useState('');
    const [ categoryID, setCategoryID ] = useState('');
    const [ productID, setProductID ] = useState('');
    const [ productPic, setProductPic ] = useState(null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    let tooltipContent;
    const location = useLocation();
    
    const itemTitle = useRef();
    const itemInfo = useRef();
    const startPrice = useRef();
    const buyNowPrice = useRef();
    // const itemDuration = useRef();
    const [ auctionType, setAuctionType ] = useState("");
    const [ itemStartTime, setItemStartTime ] = useState(null);
    const [ itemDuration, setItemDuration ] = useState(null);
    const itemImage = useRef();
    const imgTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const thaiRegex = /[\u0E00-\u0E7F]/;

    const showToastMessage = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000
        });
    };


    const isThaiInput = (input) => {
        return thaiRegex.test(input);
    }
    
    const addProduct = async(searchPartial) => {
        let currentDate = Timestamp.now();
        if (productID) {
            const productRef = doc(db, "Products", productID);
            const updatedProductData = {
                productName: itemTitle.current.value,
                searchName: itemTitle.current.value.toLowerCase(),
                searchPartial: searchPartial,
                productInfo: itemInfo.current.value,
                auctionType: auctionType,
                startPrice: Number(startPrice.current.value),
                currentPrice: Number(startPrice.current.value),
                buyNowPrice: 0 || Number(buyNowPrice.current.value),
                createAt: currentDate,
                startTime: itemStartTime,
                duration: itemDuration          
            };
            await updateDoc(productRef, updatedProductData)
            navigate(`/category_product?id=${categoryID}`);
        }
        else{
            if (!imgTypes.includes(itemImage.current.files[0].type)) {
                return showToastMessage("Only JPEG, JPG and PNG files are accepted");
            }

            if (Number(buyNowPrice.current.value) !== 0 && Number(buyNowPrice.current.value) < Math.ceil((Number(startPrice.current.value)/100) * 130)) {
                return showToastMessage("Buy Now Price must be at least 30% more than Start Price.");;
            }

            if (itemDuration.getTime() < itemStartTime.getTime()) {
                return showToastMessage("Duration must be greater than start time.");
            }

            if (itemDuration.getTime() - itemStartTime.getTime() < 60*60*1000) {
                // console.log(itemDuration.getDate() <= itemStartTime.getDate() && itemDuration.getHours() <= itemStartTime.getHours())
                // console.log(itemStartTime.getTime(), itemDuration.getTime(), itemDuration.getTime() - itemStartTime.getTime())
                // console.log(itemDuration.getTime() - itemStartTime.getTime() < 60*60*1000)
                return showToastMessage("Duration must be at least 1 hour.");
            }

            const productsData = {
                    sellerEmail: currentUser.email,
                    categoryID: categoryID,
                    productName: itemTitle.current.value,
                    searchName: itemTitle.current.value.toLowerCase(),
                    searchPartial: searchPartial,
                    productPhoto: itemImage.current.files[0],
                    productInfo: itemInfo.current.value,
                    auctionType: auctionType,
                    startPrice: Number(startPrice.current.value),
                    currentPrice: Number(startPrice.current.value),
                    buyNowPrice: 0 || Number(buyNowPrice.current.value),
                    currentBidder: null,
                    isBrought: false,
                    isSend: false,
                    createAt: currentDate,
                    startTime: itemStartTime,
                    duration: itemDuration          
            };
    
            const timestamp = currentDate.toDate().getTime();
            const imageRef = ref(storage, `images/${productsData.productName}_${timestamp}`);
            uploadBytes(imageRef, productsData.productPhoto).then((snapshot) => {
                console.log('Uploaded a file!');
                getDownloadURL(ref(storage, `images/${productsData.productName}_${timestamp}`)).then((url) => {
                    // console.log(url);
                    productsData.productPhoto = url;
                    const productCol = collection(db, "Products");
                    addDoc((productCol), productsData);
                    toast("Add new product succesful", {
                        position: toast.POSITION.TOP_CENTER,
                        pauseOnHover: false,
                        pauseOnFocusLoss: false,
                        autoClose: 3000
                    });
                    navigate(`/category_product?id=${categoryID}`);
                });
            });
        }
    };

    const handleSubmit = async(event) => {
        event.preventDefault();

        // let currentDate = new Date();
        // let dueDate = new Date(currentDate);
        // dueDate.setHours(currentDate.getHours() + Number(itemDuration.current.value));

        // let currentDate = Timestamp.now();
        // let dueDate = currentDate.toDate();
        // dueDate.setHours(dueDate.getHours() + Number(itemDuration.current.value));

        if (isThaiInput(itemTitle.current.value.toLowerCase()) && !isSubmitting) {
            setIsSubmitting(true)
            try {
                // Send an API call to the Node.js server to perform wordcut
                const response = await axios.post('http://localhost:5000/wordcut', { text: itemTitle.current.value.toLowerCase(), skipFirstWord: true });
            
                // Extract the searchPartial from the response
                const { searchPartial } = response.data;
                addProduct(searchPartial);
            } catch (error) {
                console.error(error);
            }
            setIsSubmitting(false)
        } else if (!isSubmitting) {
            try {
                setIsSubmitting(true)
                const nameArray = itemTitle.current.value.toLowerCase().split(' ');
                const searchPartial = nameArray.slice(1);
                addProduct(searchPartial);
            } catch (error) {
                console.error(error);
            }
            setIsSubmitting(false)
        }
    };

    const tooltipEnglish = (
        <Tooltip id="tooltipEnglish" className="my-tooltip">
          English Auction: The price starts low and increases with each bid until no one is willing to bid higher.
        </Tooltip>
    );
    const tooltipFirstPrice = (
        <Tooltip id="tooltipFirstPrice" className="my-tooltip">
            First-Price Seal-Bid Auction: Each bidder submits a sealed bid and the highest bidder wins, paying their bid amount.
        </Tooltip>
    );
    const tooltipSecondPrice = (
        <Tooltip id="tooltipSecondPrice" className="my-tooltip">
            Second-Price Seal-Bid Auction: Each bidder submits a sealed bid and the highest bidder wins, paying the second-highest bid amount.
        </Tooltip>
    );
    const tooltipDutch = (
        <Tooltip id="tooltipDutch" className="my-tooltip">
            Dutch Auction: The price starts high and decreases until someone is willing to bid, then that person wins the item at the current price.
        </Tooltip>
    );

    switch (auctionType) {
    case "English":
        tooltipContent = tooltipEnglish;
        break;
    case "FirstPrice":
        tooltipContent = tooltipFirstPrice;
        break;
    case "SecondPrice":
        tooltipContent = tooltipSecondPrice;
        break;
    case "Dutch":
        tooltipContent = tooltipDutch;
        break;
    default:
        tooltipContent = (
        <Tooltip id="tooltipDefault" className="my-tooltip">
            Please select an auction type.
        </Tooltip>
        );
    }

    //get product data
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tempProductID = searchParams.get("productID");
        if (tempProductID) {
            // console.log(productId)
            setProductID(tempProductID)
            const productRef = doc(db, "Products", tempProductID);
            getDoc(productRef).then((doc) => {
                if (doc.exists()) {
                    const productData = doc.data();
                    setCategoryID(productData.categoryID);
                    itemTitle.current.value = productData.productName;
                    itemInfo.current.value = productData.productInfo;
                    startPrice.current.value = productData.startPrice;
                    // setItemDuration(productData.duration.toDate())
                    setProductPic(productData.productPhoto);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
        else {
            const categoryID = searchParams.get("id");
            setCategoryID(categoryID);
        }
    }, [location.search]);

    //get category name
    useEffect(() => {
        if (categoryID) {
            const categoryRef = doc(db, "Categories", categoryID);
            getDoc(categoryRef).then((doc) => {
                if (doc.exists()) {
                    setCategoryName(doc.data().categoryName);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        };
    }, [categoryID]);

    const filterPassedTime = (time) => {
        const currentDate = Timestamp.now().toDate();
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
    };

    const filterPassedOneHour = (time) => {
        const currentDate = Timestamp.now().toDate();
        const selectedDate = new Date(time);
      
        if (itemStartTime) {
          const oneHourAfterStartTime = add(itemStartTime, { minutes: 59 });
          return (
            currentDate.getTime() < selectedDate.getTime() &&
            selectedDate.getTime() >= oneHourAfterStartTime.getTime()
          );
        } else {
            const oneHourAfterNow = add(currentDate, { hours: 1 });
            return (
              currentDate.getTime() < selectedDate.getTime() &&
              selectedDate.getTime() >= oneHourAfterNow.getTime()
            );
        }
    };

    return (
        <>
            <Header />
            <div className="sellform">
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
                        <Form.Label>Auction Type</Form.Label>
                        <OverlayTrigger key={auctionType} placement="right" overlay={tooltipContent}>
                            <FontAwesomeIcon className="fa" icon={faCircleInfo} style={{ margin: "0 0 0 3%" }}/>
                        </OverlayTrigger>
                        <Form.Select value={auctionType} onChange={(e) => {
                            setAuctionType(e.target.value)
                            if (e.target.value !== 'English') {
                                buyNowPrice.current.value = null;
                            }
                        }} required>
                            <option value="">-- Select Auction Type --</option>
                            <option value="English">English Auction</option>
                            <option value="FirstPrice">First-Price Seal-Bid Auction</option>
                            <option value="SecondPrice">Second-Price Seal-Bid Auction</option>
                            {/* <option value="Dutch">Dutch Auction</option> */}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Product Info</Form.Label>
                        <Form.Control as="textarea" rows={4} maxLength={200} placeholder="Maximum 200 characters" required ref={itemInfo} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Start Price</Form.Label>
                        <Form.Control type="number" min={1} required ref={startPrice} onWheel={event => event.currentTarget.blur()}/>
                    </Form.Group>

                    <Form.Group className="mb-3" style={auctionType !== "English" ? { display: "none" } : null}>
                        <Form.Label>Buy Now Price (default: none)</Form.Label>
                        <Form.Control type="number" min={0} ref={buyNowPrice} onWheel={event => event.currentTarget.blur()}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Auction Duration (Max 7 days)</Form.Label>
                        {/* <Form.Control type="number" max={168} required ref={itemDuration} onWheel={event => event.currentTarget.blur()}/> */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <DatePicker 
                                customInput={<Form.Control />}
                                selected={itemStartTime}
                                onChange={(date) => setItemStartTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                minDate={Timestamp.now().toDate()}
                                maxDate={add(Timestamp.now().toDate(), { days: 2 })}
                                filterTime={filterPassedTime}
                                popperPlacement="top"
                                required
                                isClearable
                                placeholderText="Start Time"
                                />
                            <DatePicker 
                                customInput={<Form.Control />}
                                selected={itemDuration}
                                onChange={(date) => setItemDuration(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                minDate={itemStartTime? itemStartTime : Timestamp.now().toDate()}
                                maxDate={itemStartTime? add(itemStartTime, { days: 7 }) : add(Timestamp.now().toDate(), { days: 7 })}
                                filterTime={filterPassedOneHour}
                                // excludeTimes={itemStartTime ? [
                                //     add(itemStartTime, { minutes: 15 }),
                                //     add(itemStartTime, { minutes: 30 }),
                                //     add(itemStartTime, { minutes: 45 }),
                                //     add(itemStartTime, { hours: 1 })
                                // ] : []}
                                popperPlacement="top"
                                required
                                isClearable
                                placeholderText="End Time"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        {productPic ? 
                            <div className="text-center">
                                <img src={productPic} alt="product" className="img-fluid shadow-sm p-3 mb-5 bg-body rounded border"/>
                            </div>
                        : <Form.Control type="file" required ref={itemImage}/>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Seller</Form.Label>
                        <Form.Control type="text" value={currentUser.email} disabled readOnly/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
            <Footer/>
        </>
    );
};

export default SellItempage;

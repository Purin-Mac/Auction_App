import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, timestamp } from "./firebase";
import imageFile1 from '../resources/Airjordan.png';
import { add } from "date-fns";
import axios from "axios";

export const genUsers = (database) => {
    const usersData = [ 
        {
            userName: "purin petch-in",
            userPhoto: "",
            firstName: "",
            lastName: "",
            email: "purin.mac.2001@gmail.com",
            numberID: "",
            phoneNumber: "",
            address: {
                street: "",
                city: "",
                state: "",
                zip: ""
            },
            money: 0
        }, 
        {
            userName: "ภูรินท์ เพ็ชรอินทร์",
            userPhoto: "",
            firstName: "",
            lastName: "",
            email: "s6201012620325@email.kmutnb.ac.th",
            numberID: "",
            phoneNumber: "",
            address: {
                street: "",
                city: "",
                state: "",
                zip: ""
            },
            money: 0
        }
    ];
    const usersCol = collection(database, "Users");
    usersData.forEach(User => {
        addDoc((usersCol), User);
    });
};

export const genCategories = (database) => {
    const categoriesData = [ 
        { categoryName: "Shoes" },
        { categoryName: "Men's clothes" },
        { categoryName: "Women's clothes" },
        { categoryName: "Accessories" }
    ];
    const categoriesCol = collection(database, "Categories");
    categoriesData.forEach(category => {
        addDoc((categoriesCol), category);
    });
};

function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const thaiRegex = /[\u0E00-\u0E7F]/;

const isThaiInput = (input) => {
    return thaiRegex.test(input);
}

export const genProducts = async(database) => {
    const categoriesCol = collection(database, "Categories");
    const categoryDict = {
        "Men's clothes": "", 
        "Women's clothes": "", 
        "Shoes": "", 
        "Accessories": ""
    };
    // Object.keys(categoryDict).forEach(async (key) => {
    //     const q = query(categoriesCol, where("categoryName", "==", key));
    //     const querySnapshot = await getDocs(q)
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         // console.log(doc.id, " => ", doc.data());
    //         // console.log(typeof(doc.id))
    //         // (function (key) {
    //             categoryDict[key] = doc.id;
    //         // })
    //     });
    // });

    const getCategoryIds = async () => {
        const promises = Object.keys(categoryDict).map(async (key) => {
            const q = query(categoriesCol, where("categoryName", "==", key));
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                categoryDict[key] = doc.id;
            });
        });

        await Promise.all(promises);
    };
    
    await getCategoryIds();

    const usersEmail = ["s6201012630045@email.kmutnb.ac.th", "purin.mac.2001@gmail.com"]
    // const usersCol = collection(database, "Users");
    // getDocs(usersCol).then(user => {
    //     user.forEach((doc) => {
    //         users.push(doc.id);
    //     });
    // });
    const productsNames = [
        "Velocity Runners", "FlexiGrip Trainers", "Zenith Elite Sneakers", "PowerStride Running Shoes", "Apex Performance Sneakers", 
        "SwiftFit Cross-Trainers", "ProPulse Athletic Shoes", "DynaFusion Fitness Shoes", "UltraFlow Running Shoes", 
        "StormGuard Hiking Boots", "AeroSwift Tennis Shoes", "HyperJump Basketball Shoes", "EnduroX Trail Runners", 
        "AirTech Elite", "ReactorMax Runners", "DynaFlex Training Shoes", "VaporBounce Athletic Shoes", "AeroFlow Tennis Sneakers", 
        "SwiftForce Cross-Trainers", "UltraBoost Running Shoes", "FlexiKnit Walking Shoes", "PowerStrike Fitness Sneakers", 
        "ThunderDunk Basketball Shoes", "SkyGlide Walking Sneakers", "ProRun Performance Shoes", "HyperPulse Sneakers", 
        "GlideTech Running Shoes", "ZoneLock Trail Runners", "ZenithGrip Tennis Shoes", "FlowVent Hiking Boots", 
        "VelocitySport Sneakers", "StormChaser Running Shoes", "EnduroElite Trail Shoes", "ProStep Athletic Shoes", 
        "DynaSport Training Sneakers", "AeroGlide Running Shoes", "FlexiPulse Walking Shoes", "PowerMax Fitness Sneakers", 
        "ThunderBolt Basketball Shoes", "SkyWalk Walking Sneakers", "UltraFlex Cross-Trainers", "GlideStep Running Shoes", 
        "ZoneGuard Hiking Boots", "Veloce Soccer Cleats", "GlideMax Walking Shoes", "รองเท้าวิ่งพลุ", "รองเท้าฟิตเนสเชิงพาณิชย์", 
        "รองเท้าสไตล์บูทฮิปฮอป", "รองเท้าเดินป่าคุณภาพสูง", "รองเท้าแตะลำลองชิลๆ", "รองเท้าบาสเก็ตบอลสุดเท่", "รองเท้าเทรนเนอร์อเนกประสงค์", 
        "รองเท้าวิ่งระบบล่าสุด", "รองเท้าฟุตบอลชุดเต็ม", "รองเท้าเที่ยวเขาตะเกียบ", "รองเท้าเดินป่าชนิดแม่เหล็ก", "รองเท้าสำหรับผู้หญิงที่เท่และหรูหรา", 
        "รองเท้าออกกำลังกายสไตล์สมัยใหม่", "รองเท้าลุยทุกพื้นที่", "รองเท้าสุดล้ำสำหรับนักเตะ",
    ];
    const auctionType = ["English", "FirstPrice", "SecondPrice", "Dutch"]
    const numberOfProducts = 30;
    // const products = [];

    for (let i = 0; i < numberOfProducts; i++) {
        let randomPrice = randomNumberInRange(150, 500);
        let randomBuyNow = randomNumberInRange(800, 5000);
        let productName = productsNames[i]
        
        if (isThaiInput(productName.toLowerCase())) {
            try {
                // Send an API call to the Node.js server to perform wordcut
                const response = await axios.post('http://localhost:5000/wordcut', { text: productName.toLowerCase(), skipFirstWord: true });
            
                // Extract the searchPartial from the response
                const { searchPartial } = response.data;
                const productsData = 
                    {        
                        sellerEmail: usersEmail[i%2],
                        categoryID: categoryDict["Shoes"],
                        productName: productName,
                        searchName: productName.toLowerCase(),
                        searchPartial: searchPartial,
                        productPhoto: process.env.REACT_APP_ShoesPicURL,
                        productInfo: `Shoes ${i + 1}`,
                        auctionType: auctionType[0],
                        startPrice: randomPrice,
                        currentPrice: randomPrice,
                        buyNowPrice: randomBuyNow,
                        currentBidder: null,
                        isBrought: false,
                        isSend: false,
                        createAt: Timestamp.now(),
                        startTime: add(Timestamp.now().toDate(), { days: 1 }),
                        duration: add(Timestamp.now().toDate(), { days: randomNumberInRange(9, 12) })    
                    };

                // products.push(productsData);
                await addDoc(collection(database, "Products"), productsData);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const nameArray = productName.toLowerCase().split(/[ -,]+/).filter(Boolean);
                const searchPartial = nameArray.slice(1);
                console.log(searchPartial)
                const productsData = 
                    {        
                        sellerEmail: usersEmail[i%2],
                        categoryID: categoryDict["Shoes"],
                        productName: productName,
                        searchName: productName.toLowerCase(),
                        searchPartial: searchPartial,
                        productPhoto: process.env.REACT_APP_ShoesPicURL,
                        productInfo: `Shoes ${i + 1}`,
                        auctionType: auctionType[0],
                        startPrice: randomPrice,
                        currentPrice: randomPrice,
                        buyNowPrice: randomBuyNow,
                        currentBidder: null,
                        isBrought: false,
                        isSend: false,
                        createAt: Timestamp.now(),
                        startTime: add(Timestamp.now().toDate(), { days: 1 }),
                        duration: add(Timestamp.now().toDate(), { days: randomNumberInRange(9, 12) })    
                    };

                // products.push(productsData);
                await addDoc(collection(database, "Products"), productsData);
            } catch (error) {
                console.error(error);
            }
        }

        // const productsData = 
        //     {        
        //         sellerEmail: usersEmail[i%2],
        //         categoryID: categoryDict["Shoes"],
        //         productName: productName,
        //         searchName: productName.toLowerCase(),
        //         searchPartial: searchPartial,
        //         productPhoto: process.env.REACT_APP_ShoesPicURL,
        //         productInfo: `Shoes ${i + 1}`,
        //         auctionType: auctionType[0],
        //         startPrice: randomPrice,
        //         currentPrice: randomPrice,
        //         buyNowPrice: randomBuyNow,
        //         currentBidder: null,
        //         isBrought: false,
        //         isSend: false,
        //         createAt: Timestamp.now(),
        //         startTime: add(Timestamp.now().toDate(), { days: 1 }),
        //         duration: add(Timestamp.now().toDate(), { days: randomNumberInRange(9, 12) })    
        //     };

        // // products.push(productsData);
        // await addDoc(collection(database, "Products"), productsData);
    }


    // productsData.forEach(product => {
    //     // Create a reference to the image in Firebase Storage
    //     const imageRef = ref(storage, `images/${product.productPhoto}`);
        
    //     const reader = new FileReader();

    //     reader.onload = function() {
    //         const data = new Blob([reader.result], { type: 'image/jpeg' });
    //         uploadBytes(imageRef, data, { contentType: 'image/png' }).then((snapshot) => {
    //             console.log('Uploaded a blob or file!');
    //             console.log(snapshot.metadata)
    //             getDownloadURL(ref(storage, `images/${product.productPhoto}`)).then((url) => {
    //                 console.log(url);
    //             });
    //         });
    //     };
    // });

    // const blob = new Blob([imageFile1], {type: 'image/png'})
    // const storageRef = ref(storage, 'images/Nike3.png')
    // uploadBytes(storageRef, blob).then((snapshot) => {
    //     console.log('Uploaded a blob or file!');
    // });
};
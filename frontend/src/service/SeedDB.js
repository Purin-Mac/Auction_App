import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, timestamp } from "./firebase";
import imageFile1 from '../resources/Airjordan.png';

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

export const genProducts = (database) => {
    const categoriesCol = collection(database, "Categories");
    const categoryDict = {
        "Men's clothes": "", 
        "Women's clothes": "", 
        "Shoes": "", 
        "Accessories": ""
    };
    Object.keys(categoryDict).forEach(async (key) => {
        const q = query(categoriesCol, where("categoryName", "==", key));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            // console.log(typeof(doc.id))
            // (function (key) {
                categoryDict[key] = doc.id;
            // })
        });
    });
    const users = []
    const usersCol = collection(database, "Users");
    getDocs(usersCol).then(user => {
        user.forEach((doc) => {
            users.push(doc.id);
        });
    });
    const productsData = [
        {
            sellerID: users[0],
            categoryID: categoryDict["Shoes"],
            productName: "Nike Air Max 270",
            productPhoto: imageFile1,
            productInfo: "",
            startPrice: 1200,
            buyNowPrice: 2000,
            createAt: Timestamp.now(),
            duration: ""           
        }
    ];
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
import React, { useContext, useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from '../service/firebase';
import { toast } from 'react-toastify';
import { AuthContext } from '../service/AuthContext';

function PurchaseListener() {
    const { currentUser, userData } = useContext(AuthContext);
    const [lastPurchaseTimestamp, setLastPurchaseTimestamp] = useState(null);
    const [userLoginTime, setUserLoginTime] = useState(null);

    const showToastMessage = (msg) => {
        toast(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000,
        });
    };

    useEffect(() => {
        if (userLoginTime) {
          setLastPurchaseTimestamp(null);
        }
    }, [userLoginTime]);

    //listening to Items-sub-collection for when there is new product has been brought
    useEffect(() => {
        if (currentUser && userData) {
            const itemsRef = collection(db, "Users", userData.id, "Items");
            const q = query(itemsRef, where("sellerEmail", "==", currentUser.email), orderBy("broughtAt", "desc"));
    
            const unsub = onSnapshot(q, (snapshot) => {
            if (snapshot.docs.length > 0) {
                const latestItem = snapshot.docs[0];
                const latestItemData = latestItem.data();
    
                // Show toast only if the purchase occurred after the user logged in
                if (userLoginTime && userLoginTime < latestItemData.broughtAt && lastPurchaseTimestamp !== latestItemData.broughtAt) {
                    setLastPurchaseTimestamp(latestItemData.broughtAt);
                    showToastMessage(`Someone has bought ${latestItemData.productName}`);
                }
            }
            });
    
            return () => {
            unsub();
            };
        }
    }, [currentUser, userData]);

    //set login time
    useEffect(() => {
        setUserLoginTime(Timestamp.now());
    }, [currentUser]);

    return null;
}

export default PurchaseListener
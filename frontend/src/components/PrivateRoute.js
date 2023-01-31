import { useContext } from "react";
// import firebase from "../service/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
// import User from "../service/User";
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from "../service/firebase";
import { AuthContext } from "../service/AuthContext";

const PrivateRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const showToastMessage = (price) => {
        toast.info("You need to sign in first.", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000
        });
    };
    
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setIsLoggedIn(true);
    //         } else {
    //             setIsLoggedIn(false);
    //             showToastMessage();
    //             navigate("/");
    //           }
    //     });
    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     // const user = User();
    //     // console.log(user)
    //     if (currentUser) {
    //         setIsLoggedIn(true);
    //     } else {
    //         setIsLoggedIn(false);
    //         showToastMessage();
    //         navigate("/");
    //     }
    // }, []);

    // if (isLoggedIn) {
    //     return children;
    // }

    if (currentUser) {
        return children;
    } else {
        showToastMessage();
        navigate("/");
    }
};

export default PrivateRoute;

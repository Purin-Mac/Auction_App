import { useContext, useEffect } from "react";
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

    const showToastMessage = () => {
        toast.info("You need to sign in first.", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            autoClose: 3000
        });
    };

    useEffect(() => {
        if (!currentUser) {
          showToastMessage();
          navigate("/");
        }
    }, [currentUser, navigate]);
    
    return currentUser ? children : null;
};

export default PrivateRoute;

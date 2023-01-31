// import { useContext } from "react";
import Header from "../components/Header";
// import { AuthContext } from "../service/AuthContext";

function Homepage() {
    // const { getData } = useContext(AuthContext)
    return(
        <>
            <Header/>
            <h1>Home Page</h1>
            {/* <button onClick={() => getData()}>Get Data</button> */}
        </>
    );
  }
  
  export default Homepage;
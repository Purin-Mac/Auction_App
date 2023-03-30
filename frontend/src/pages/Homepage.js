// import { useContext } from "react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Banner from "../components/Banner.js";
import MainHome from "../components/MainHome.js";
// import { AuthContext } from "../service/AuthContext";

function Homepage() {
    // const { getData } = useContext(AuthContext)
    return(
        <>
            <Header/>
            {/* <h1>Home Page</h1> */}
            {/* <button onClick={() => getData()}>Get Data</button> */}
            <Banner/>
            <MainHome/>
            <Footer/>
        </>
    );
  }
  
  export default Homepage;
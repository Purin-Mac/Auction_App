// import logo from './logo.svg';
import './App.css';
import Homepage from "./pages/Homepage";
import Category from "./pages/Categorypage"
import Sellpage from "./pages/Sellpage";
import SellItemPage from "./pages/SellItempage";
import Productpage from "./pages/Productpage";
import {Route, Routes} from 'react-router-dom'
import PrivateRoute from "./components/PrivateRoute";
// import socketIO from 'socket.io-client';
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from "./service/AuthContext";
import ProductListpage from "./pages/ProductListpage";
import SearchResultpage from "./pages/SearchResultpage";

// const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <>
      <AuthProvider>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/category" element={<Category/>} />
          <Route path="/category_product" element={<ProductListpage/>} />
          <Route path="/sell" element={<PrivateRoute> <Sellpage/> </PrivateRoute>} />
          <Route path="/sell_item_details" element={<PrivateRoute> <SellItemPage/> </PrivateRoute>} />
          {/* <Route path="/item" element={<PrivateRoute> <Item socket={socket}/> </PrivateRoute>} /> */}
          <Route path="/product" element={<PrivateRoute> <Productpage/> </PrivateRoute>} />
          <Route path="/search" element={<SearchResultpage/>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';
import Homepage from "./pages/Homepage";
import Category from "./pages/Categorypage"
import Sellpage from "./pages/Sellpage";
import Item from "./pages/Item";
import {Route, Routes} from 'react-router-dom'
import PrivateRoute from "./components/PrivateRoute";

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
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/category" element={<Category/>} />
        <Route path="/sell" element={<PrivateRoute> <Sellpage/> </PrivateRoute>} />
        <Route path="/item" element={<Item/>} />
      </Routes>
    </>
  );
}

export default App;

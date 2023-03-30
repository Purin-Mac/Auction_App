import React from 'react'
import Header from "../components/Header";
import Category from '../components/Category';
import Footer from '../components/Footer';

function Sellpage() {
    return (
        <>
            <Header/>
            <main>
            <h1>Plaese Select Category</h1>
            <p>Select your category to sell item !</p>
            </main>
            {/* <h1>Sell Page</h1> */}
            <Category link={"/sell_item_details"}></Category>
            <Footer/>
        </>
    )
}

export default Sellpage
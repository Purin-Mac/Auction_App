import React from 'react'
import Header from "../components/Header";
import Category from '../components/Category';

function Sellpage() {
    return (
        <>
            <Header/>
            <h1>Sell Page</h1>
            <Category link={"/sell_item_details"}></Category>
        </>
    )
}

export default Sellpage
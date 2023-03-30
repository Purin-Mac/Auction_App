import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category';
import Footer from '../components/Footer';

function Categorypage() {
  return (
    <>
        <Header/>
        <main>
        <h1>Plaese Select Category</h1>
        <p>Select your category to browse item !</p>
        </main>
        {/* <h1>Category page</h1> */}
        <Category link={"/category_product"} ></Category>
        <Footer/>
    </>
  )
}

export default Categorypage
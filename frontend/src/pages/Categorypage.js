import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category';
import Footer from '../components/Footer';
import '../style/category.css'


function Categorypage() {
  return (
    <>
        <Header/>
        <main>
        <h1>Plaese Select Category</h1>
        <p>Select your category to browse item !</p>
        </main>
        {/* <h1>Category page</h1> */}
        <Category link={"/category_product"} />
        <Footer/>
    </>
  )
}

export default Categorypage
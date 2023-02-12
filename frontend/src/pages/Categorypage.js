import React from 'react'
import Header from '../components/Header'
import Category from '../components/Category';

function Categorypage() {
  return (
    <>
        <Header/>
        <h1>Category page</h1>
        <Category link={"/category_product"} ></Category>
    </>
  )
}

export default Categorypage
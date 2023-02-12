import React from 'react'
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap'
import ShoesPic from "../resources/Sneaker2.png";
import MenClothPic from "../resources/Men's clothes.png"
import WomenClothPic from "../resources/Women's clothes.png"
import WatchPic from "../resources/Watch.png"

const Category = ( {link} ) => {
  return (
    <>
        <CardGroup style={{ margin: "0 40px", display: "flex", justifyContent: "space-between" }}>
            <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                <Card.Img variant='top' src={ShoesPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                <Link to={link} state={"Shoes"} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                    <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Card.Title>Shoes</Card.Title>
                    </Card.Body>
                </Link>
            </Card>
            <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                <Card.Img variant='top' src={MenClothPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                <Link to={link} state={"Men's clothes"} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                    <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Card.Title>Men's clothes</Card.Title>
                    </Card.Body>
                </Link>
            </Card>
            <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                <Card.Img variant='top' src={WomenClothPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                <Link to={link} state={"Women's clothes"} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                    <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Card.Title>Women's clothes</Card.Title>
                    </Card.Body>
                </Link>
            </Card>
            <Card style={{ margin: "0 10px", border: "1px solid #e5e5e5" }}>
                <Card.Img variant='top' src={WatchPic} style={{ backgroundColor: "#F1F1F1", height: "80%", width: "100%" }}/>
                <Link to={link} state={"Accessories"} style={{ textDecoration: "none", color: "black", height: "20%" }}>
                    <Card.Body style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Card.Title>Accessories</Card.Title>
                    </Card.Body>
                </Link>
            </Card>
        </CardGroup>
    </>
  )
}

export default Category
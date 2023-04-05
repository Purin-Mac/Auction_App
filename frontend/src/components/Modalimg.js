import React from 'react'
import '../style/Modalimg.css'

const Modalimg = ({ selectedImg, setSelectedImg }) => {
    console.log(selectedImg)

    const handleClose = () => {
      setSelectedImg(null);
    };
  
    return (
      <div className="modal" onClick={() => handleClose()}>
        <img src={selectedImg} alt="selectedPic" onClick={(e) => e.stopPropagation()} />
      </div>
    );
};
  

export default Modalimg
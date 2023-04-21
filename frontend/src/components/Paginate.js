import React from "react";
import ReactPaginate from "react-paginate";
import '../style/paginate.css'


const Paginate = ({ currentPage, setCurrentPage, totalPages, setFirstProduct, setLastProduct }) => {
    // const handlePageClick = (event) => {
    //     const selectedPage = event.selected + 1;
    //     // console.log(selectedPage)
    //     setCurrentPage(selectedPage);
    // };

    const handleNextPage = (page) => {
        // console.log(page)
        // console.log(totalPages)
        if (page < totalPages) {
            setCurrentPage(page + 1);
            setFirstProduct(null);
            window.scrollTo(0, 0);
        }
    };
    
    const handlePrevPage = (page) => {
        // console.log(page)
        if (page > 1) {
            setCurrentPage(page - 1);
            setLastProduct(null);
            window.scrollTo(0, 0);
        }
    };
    

    return (
        // <ReactPaginate
        //     breakLabel="..."
        //     nextLabel="next >"
        //     onPageChange={handlePageClick}
        //     pageRangeDisplayed={5}
        //     pageCount={totalPage}
        //     previousLabel="< previous"
        //     renderOnZeroPageCount={null}
        //     containerClassName={"pagination"}
        //     activeClassName={"active-page"}
        // />
        <div className="paginate">
            <button onClick={() => handlePrevPage(currentPage)}>{'<'} Previous </button>
            <h5>{currentPage}/{totalPages}</h5>
            <button onClick={() => handleNextPage(currentPage)}>Next {'>'}</button>
        </div>

    );
};

export default Paginate;

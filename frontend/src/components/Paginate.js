import React from "react";
import ReactPaginate from "react-paginate";

const Paginate = ({ currentPage, setCurrentPage, totalPage }) => {
    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        // console.log(selectedPage)
        setCurrentPage(selectedPage);
    };

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            activeClassName={"active-page"}
        />
    );
};

export default Paginate;

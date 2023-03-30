import React from "react";
import PropTypes from "prop-types";

const ButtonSwitch = ({ activeButton, setActiveButton }) => {
    const handleCurrentClick = () => {
        if (activeButton !== "current") {
            setActiveButton("current");
        }
    };

    const handleHistoryClick = () => {
        if (activeButton !== "history") {
            setActiveButton("history");
        }
    };

    return (
        <div>
            <button
                onClick={handleCurrentClick}
                className={activeButton === "current" ? "active-current" : ""}
            >
                Current
            </button>
            <button
                onClick={handleHistoryClick}
                className={activeButton === "history" ? "active-history" : ""}
            >
                History
            </button>
        </div>
    );
};

export default ButtonSwitch;

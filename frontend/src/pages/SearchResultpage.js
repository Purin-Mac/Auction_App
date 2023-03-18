import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import ProductSearch from "../components/ProductSearch";

const SearchResultpage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("q");

    return (
        <div>
            <Header />
            <h2>Search Results for "{searchTerm}"</h2>
            <ProductSearch searchTerm={searchTerm} />
        </div>
    );
};

export default SearchResultpage;

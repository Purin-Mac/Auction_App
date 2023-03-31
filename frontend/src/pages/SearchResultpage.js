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
            <h1 style= {{ margin: "50px 0 0 5%" }}>Search Results for "{searchTerm}"</h1>
            <ProductSearch searchTerm={searchTerm} />
        </div>
    );
};

export default SearchResultpage;

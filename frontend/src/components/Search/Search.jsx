import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { searchQuery } = useParams();

    function loadItems() {
        axios.get(`http://localhost:8080/db/search/`)
            .then((res) => {
                console.log(res.data);
                let searchResults = res.data.map(item => (
                    <ItemButton
                        key={item.id}
                        itemImage={item.asset_url}
                        itemName={item.name}
                        avgPrice={item.AverageSold}
                        avgSupply={item.Supply}
                        avgDemand={item.Demand}
                    />));
                setSearchResults(searchResults);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        loadItems();
    }, [searchQuery]);

    return (
        <div>
            <h1>Search Results for {searchQuery}</h1>
                <div className="flex justify-center flex-wrap">
                    {searchResults}
                </div>
        </div>
    );
}

export default Search;  
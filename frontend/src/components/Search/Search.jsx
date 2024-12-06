import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import ItemButton from '../Buttons/ItemButton';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const { searchQuery } = useParams();

    function loadItems() {
        axios.get(`http://localhost:8080/db/queryAll/`)
            .then((res) => {
                console.log(res.data);
                let searchResults = res.data.map(item => (
                    <div key={item.id}>
                        <ItemButton
                            itemImage={item.asset_url}
                            itemName={item.name}
                            avgPrice={item.AverageSold}
                            avgSupply={item.Supply}
                            avgDemand={item.Demand}
                        />
                    </div>));
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
            <h1 className="flex justify-center  text-3xl font-semibold text-white py-4">
                Search Results for {searchQuery}
            </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-16">
                    {searchResults}
                </div>
        </div>
    );
}

export default Search;  
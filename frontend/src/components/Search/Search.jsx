import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import ItemButton from '../Buttons/ItemButton';
import Searchbar from '../LandingPage/SearchBar';
import FilterButton from '../Buttons/FilterButton';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [currentArrow, setCurrentArrow] = useState(null);
    const [isUserSearching, setIsUserSearching] = useState(false);
    const { searchQuery } = useParams();

    function loadItems() {
        axios.get(`http://localhost:8080/db/search?search_query=${encodeURIComponent(searchQuery)}`)
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
        <div className='"w-full px-0 mx-0"'>
            <h1 className="flex justify-center  text-3xl font-semibold text-white py-4 mb-4">
                        Search Results for {searchQuery}
            </h1>
            
            <Searchbar isUserSearching={isUserSearching} setisUserSearching={setIsUserSearching} />
            
            <div className="pb-8 flex justify-center space-x-4">
                    <p className="flex justify-center font-semibold text-white py-2">
                        Sort by :
                    </p>  
                    <FilterButton text="Price" isActive={currentArrow === "Price"} onClick={() => setCurrentArrowName("Price")}/>
                    
                    <FilterButton text="Supply" isActive={currentArrow === "Supply"} onClick={() => setCurrentArrowName("Supply")}/>

                    <FilterButton text="Demand" isActive={currentArrow === "Demand"} onClick={() => setCurrentArrowName("Demand")}/>

                    <FilterButton text="Age" isActive={currentArrow === "Age"} onClick={() => setCurrentArrowName("Age")}/>

                    <FilterButton text="Name" isActive={currentArrow === "Name"} onClick={() => setCurrentArrowName("Name")}/>

                    <FilterButton text="Change" isActive={currentArrow === "Change"} onClick={() => setCurrentArrowName("Change")}/>
                    
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-0 mx-0">
                    {searchResults}
                </div>

        </div>
    );
}

export default Search;  
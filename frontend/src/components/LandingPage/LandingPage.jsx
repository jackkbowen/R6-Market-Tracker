import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from '../NavBar/NavBar';
import Searchbar from './SearchBar';
import Search from '../Search/Search'
import FilterButton from '../Buttons/FilterButton';
import SplashPageHero from './SplashPageHero';
import Footer from '../Footer/Footer';

import upArrow from '../../assets/upArrow.png'
import downArrow from '../../assets/downArrow.png'
import ItemButton from '../Buttons/ItemButton';
import DefaultItems from './DefaultItems';


const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentArrow, setCurrentArrow] = useState(null);
    const [isUserSearching, setIsUserSearching] = useState(false);

    function setCurrentArrowName(filterName) {
        setCurrentArrow((prevFilter) => (prevFilter === filterName ? null : filterName));
    };


    return (
        <>
            <div className="">
                {/* Navigation bar - Dont need to add to NavBar, added to Default "/" route in App.jsx
                <NavBar/>
                */}
        

                {/* Landing page welcome text*/}
                <span>
                    <h1 className="flex justify-center  text-3xl font-semibold text-white py-4">
                        Welcome to the Siege Market Analyst
                    </h1>
                    <p className="flex justify-center  text-xl text-white py-2">
                        This is a website that will allow you to track the prices of items in the game Rainbow Six Siege.
                    </p>    
                </span>

                <Searchbar isUserSearching={isUserSearching} setisUserSearching={setIsUserSearching} />

                <div className="pb-8 flex justify-center space-x-4">
                    <p className="flex justify-center text-xl text-white py-2">
                        Sort by:
                    </p>  
                    <FilterButton text="Price" isActive={currentArrow === "Price"} onClick={() => setCurrentArrowName("Price")}/>
                    
                    <FilterButton text="Supply"/>

                    <FilterButton text="Demand"/>

                    <FilterButton text="Age"/>

                    <FilterButton text="Name"/>

                    <FilterButton text="Change"/>
                    
                </div>

                <div>   
                    <DefaultItems/>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default LandingPage;

import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import Searchbar from './SearchBar';
import FilterButton from '../Buttons/FilterButton';

import SplashPageHero from './SplashPageHero';

import upArrow from '../../assets/upArrow.png'
import downArrow from '../../assets/downArrow.png'


const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentArrow, setCurrentArrow] = useState(null);

    function setCurrentArrowName(filterName) {
        setCurrentArrow((prevFilter) => (prevFilter === filterName ? null : filterName));
    };

   

    const repeatedItems = Array.from({ length: 3 }, (_, index) => ({
        id: index,
        itemImage: "https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/59ef9e6e_a473_3a57_b473_cd74fb19cb1e.png",
        itemName: "Black Ice D50",
        avgPrice: 775,
        avgSupply: 346,
        avgDemand: 658
    }));
    

    return (
        <div className="">
            <NavBar/>

            {/* Landing page welcome text*/}
            <span>
                <h1 className="flex justify-center  text-3xl font-semibold text-white py-4">
                    Welcome to the Siege Market Analyst
                </h1>
                <p className="flex justify-center  text-xl text-white py-2">
                    This is a website that will allow you to track the prices of items in the game Rainbow Six Siege.
                </p>    
            </span>

            <Searchbar/>

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

            <SplashPageHero/>


        
        </div>
    );
}

export default LandingPage;

import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import ItemButton from './ItemButton';
import Searchbar from './SearchBar';

const LandingPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="">
            <NavBar/>

            <span>
                <h1 className="flex justify-center  text-3xl font-semibold text-white py-4">Welcome to the Siege Market Analyst</h1>
                <p className="flex justify-center  text-xl text-white py-2">This is a website that will allow you to track the prices of items in the game Rainbow Six Siege.</p>    
            </span>

            <Searchbar/>

            <span>
                <h1 className="flex justify-center  text-3xl font-semibold text-white pt-48 py-8">Trending Items</h1>
            </span>

            <div className="flex justify-center flex-wrap">
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/69fd6436_b10f_7a13_cdea_96d81637c1ee.png" 
                    itemName="Glacier SMG11" 
                />

                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/6c581bda_348c_dc93_ff37_1db4e7dee861.png" 
                    itemName="Glacier MPK5" 
                />
                
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/6c581bda_348c_dc93_ff37_1db4e7dee861.png" 
                    itemName="Glacier MPK5" 
                />
                
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/6c581bda_348c_dc93_ff37_1db4e7dee861.png" 
                    itemName="Glacier MPK5" 
                />
            </div>
                
        </div>
    );
}

export default LandingPage;

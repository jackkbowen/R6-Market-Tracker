import React, { useState } from 'react';
import ItemButton from '../Buttons/ItemButton';
import upArrow from '../../assets/upArrow.png'
import downArrow from '../../assets/downArrow.png'


function SplashPageHero() {
    const [currentArrow, setCurrentArrow] = useState(null);

    function setCurrentArrowName(filterName) {
        setCurrentArrow((prevFilter) => (prevFilter === filterName ? null : filterName));
    };

    const repeatedItems = Array.from({ length: 3 }, (_, index) => ({
        id: index,
        itemImage: "https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/59ef9e6e_a473_3a57_b473_cd74fb19cb1e.png",
        itemName: "FILLER - Black Ice D50",
        avgPrice: 775,
        avgSupply: 346,
        avgDemand: 658
    }));
    

    return (
        <div>   
            <span>
                <h1 className="flex justify-center  text-3xl font-semibold text-white pt-8 py-8">Trending Items</h1>
            </span>

            <div className="flex justify-center flex-wrap">
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/69fd6436_b10f_7a13_cdea_96d81637c1ee.png" 
                    itemName="Glacier SMG11"
                    avgPrice={32000}
                    avgSupply={59}
                    avgDemand={2949}
                />

                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/6c581bda_348c_dc93_ff37_1db4e7dee861.png" 
                    itemName="Glacier MPK5"
                    avgPrice={13499}
                    avgSupply={83}
                    avgDemand={941}
                />
                
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/b4ba3547_77a7_adcc_7cf7_564039670b34.png" 
                    itemName="Pina Colada R4-C"
                    avgPrice={625}
                    avgSupply={1034}
                    avgDemand={1041}
                />
                
                {repeatedItems.map(item => (
                    <ItemButton
                        key={item.id}
                        itemImage={item.itemImage}
                        itemName={item.itemName}
                        avgPrice={item.avgPrice}
                        avgSupply={item.avgSupply}
                        avgDemand={item.avgDemand}
                    />
                ))}
            </div>

            <span>
                <h1 className="flex justify-center  text-3xl font-semibold text-white pt-13 py-8">Top Items by Price</h1>
            </span>

            <div className="flex justify-center flex-wrap">
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/69fd6436_b10f_7a13_cdea_96d81637c1ee.png" 
                    itemName="Glacier SMG11"
                    avgPrice={32000}
                    avgSupply={59}
                    avgDemand={2949}
                />

                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/6c581bda_348c_dc93_ff37_1db4e7dee861.png" 
                    itemName="Glacier MPK5"
                    avgPrice={13499}
                    avgSupply={83}
                    avgDemand={941}
                />
                
                <ItemButton
                    itemImage="https://ubiservices.cdn.ubi.com/0d2ae42d-4c27-4cb7-af6c-2099062302bb/DeployerAssetsJune2023/b4ba3547_77a7_adcc_7cf7_564039670b34.png" 
                    itemName="Pina Colada R4-C"
                    avgPrice={625}
                    avgSupply={1034}
                    avgDemand={1041}
                />
                
                {repeatedItems.map(item => (
                    <ItemButton
                        key={item.id}
                        itemImage={item.itemImage}
                        itemName={item.itemName}
                        avgPrice={item.avgPrice}
                        avgSupply={item.avgSupply}
                        avgDemand={item.avgDemand}
                    />
                ))}
            </div>
        </div>

        



    );
}


export default SplashPageHero;

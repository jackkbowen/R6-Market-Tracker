import React from 'react';
import r6Credit from '../../assets/r6Credit.png'

function ItemButton({ itemImage, itemName }) {
    return (
        <button className="text-white w-full max-w-xs h-60 px-2 bg-GreyHair4 hover:bg-GreyHair4 hover:scale-105 text-lg rounded-md align-top shadow-lg shadow-GreyHair4 ml-8 mb-8">
            <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="flex justify-center items-center h-32">
                    <img src={itemImage} alt={itemName} className="object-cover h-full w-auto" />
                </div>
                
                {/* Item Name */}
                <div className="flex items-center justify-center">
                    <p className="text-xl">{itemName}</p>
                </div>     
                
                {/* Stats Section */}
                <div className="flex flex-col justify-between h-20">
                    <div className="flex justify-between">
                        <p>Avg. price</p>
                        <div className="flex items-center">
                            <img src={r6Credit} alt="R6 Credit" className="w-6 h-6 mr-2"/>
                            <p className="text-center">32</p>   
                        </div> 
                    </div>
                    <div className="flex justify-between">
                        <p>Avg. Supply</p>   
                        <p>32</p>   
                    </div>
                    <div className="flex justify-between">
                        <p>Avg. Demand</p>   
                        <p>32</p>   
                    </div>
                </div>
            </div>
        </button>
    );
}


export default ItemButton;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemButton from '../Buttons/ItemButton';

function DefaultItems() {
    const [trendingButtons, setTrendingButtons] = useState([]);
    const [expensiveButtons, setExpensiveButtons] = useState([]);

    
    // Fetch items using the trendingItems endpoint
    // Returns a list of the 6 items with the highest demand
    function loadTrending() {
        axios.get('http://localhost:8080/db/trendingItems')
            .then((res) => {
                console.log(res.data);
                let trendingItems = res.data.map(item => (
                    <div key={item.id}>
                        <ItemButton
                            itemImage={item.asset_url}
                            itemName={item.name}
                            avgPrice={item.AverageSold}
                            avgSupply={item.Supply}
                            avgDemand={item.Demand}
                        />
                    </div>));
                setTrendingButtons(trendingItems);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Fetch items using the expensiveItems endpoint
    // Returns a list of the 6 items with the highest price
    function loadExpensive() {
        axios.get('http://localhost:8080/db/expensiveItems')
            .then((res) => {
                console.log(res.data);
                let expensiveItems = res.data.map(item => (
                    <div key={item.id}>
                        <ItemButton
                            itemImage={item.asset_url}
                            itemName={item.name}
                            avgPrice={item.AverageSold}
                            avgSupply={item.Supply}
                            avgDemand={item.Demand}
                        />
                    </div>));
                setExpensiveButtons(expensiveItems);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // useEffect elements are called when the page is rendered
    // use it to pass variables to the page
    useEffect(() => {
        loadTrending();
        loadExpensive();
    }, []);

    return (
        <div className="p-4">
            {/* Trending Items Section */}
            <span>
                <h1 className="flex justify-center text-3xl font-semibold text-white pt-8 py-8">
                    Trending Items
                </h1>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingButtons}
            </div>

            {/* Expensive Items Section */}
            <span>
                <h1 className="flex justify-center text-3xl font-semibold text-white pt-13 py-8">
                    Top Items by Price
                </h1>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expensiveButtons}
            </div>
        </div>
    );
}

export default DefaultItems;
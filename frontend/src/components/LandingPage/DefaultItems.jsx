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
                    <ItemButton
                        key={item.id}
                        itemImage={item.asset_url}
                        itemName={item.name}
                        avgPrice={item.AverageSold}
                        avgSupply={item.Supply}
                        avgDemand={item.Demand}
                    />));
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
                    <ItemButton
                        key={item.id}
                        itemImage={item.asset_url}
                        itemName={item.name}
                        avgPrice={item.AverageSold}
                        avgSupply={item.Supply}
                        avgDemand={item.Demand}
                    />));
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
        <div className="">
            <span>
                    <h1 className="flex justify-center  text-3xl font-semibold text-white pt-8 py-8">
                        Trending Items
                    </h1>
                </span>

                <div className="flex justify-center flex-wrap">
                    {trendingButtons}
                </div>

                <span>
                    <h1 className="flex justify-center  text-3xl font-semibold text-white pt-13 py-8">
                        Top Items by Price
                        </h1>
                </span>

                <div className="flex justify-center flex-wrap">
                    {expensiveButtons}
                </div>

        </div>
    );
}

export default DefaultItems;
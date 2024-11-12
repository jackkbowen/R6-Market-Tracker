import React, { useEffect, useState } from 'react';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <form className="flex justify-center flex-grow px-48 py-8">
            <input 
                type="text" 
                placeholder='Search for an item...'
                className="bg-Mossy1 px-4 py-2 rounded-md shadow-md shadow-grey-800 focus:outline-none w-full placeholder-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </form>
    );
}

export default SearchBar;

import React, { useEffect, useState } from 'react';

function SearchBar({ isUserSearching, setisUserSearching }) {
    const [searchQuery, setSearchQuery] = useState('');

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the page from refreshing
        setisUserSearching(true) // Set the user is searching to true
      };

    return (
        <form className="flex justify-center flex-grow px-24 py-8" onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder='Search for an item...'
                className="bg-Mossy1 hover:bg-Mossy1Darker px-4 py-2 rounded-md shadow-md shadow-grey-800 w-full text-white placeholder-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isUserSearching && <p>yes</p>}
            {!isUserSearching && <p>no</p>}
        </form>
        
    );
}

export default SearchBar;

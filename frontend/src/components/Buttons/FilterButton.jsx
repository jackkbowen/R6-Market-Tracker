import React, { useEffect, useState } from 'react';
import upArrow from '../../assets/upArrow.png'
import downArrow from '../../assets/downArrow.png'



function FilterButton({ text, isActive }) {
    const [arrow, setArrow] = useState(null);

    return (
        <button className="bg-Mossy1 hover:bg-Mossy1Darker text-white font-bold py-2 px-4 rounded-full" onClick={() => setArrow(!arrow)}>
            <div className="flex justify-center">
                <h1 className="font-semibold text-white">{ text }</h1>
                {arrow === true && <img src={downArrow} alt="R6 Credit" className="flex justify-center h-6 pl-1" />}
                {arrow === false && <img src={upArrow} alt="R6 Credit" className="flex justify-center h-6 pl-1" />}
            </div>
        </button>
    );
}


export default FilterButton;

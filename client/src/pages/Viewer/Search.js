import React, { useEffect, useState } from 'react';
import { searchTab } from './ViewerFunctions';

export default function Search ({selectedId, setSelectedId}){

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    /* const onInputChange = (ev) => {
        const val = ev.target.value.trim();
        const ids = val.split(',').filter(e => e.length > 0).map(e => parseInt(e)).filter(e => Number.isInteger(e));
        setSelectedId(ids);
    }; */

    const onInputChange = (ev) => {
        const val = ev.target.value.trim();
        console.log('Current val', val);    
        searchTab(val, setSelectedId);
        //const ids = val.split(',').filter(e => e.length > 0).map(e => parseInt(e)).filter(e => Number.isInteger(e));
        //setSelectedId(ids);
    };

    return (
        <div className='Search'>
            <button className={`btnSearch ${isSearchVisible ? 'clicked' : ''}`} onClick={() => setIsSearchVisible(!isSearchVisible)}>
                Search
            </button>
            {isSearchVisible && 
                <div className='Tooltip'>
                    <input className='Input' type="text" onChange={onInputChange} placeholder="Search for component's ID"></input>
                </div>
            }
        </div>
    );
};
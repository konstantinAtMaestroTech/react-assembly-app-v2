import React from 'react';
import { groupSelector } from './ViewerFunctions';

export default function GroupSelector ({setSelectedId}){ // Needs to be fixed to accomodate an arbitary number of groups

    const handleClick = (event) => {
        console.log('Selected group: ', event.target.value);
        groupSelector(event.target.value, setSelectedId);
    }

    return (
        <div className='GroupSelector'>
            <select className='selector' onChange={handleClick} defaultValue="">
                <option value="">All Phases</option>
                <option value="!Wall">Pavilion</option>
                <option value="M_B">Base Structure</option>
                <option value="W_R">Ribs</option>
                <option value="W_P">Petals</option>
            </select>
        </div>
    );
};
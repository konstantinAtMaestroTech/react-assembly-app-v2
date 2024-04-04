import React, { useState, useEffect } from 'react';

export default function ShowDetail ({showDetail, setShowDetail}){

    const onInputChange = (ev) => {
        showDetail ? setShowDetail(false): setShowDetail(true);
    };

    return (
        <div className='ShowDetail'>
            <button 
            className={`ShowDetail ${showDetail ? 'clicked' : ''}`}
            onClick={onInputChange}
            >
                Detail
            </button>
        </div>
    );
};
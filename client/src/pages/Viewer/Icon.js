import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { showIndicator } from './ViewerFunctions';
import HintModal from './Modals/HintModal';

export default function Icon ({showDetail, selectedId}){

    const [buttonStyle, setButtonStyle] = useState({});
    const [centerPoint, setCenterPoint] = useState(new THREE.Vector3(0,0,0));
    const [bboxIsDefined, setBboxIsDefined] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [showHint, setShowHint] = useState(false);

    const hideModal = () => {
        setShowHint(false);
    };

    useEffect(()=> {
        console.log('The effect fires!')
        console.log('Center Point value in useEffect hook: ', centerPoint);
        if (showDetail) {
            showIndicator(selectedId, setCenterPoint, setBboxIsDefined, setButtonText);
        } else {}
    },[selectedId, showDetail]);

    useEffect(()=> {

        console.log(centerPoint);

        setButtonStyle({
            position: 'absolute',
            zIndex: 999,
            left: `${centerPoint.x}px`,
            top: `${centerPoint.y}px`,
        });

        console.log(buttonStyle);   

    },[centerPoint]);

    return (
        showDetail && selectedId && bboxIsDefined ?
        <div 
        className={'Icon'}
        style={buttonStyle}
        >
            <p className={'IconID'}>{buttonText}</p>
            <button className={'IconInfo'} onClick={() => setShowHint(true)}>
                <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z" fill="white"/></svg>
            </button>
            {ReactDOM.createPortal(
                <HintModal show={showHint} handleClose={hideModal} buttonText={buttonText}/>,
                document.body
            )}
        </div>
        : null
    );
};
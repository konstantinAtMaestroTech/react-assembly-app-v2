import React, { useEffect, useState } from 'react';
import './HintModal.css';

const HintModal = ({ handleClose, show, buttonText}) => {

    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const imgSource = `/files/${buttonText}.jpeg`;
    const defaultSource = `/files/default.png`;
    const [fileExists, setFileExists] = useState(false);

    useEffect(() => {
        console.log(imgSource);
        fetch(imgSource)
            .then(response => {
                if (response.ok) {
                    setFileExists(true);
                } else {
                    setFileExists(false);
                }
            })
            .catch(() => setFileExists(false));
    }, [imgSource]);

    return (
    <div className={showHideClassName}>
        <section className="HintModal-main">
        {fileExists ? (
            <img src={imgSource} alt="Default GIF" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
        ) : (
            <img src={defaultSource} alt="Default GIF" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
        )}
        <button className="close-button" onClick={handleClose}>X</button>
        <div className='grayBackground'>
            <button className="downloadInfo" onClick={() => window.open('https://www.maestro-tech.com', '_blank')}>SUPPLIMENTARY DATA</button>
        </div>
        </section>
    </div>
    );
};

export default HintModal;
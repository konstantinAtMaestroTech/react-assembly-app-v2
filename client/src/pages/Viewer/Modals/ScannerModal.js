import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import './ScannerModal.css';
import { qrScanned } from '../ViewerFunctions';

const Modal = ({ handleClose, show, startVideo, setScanSuccess, scanSuccess, setSelectedId }) => {

    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const videoRef = useRef(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        function setResult(result) {
            scannerRef.current.stop();
            const url = new URL(result.data); // Might be useful to use the regular string parsing to add robustness (URL class instantiation is prone to errors)
            const params = new URLSearchParams(url.search);
            const paramValue = params.get('name');
            console.log('param caught: ', paramValue)
            const fetchData = async () => {
                try{
                    console.log(paramValue);
                    qrScanned(paramValue, setSelectedId);
                    setScanSuccess(true);
                    handleClose();
                }catch (error){
                    console.error('Failed to fetch data', error);
                }
            };
            fetchData();
        }
        scannerRef.current = new QrScanner(video, result => setResult(result), {
            highlightScanRegion: true
        });
        if (startVideo) {
            scannerRef.current.start();
        }
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop();
            }
        };
    }, [startVideo, scanSuccess]);
    return (
    <div className={showHideClassName}>
        <section className="modal-main">
        <video ref={videoRef} id="qr-video" style={{width: '100%', height: '70vh'}}></video>
        <button className="close-button" onClick={handleClose}>X</button>
        </section>
    </div>
    );
};

export default Modal;
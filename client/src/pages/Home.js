import React, {useEffect, useRef, useState } from 'react';
import Viewer from './Viewer/Viewer';
import Search from './Viewer/Search';
import ShowDetail from './Viewer/ShowDetail';
import Scanner from './Viewer/Scanner';
import GroupSelector from './Viewer/GroupSelector';
import logo from '../Maestro_logo.svg';

export default function Home (){

    const [selectedId, setSelectedId] = useState([]);
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className='viewer-home'>
            <div className='MaestroHeader'>
                <img src={logo} alt="Maestro Logo" />
                <div className='Titles'>
                    <p className='ProjectTitle1'>Saviola Pavilion</p>
                    <p className='ProjectTitle2'>Salone del Mobile 2024</p>
                </div>
            </div>
            <div className='functions'>
                <Scanner setSelectedId={setSelectedId}></Scanner>  
                <Search selectedId={selectedId} setSelectedId={setSelectedId}></Search>
                <GroupSelector setSelectedId={setSelectedId}></GroupSelector>
                <ShowDetail showDetail={showDetail} setShowDetail={setShowDetail}></ShowDetail>
            </div>
            <div className='viewerHolder'>
                <Viewer
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    showDetail={showDetail}
                ></Viewer>
            </div>
        </div>
    )
};
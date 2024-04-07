import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import launchViewer from './ViewerFunctions';
import { onSelectionChangedTyped } from './ViewerFunctions';
import Icon from './Icon';

export default function Viewer({setSelectedId, selectedId, showDetail}){

  let viewer;

  useEffect(()=> {
      var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bWFlc3Ryby10ZXN0LWJ1Y2tldC90ZXN0LnJ2dA';
      const param = new URLSearchParams(window.location.search);
      console.log('Params on init viewer', param)
      const paramValue = param.get('name');
      console.log('Param on the viewer initialization: ', paramValue);
      viewer = launchViewer('viewerDiv', documentId, setSelectedId, paramValue);
  },[]);

  useEffect(()=> {
      console.log('SelectedId has changed: ', selectedId);
      onSelectionChangedTyped(selectedId);
  },[selectedId]);

  return(
      <div className='viewerDiv' style={{position:'absolute', top: '0', width:'98%'}} id='viewerDiv'>
        <div id="loadingBanner" className="loading-banner">
            <img src="./Maestro_Loading.gif" alt="Loading..." style={{ height: '100%', objectFit: 'contain'}} />
        </div>
        {selectedId.map((id, index) => 
            <Icon
                key={index}
                showDetail={showDetail} 
                selectedId={id}>
            </Icon>
        )}
      </div>
  );
};
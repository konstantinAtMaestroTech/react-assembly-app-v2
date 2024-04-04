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
      <div style={{position:'absolute', width:'95%', height:'75%'}} id='viewerDiv'>
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
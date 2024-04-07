/* global Autodesk, THREE */
import Client from '../Auth';
import * as THREE from 'three';

var getToken = {accessToken: Client.getAccesstoken()};
var viewer;

function launchViewer(div, urn, setSelectedId, paramValue){

    getToken.accessToken.then((token) => {
        var options = {
            'env': 'AutodeskProduction2',
            'accessToken': token.access_token
        };

        Autodesk.Viewing.Initializer(options, function() {

            var htmlDiv = document.getElementById(div);
            viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
            var startedCode = viewer.start();
            viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
                onSelectionChanged(event, setSelectedId);
            });
            if (startedCode > 0) {
                console.error('Failed to create a Viewer: WebGL not supported.');
                return;
            }
            console.log('Initialization complete, loading a model next...');
        });
    
        var documentId = urn;
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    
        function onDocumentLoadSuccess(viewerDocument) {
            var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(viewerDocument, defaultModel, {}).then(async function (model) {
                await afterViewerEvents(
                  viewer,
                  [
                    Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                    Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT
                  ]
                );
                var loadingBanner = document.getElementById('loadingBanner');
                loadingBanner.style.display = 'none';
                if (paramValue) {
                    viewer.search(paramValue, function(dbId) {
                        console.log('dbid in the function: ', dbId)
                        setSelectedId(dbId);
                        viewer.fitToView(dbId);
                    }, function (err) {
                        console.error('No such name');
                    });
                } else {

                }
            });
            const ext = viewer.getLoadedExtensions()
            console.log(Object.keys(ext));
            for (let key in ext) {
                console.log(key);
            }
            return viewer;
        }; // here selection between production and assembly model versions can be performed
    
        function onDocumentLoadFailure() {
            console.error('Failed fetching Forge manifest');
        };
    })
};

function onSelectionChanged(event, setSelectedId){
    var viewer = event.target;
    const dbID = viewer.getSelection();
    //ref.current = dbID;
    setSelectedId(dbID);
};

function afterViewerEvents(viewer, events) {
    let promises = [];
    events.forEach(function (event) {
        promises.push(new Promise(function (resolve, reject) {
            let handler = function () {
                viewer.removeEventListener(event, handler);
                console.log(`Removed event listener for ${event}`)
                resolve();
            }
            viewer.addEventListener(event, handler);
            console.log(`Added event listener for ${event}`)
        }));
    });

    return Promise.all(promises)
}

export function onSelectionChangedTyped(selectedId) {
    if (viewer) {
        let currentlySelected = viewer.getSelection();
        console.log('currentlySelected: ', currentlySelected);
        console.log('selectedId: ', selectedId);
        if (JSON.stringify(selectedId || []) !== JSON.stringify(currentlySelected)) {
            viewer.select(selectedId);
        }
    }
};

export function showIndicator(selectedId, setCenterPoint, setBboxIsDefined, setButtonText) {

    if (viewer && viewer.getSelectionCount() !== 0) {

        if (viewer.model.getInstanceTree()) {
            customize(selectedId);
            showIcon(selectedId);
        } else {
            console.log('getTreeInstance is not Available')
            viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, customize(selectedId));
        } 

        function customize(selectedId){
            const updateIconsCallback = () => {
                showIcon(selectedId);
            };
            viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, updateIconsCallback); // I think there i have to remove them at a certain point
            viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, updateIconsCallback);
            viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, updateIconsCallback);
            viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, updateIconsCallback);
        }

        function showIcon(selectedId) {

            console.log('ShowIcon is initialized!');
            // remove existing label

            // do we have access to the instance tree?
            const tree = viewer.model.getInstanceTree();
            if (tree === undefined) { console.log('Loading tree...'); return;}

            // now collect the fragIds
            const getFrag = (dbId) => {

                //define bboxes in relation 
                
                const fragIdnumber = viewer.model.getData().fragments.fragId2dbId.length;
                const bboxes = viewer.model.getData().fragments.boxes;
                const coordPerfragId = 6;

                const bboxArray = [];

                for (let i = 0; i < fragIdnumber; i++) {
                    const startIndex = i * coordPerfragId;
                    const endIndex = startIndex + coordPerfragId;
                    const boundingBoxCoordinates = bboxes.slice(startIndex, endIndex);
                    bboxArray.push(boundingBoxCoordinates);
                };

                //const bboxesA = []

                let fragId = viewer.model.getData().fragments.fragId2dbId.indexOf(dbId);
                console.log('dbId is: ', dbId);
                console.log('FragID is: ', fragId);
                const bbox = bboxArray[fragId];
                //bboxesA.push(bbox);
                
                updateIcons(bbox); // re-position for each fragId found
            }

            getFrag(selectedId);

        };

        function getMiddlePoint (boundingBox) { //couldn't find the reference in Viewer API
            
            const middleX = (boundingBox[0] + boundingBox[3]) / 2;
            const middleY = (boundingBox[1] + boundingBox[4]) / 2;
            const middleZ = (boundingBox[2] + boundingBox[5]) / 2;

            const middlePoint = [middleX, middleY, middleZ];
            console.log('Middle point coordinate',middlePoint);
            const vector = new THREE.Vector3().set(middlePoint[0], middlePoint[1], middlePoint[2]);

            return vector
        }

        function updateIcons(bbox){

            //let bboxIsDefined = [];
            //let centerPoints = [];
           
            if (bbox) {
                setBboxIsDefined(true);
                console.log('Bbox was successfully defined');
                const pos = viewer.worldToClient(getMiddlePoint(bbox));
                setCenterPoint(pos);
                async function fetchButtonText() {
                    try {
                      if (selectedId) {
                          console.log('SelectedIds inside of the Icon.js', selectedId);
                        const result = await dbIDtoName(selectedId);
                        setButtonText(result);
                      }
                    } catch (error) {
                      console.error('Error fetching button text:', error);
                    }
                  }
                  fetchButtonText();
                // let's try to remove the eventListeners here
                viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT);
                viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT);
                viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT);
                viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT);
            } else {
                setBboxIsDefined(false);
                console.log('Bbox was not defined');
                setCenterPoint(new THREE.Vector3(0,0,0));
            }
            
        }
    }
};

export function qrScanned(paramValue, setSelectedId) { // One selection function with decorated versions
    if (viewer) {
        viewer.search(paramValue, function(dbId) {
            setSelectedId(dbId);
            viewer.fitToView(dbId);
        }, function (err) {
            console.error('Error occured during search: ', err);
        });
    }
};

export function groupSelector(paramValue, setSelectedId) { // One selection function with decorated versions
    if (viewer) {
        if (paramValue === '') {
            viewer.search(paramValue, function(dbId) {
                setSelectedId(dbId);
                viewer.showAll();
                viewer.fitToView();
            }, function (err) {
                console.error('Error occured during search: ', err);
            });
        } else if (paramValue.includes('!')) { // The behaviour is not uniform across the options (some select the elements others no)
            paramValue = paramValue.replace('!', '');
            viewer.search(paramValue, function(dbId) {
                setSelectedId([]);
                viewer.showAll();
                viewer.hide(dbId);
                viewer.fitToView();
            }, function (err) {
                console.error('Error occured during search: ', err);
            });
        } else {
            viewer.search(paramValue, function(dbId) {
                viewer.showAll();
                viewer.select(dbId);
                viewer.isolate(dbId);
                viewer.fitToView(dbId);
            }, function (err) {
                console.error('Error occured during search: ', err);
            });
        }
    }
};

export function dbIDtoName(dbID) {
    return new Promise((resolve, reject) => {
      if (viewer) {
        let dbIdA = [];
        dbIdA.push(dbID);
        console.log('dbID from the function', dbID);
        let opts = {}
        viewer.model.getBulkProperties(dbIdA, opts, function(data) {
          let name = data[0].name.split(" ")[0];
          console.log('Data from the function', data);
          console.log('Names from the function', name);
          resolve(name);
        }, function (err) {
          console.error('Error occured during search: ', err);
          reject(err);
        });
      } else {
        reject('Viewer is not defined');
      }
    });
}

export function searchTab(query, setSelectedId) { // One selection function with decorated versions
    if (viewer) {
        viewer.search(query, function(dbId) {
            viewer.select(dbId)
            setSelectedId(dbId);
            viewer.fitToView(dbId);
        }, function (err) {
            console.error('Error occured during search: ', err);
        });
    }
};

export default launchViewer;
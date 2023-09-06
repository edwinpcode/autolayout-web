import React from 'react'
import { useState, useEffect } from 'react'
import { setElement } from '../../Store/Flowchart/elementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// edit node or edge on flowchart
// not used currently
const Properties = ({code}) => {
  const elementState = useSelector(state => state.element);
  const nodeState = useSelector(state => state.node);
  const edgeState = useSelector(state => state.edge);

  const [type, setType] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [showProperties, setShowProperties] = useState(true);
  
  const [markerStartType, setMarkerStartType] = useState('');
  const [markerOrient, setMarkerOrient] = useState('');
  const [markerEndType, setMarkerEndType] = useState('');
  // const [animated, setAnimated] = useState(false);

  // const [itemData, setItemData] = useState();

  const dispatch = useDispatch();

  // const { register, reset, getValues} = useForm();
  
  // useEffect(() => {
  //   if(code === "node")
  //     setElement({type, data: { label, description }, code});
  //   else if(code === 'edge'){
  //     setElement({type, label, markerStart: { type: markerStartType, orient: markerStartOrient}, markerEnd: { type: markerEndType, orient: markerEndOrient}});
  //   }
  // }, [type, label, description]);


  useEffect(() => {
      setLabel(nodeState.data && nodeState.data.label ? nodeState.data.label : '');
      setDescription(nodeState.data && nodeState.data.description? nodeState.data.description : '');
      setType(nodeState.type);
}, [nodeState]);

useEffect(() => {
  setLabel(edgeState.label ? edgeState.label : '');
  setType(edgeState.type? edgeState.type : '');
  setMarkerStartType(edgeState.markerStart && edgeState.markerStart.type ? edgeState.markerStart.type : '');
  setMarkerEndType(edgeState.markerEnd && edgeState.markerEnd.type ? edgeState.markerEnd.type : '');
  setMarkerOrient(edgeState.markerEnd && edgeState.markerEnd.orient ? edgeState.markerEnd.orient : '');
}, [edgeState]);

  const onClickSave = () => {
    if(code === "node")
    dispatch(
      setElement({type, label, description })
    )
    else if(code === 'edge'){
      dispatch(
        setElement({
          type, label, 
          markerStart: { 
            type: markerStartType, 
            orient: markerOrient
          }, 
          markerEnd: { 
            type: markerEndType, 
            orient: markerOrient
          }
        })  
      )
    }
    window.$('#editProperties').modal('hide');
  }

  return (
    <div
    style={{ width: showProperties ? '200px' : '50px' }}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <div className="font-weight-bold" style={{ display: showProperties ? 'block' : 'none' }}>Elemen</div>
      {showProperties ? (
          <button
            type="button"
            onClick={() => setShowProperties(false)}
            className="btn btn-sm btn-secondary"
          >
            -
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowProperties(true)}
            className="btn btn-sm btn-secondary"
          >
            +
          </button>
        )}
      </div>
      <div style={{ visibility: showProperties ? 'visible' : 'hidden' }}>
        <div className='form-group'>
          <label className='font-weight-bold'>Label</label>
          <input className='form-control' 
          type="text" value={label} onChange={e => setLabel(e.target.value)} maxLength={16}/>
        </div>
        {code === "node" ? (
        <div>
        <div className='form-group'>
          <label className='font-weight-bold'>Description</label>
          <input className='form-control' type="text" value={description} onChange={e => setDescription(e.target.value)}/>
        </div>
        <div>
          <label className='font-weight-bold'>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="custom-select" >
            <option value="startEvent">Start</option>
            <option value="businessProcess" >Business Proses</option>
            <option value="gateway">Gateway</option>
            <option value="endEvent">End</option>
          </select>
        </div>
        </div>
        )  : null}
        {code === "edge" ? (
        <div>
          <div>
            <label>Marker Type</label>
            <select className='custom-select' value={type} onChange={e => setType(e.target.value)}>
              <option value="default" key="default">Default</option>
              <option value="straight" key="straight">Straight</option>
              <option value="step" key="step">Step</option>
              <option value="smoothstep" key="smoothstep">Smoothstep</option>
            </select>
          </div>
          <div>
            <label>Marker Start</label>
            <select className='custom-select' value={markerStartType} onChange={e => setMarkerStartType(e.target.value)}>
              <option value="default" key="default">None</option>
              <option value="arrow" key="arrow">Arrow</option>
              <option value="arrowclosed" key="arrowclosed">Arrow Closed</option>
            </select>
          </div>
          <div>
            <label >Marker End</label>
            <select className='custom-select' value={markerEndType} onChange={e => setMarkerEndType(e.target.value)}>
              <option value="default" key="default">None</option>
              <option value="arrow" key="arrow">Arrow</option>
              <option value="arrowclosed" key="arrowclosed">Arrow Closed</option>
            </select>
          </div>
          <div>
            <label>Orient</label>
            <select className='custom-select' value={markerOrient} onChange={e => setMarkerOrient(e.target.value)}>
              <option value="default" key="default">None</option>
              <option value="auto-start-reverse" key="auto-start-reverse">Reverse</option>
              <option value="auto" key="auto">Normal</option>
            </select>
          </div>
        </div> 
        ) : null}
        <div>
          <button onClick={onClickSave} className='btn btn-sm btn-success'>Update</button> 
        </div>
      </div>  
    </div>
  )
}

export default Properties;

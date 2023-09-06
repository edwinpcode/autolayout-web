import axios from "axios";
import APIClient from './APIClient';
import APILocal from './APILocal';

const env = 'PRODUCTION';

// Get ALL flowchart 
export const getFlowchart = async () => {
    const payload = {}
    const result = 
        process.env.REACT_APP_ENV === env
        ? APIClient.post('/retrieveDataBP', JSON.stringify(payload))
        : await axios({
            method: "GET",
            url: '//localhost:5000/flowchart',
        })
    return result
}


// get 1 flowchart
export const getFlowchartDetail = async (data) => {
    const payload = {
        flowchart_id: data.id
    }
    const result = 
        process.env.REACT_APP_ENV === env
        ? APIClient.post('/getFlowchartByID', JSON.stringify(payload))
        : await axios({
            method: "GET",
            url: '//localhost:5000/flowchart/' + data.id,
        })
    return result
}

// insert flowchart
export const postFlowchart = async (payload) => {
    const result = 
        process.env.REACT_APP_ENV === env
        ? APIClient.post('/saveflowchartnew', JSON.stringify(payload))
        // save local need setting
        : await axios({
            method: "POST",
            url: '//localhost:5000/flowchart',
            data: payload
        })
    return result;
}

// update flowchart
export const updateFlowchart = async (payload) => {
    const result = 
        process.env.REACT_APP_ENV === env
        ? APIClient.post('/updateflowchart', JSON.stringify(payload)) 
        : await axios({
           method: "PUT",
            url: '//localhost:5000/flowchart/' + payload.id,
            data: payload
        })
    return result;
}

// delete flowchart
export const deleteFlowchart = async (payload) => {
    const result = 
    process.env.REACT_APP_ENV === env
        ? APIClient.post('/deleteFlowchart', JSON.stringify(payload))
        : await axios({
            method: "PUT",
            url: '//localhost:5000/flowchart',
        })
    return result;
}

export const getFlowchartModal = async ({ code }) => {
    const payload = {
        "referenceName": "getProperty",
        "param": [
            {
                code
            }
        ]
    }
    const result = 
    process.env.REACT_APP_ENV === env
        ? APIClient.post('/getPropertyFlowchart', JSON.stringify(payload))
        : code === 'node' 
            ? APILocal.get("/flowchartModalNode")
            : APILocal.get("/flowchartModalEdge")
    return result;  
}

export const getFlowchartToolbox = async () => {
    const payload = {};
    const result = 
        process.env.REACT_APP_ENV === env
        ? APIClient.post('/getToolboxFC', JSON.stringify(payload))
        : APILocal.get("/flowchartToolbox")
    return result;
}

export const getNodeDropdown = async () => {
    const payload = {}
    const result =
    process.env.REACT_APP_ENV === env
        ? APIClient.post('/getNodeDropdownFC', JSON.stringify(payload))
        : APILocal.get("/nodeDropdown")
    return result;
}


export const getEdgeDropdown = async () => {
    const payload = {}
    const result =
    process.env.REACT_APP_ENV === env
        ? APIClient.post('/getEdgeDropdownFC', JSON.stringify(payload))
        : APILocal.get("/edgeDropdown")
    return result;
}

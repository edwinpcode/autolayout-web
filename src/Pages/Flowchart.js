import React, { useCallback, useEffect, useRef, useState, useMemo } from "react"
import "reactflow/dist/style.css"
import { useDispatch, useSelector } from "react-redux"

import { setNode } from "../Store/Flowchart/nodeSlice"
import { setEdge } from "../Store/Flowchart/edgeSlice"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"

import Toolbox from "../Components/Flowchart/Toolbox"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  updateEdge,
  getConnectedEdges,
} from "reactflow"
import BusinessProcessNode from "../Components/Flowchart/Node/BusinessProcessNode"
import GatewayNode from "../Components/Flowchart/Node/GatewayNode"
import StartEventNode from "../Components/Flowchart/Node/StartEventNode"
import EndEventNode from "../Components/Flowchart/Node/EndEventNode"
import {
  getFlowchartDetail,
  postFlowchart,
  updateFlowchart,
} from "../Services/FLowchartService"
import Modal from "../Components/Flowchart/Modal"
import ContextMenu from "../Components/Flowchart/ContextMenu"
import CustomEdge from "../Components/Flowchart/Node/CustomEdge"

// set default edge type
const edgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: "arrowclosed",
    orient: "auto",
  },
}

// set node color for minimap
const nodeColor = (node) => {
  switch (node.type) {
    case "startEvent":
      return "blue"
    case "businessProcess":
      return "lightblue"
    case "gateway":
      return "orange"
    case "endEvent":
      return "green"
    default:
      return "black"
  }
}

// keyboar bind for delete element
const deleteKeyCode = ["Backspace", "Delete"]

const Flow = ({ fieldItem, getValues, watch, panelId }) => {
  // id from url for edit mode
  // let { id } = useParams();

  // check id for edit mode if this flowchart used as compoment
  // const [id, setId] = useState()

  const [idParent, setIdParent] = useState("")
  const [parent, setParent] = useState("")

  useEffect(() => {
    if (fieldItem.reference?.parent?.length) {
      const idParent = getValues(fieldItem.reference.parent[0])
      setParent(fieldItem.reference.parent[0])
      if (idParent) {
        setIdParent(idParent)
      }
    }
  }, [fieldItem])

  // set custom node type
  const nodeTypes = useMemo(
    () => ({
      startEvent: StartEventNode,
      businessProcess: BusinessProcessNode,
      gateway: GatewayNode,
      endEvent: EndEventNode,
    }),
    [],
  )

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const nodeState = useSelector((state) => state.node)
  const elementState = useSelector((state) => state.element)

  const [showMinimap, setShowMinimap] = useState(true)
  const [name, setName] = useState("")
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [code, setCode] = useState("node")

  const edgeUpdateSuccessful = useRef(true)

  const reactFlowInstance = useReactFlow()

  const [inputMode, setInputMode] = useState("")

  const [contextOpen, setContextOpen] = useState(false)
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 })

  const [buttonModal, setButtonModal] = useState(false)

  // set edge on connect to node
  const onConnect = useCallback(
    (connection) => {
      let count = 0
      let foundEdge = false

      for (let i = 0; i < edges.length; i++) {
        // if(connection.source === edges[i].source && connection.sourceHandle === edges[i].sourceHandle)
        //   count++;
        if (
          connection.source === edges[i].source &&
          connection.target === edges[i].target
        )
          foundEdge = true
      }
      // if(count < 2 ){
      //   setEdges((eds) => addEdge(connection, eds));
      // }else {
      //   window.Swal.fire('Garis Output Maksimal 2')
      // }
      // console.log(connection.type)
      if (!foundEdge) {
        setEdges((eds) => addEdge(connection, eds))
      }
    },
    [edges, setEdges],
  )

  // right click menu on diagram
  const onOpenContextMenu = (e, element) => {
    e.preventDefault()
    setContextOpen(true)
    setNodes((nds) =>
      nds.map((n, index) => {
        if (n.id === element.id) n.selected = true
        else n.selected = false
        return n
      }),
    )
    dispatch(setNode({ ...element }))
    setContextPosition({ x: e.clientX, y: e.clientY })
  }

  // close right click menu
  const OnCloseContextMenu = () => {
    setContextOpen(false)
  }

  // useEffect(() => {
  //   console.log(flowchart)
  // }, [flowchart])

  // set id flowchart data on render
  // useEffect(() => {
  //   flowchart?.reference?.parent?.forEach((parentId) => {
  //     const parentValue = window.$('#' + parentId).val()
  //     setId(parentValue)
  //   })
  //   window.addEventListener('click', OnCloseContextMenu)
  //   return () => window.removeEventListener('click', OnCloseContextMenu)
  // }, [])

  // set input mode base on flowchart_id
  useEffect(() => {
    // set Mode - insert Mode or edit Mode
    if (idParent && idParent == "") {
      // set to create / insert mode
      setInputMode("insert")
    } else if (idParent !== "") {
      // set to edit mode
      setInputMode("edit")
      const payload = {
        flowchart_id: idParent,
      }
      getFlowchartDetail(payload)
        .then((res) => {
          // if (res.data.status != "1") {
          //   return window.Swal.fire("Kesalahan", res.data.message, "error")
          // }
          if (res.data.name) {
            setName(res.data.name)
          }
          if (res.data.node) {
            setNodes(res.data.node)
          }
          if (res.data.edge) {
            setEdges(res.data.edge)
          }
        })
        .catch((e) =>
          window.Swal.fire("Kesalahan", `Silahkan muat ulang halaman`, "error"),
        )
    }
  }, [idParent])

  const refresh = () => {
    const payload = {
      flowchart_id: idParent,
    }
    getFlowchartDetail(payload)
      .then((res) => {
        // if (res.data.status != "1") {
        //   return window.Swal.fire("Kesalahan", res.data.message, "error")
        // }
        if (res.data.name) {
          setName(res.data.name)
        }
        if (res.data.node) {
          setNodes(res.data.node)
        }
        if (res.data.edge) {
          setEdges(res.data.edge)
        }
      })
      .catch((e) =>
        window.Swal.fire("Kesalahan", `Silahkan muat ulang halaman`, "error"),
      )
  }

  // Delete Element : node / edge
  const handleDelete = (e) => {
    e.preventDefault()
    const edgesToRemove = getConnectedEdges([nodeState], edges)
    reactFlowInstance.deleteElements({ nodes: [nodeState], edgesToRemove })
    setEdges((edges) => edges.filter((edge) => !edge.selected))
  }

  // Save FLowchart Data (with node and edge)
  const onSave = (e) => {
    // console.log(nodes, edges)
    e.preventDefault()
    // set start / end event node empty data
    setNodes((nds) =>
      nds.map((node, indexI) => {
        if (node.type === "startEvent" || node.type === "endEvent") {
          node.data = {
            ...node.data,
            // trackCode: "",
            sideMenu: "",
            preAction: "",
            postAction: "",
          }
        } else {
          node.data = {
            ...node.data,
            sideMenu: "",
            preAction: "",
            postAction: "",
          }
        }
        return node
      }),
    )

    // setEdges(edges =>
    //   edges.map((edge, index) => {
    //     edge.markerStart = {};
    //     edge.markerEnd = { type: 'arrowclosed' };
    //     return edge;
    //   })
    // )

    // validation
    if (nodes.length === 0) {
      window.Swal.fire("Kesalahan", `flowchart tidak boleh kosong`, "warning")
      return
    }
    let foundStart, foundEnd, foundbusinesProccess
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === "startEvent") {
        foundStart = true
      }
      if (nodes[i].type === "endEvent") {
        foundEnd = true
      }
      if (nodes[i].type === "businessProcess") {
        foundbusinesProccess = true
      }
      if (!nodes[i].data.label) {
        window.Swal.fire(
          "Kesalahan",
          `label node '${nodes[i].data.label}' tidak benar, silahkan ubah`,
          "warning",
        )
        return
      }
      // if (nodes[i].type !== "startEvent" && nodes[i].type !== "endEvent") {
      //   if (!nodes[i].data.trackCode) {
      //     window.Swal.fire(
      //       "Kesalahan",
      //       `data node '${nodes[i].data.label}' perlu Track Code, silahkan ubah`,
      //       "warning",
      //     )
      //     return
      //   }
      // }
    }
    if (!name) {
      window.Swal.fire("Kesalahan", `Silahkan isi nama flowchart`, "warning")
      return
    }
    if (inputMode === "insert") {
      // insert Mode
      const data = {
        name,
        description: "",
        node: nodes,
        edge: edges,
      }
      postFlowchart(data)
        .then((res) => {
          if (res.data.status === "0") {
            window.Swal.fire("Gagal", "Terjadi Kesalahan, Coba Lagi", "error")
          } else {
            window.Swal.fire(
              "Berhasil",
              "Flowchart berhasil disimpan",
              "success",
            )
            // for redirect to other page
            navigate("/")
          }
        })
        .catch((e) => {
          window.Swal.fire("Gagal", "Terjadi Kesalahan", "error")
        })
    } else {
      // Edit Mode
      const data = {
        flowchart_id: idParent,
        name,
        description: "",
        node: nodes,
        edge: edges,
      }
      updateFlowchart(data)
        .then((res) => {
          if (res.data.status === "0") {
            // console.log(res)
            window.Swal.fire("Gagal", "Terjadi Kesalahan, Coba Lagi", "error")
          } else {
            window.Swal.fire(
              "Berhasil",
              "Flowchart berhasil diperbarui",
              "success",
            )
          }
        })
        .catch((e) => {
          window.Swal.fire("Gagal", "Terjadi Kesalahan", "error")
        })
    }
  }

  // Update Edge onDrag
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false
  }, [])

  // Update Edage OnDrag
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true
    setEdges((els) => updateEdge(oldEdge, newConnection, els))
  }, [])

  // Update Edge onDrag
  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    }
    edgeUpdateSuccessful.current = true
  }, [])

  // New Node onDrag
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // get id for new node
  const getId = () => {
    return `node_${Math.floor(Math.random() * 10000)}`
  }

  // New Node onDrag
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      // check if already created for some node type
      for (let i = 0; i < nodes.length; i++) {
        if (type === nodes[i].type && type === "startEvent") {
          window.Swal.fire("Kesalahan", " Node Sudah ada", "warning")
          return
        } else if (type === nodes[i].type && type === "endEvent") {
          window.Swal.fire("Kesalahan", "Node Sudah ada", "warning")
          return
        }
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // generate and check id for new node
      let id = getId()
      let i = 0
      while (i < nodes.length) {
        if (id === nodes[i].id) {
          id = getId()
          i = 0
          continue
        } else i++
      }
      // set label per type
      let label = "Umum"
      if (type === "startEvent") label = "Mulai"
      else if (type === "endEvent") label = "Selesai"
      else if (type === "businessProcess") label = "Proses"
      else if (type === "gateway") label = "Kondisi"

      const newNode = {
        id: id,
        type,
        position,
        data: {
          label: label,
          trackCode: "",
          sideMenu: "",
          preAction: "",
          postAction: "",
        },
      }
      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, reactFlowInstance],
  )

  // Select Node and update element state
  const onSelectNode = (e, node) => {
    setButtonModal(true)
    setCode("node")
    dispatch(setNode({ ...node }))
  }

  // Select Edge and update element state
  const onSelectEdge = (e, edge) => {
    setCode("edge")
    dispatch(setEdge({ ...edge }))
    setButtonModal(true)
  }

  // Update Node or Edge from modal using elementState
  useEffect(() => {
    // check if found same track code (tc) on other node
    if (code === "node") {
      let tc = true
      // for (let i = 0; i < nodes.length; i++) {
      //   if (nodes[i].type !== "startEvent" && nodes[i].type !== "endEvent") {
      //     console.log(nodes[i], nodeState.id, elementState.data.trackCode)
      //     if (
      //       elementState.data.trackCode === nodes[i].data.trackCode &&
      //       nodeState.id !== nodes[i].id
      //     ) {
      //       tc = false
      //       break
      //     }
      //   }
      // }
      if (tc) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.selected) {
              node.data = elementState.data
              // node.type = elementState.type
            }
            return node
          }),
        )
      } else {
        window.Swal.fire("Kesalahan", "Track Code Sudah ada", "warning")
      }
    } else {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.selected) {
            edge.label = elementState.label
            edge.type = elementState.type
            edge.animated = elementState.animated === "True" ? true : false
            if (
              elementState.markerOrient !== "auto" &&
              elementState.markerStart !== "none"
            ) {
              edge.markerStart = {
                type: elementState.markerStart,
                orient: elementState.markerOrient,
              }
            } else {
              delete edge.markerStart
            }
            if (
              elementState.markerOrient === "auto" &&
              elementState.markerEnd !== "none"
            ) {
              edge.markerEnd = {
                orient: elementState.markerOrient,
                type: elementState.markerEnd,
              }
            } else {
              delete edge.markerEnd
            }
          }
          return edge
        }),
      )
    }
  }, [elementState, setNodes, setEdges])

  // disable right click default menu on react flow
  const disableContextMenu = (e) => {
    e.preventDefault()
    setButtonModal(false)
  }

  // show modal from context menu
  const toggleModal = (e, node) => {
    window.$("#editElement").modal("show")
  }

  const edgeTypes = {
    custom: CustomEdge,
  }

  return (
    <div className="vh-100 bg-white rounded-lg ">
      <div className="d-flex my-1 justify-content-between">
        <div className="d-flex">
          <div className="form-group mx-1">
            <label>
              Nama
              <span className="text-danger font-weight-bold"> *</span>
            </label>
            <input
              className="form-control"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="custom-control custom-switch mx-1 align-self-center">
            <input
              id="toggleMinimap"
              className="custom-control-input"
              checked={showMinimap}
              onChange={(e) => setShowMinimap(e.target.checked)}
              type="checkbox"
            />
            <label htmlFor="toggleMinimap" className="custom-control-label">
              Minimap
            </label>
          </div>
          {/* <button
            type="button"
            className="btn btn-success btn-sm align-items-end"
          >
            Refresh
          </button> */}
        </div>
      </div>
      <ContextMenu
        onDeleteClick={handleDelete}
        contextOpen={contextOpen}
        position={contextPosition}
        onClose={OnCloseContextMenu}
      />
      <div
        className="d-flex"
        style={{
          height: "60%",
        }}
      >
        <Toolbox />
        <div ref={reactFlowWrapper} className="h-auto w-100">
          <ReactFlow
            className="border rounded-sm"
            fitView
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={edgeOptions}
            deleteKeyCode={deleteKeyCode}
            onContextMenu={disableContextMenu}
            onPaneClick={disableContextMenu}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onSelectNode}
            onNodeDrag={onSelectNode}
            onNodeContextMenu={onOpenContextMenu}
            onNodeDoubleClick={toggleModal}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onEdgeClick={onSelectEdge}
            onEdgeContextMenu={disableContextMenu}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onEdgeDoubleClick={toggleModal}
            edgeTypes={edgeTypes}
          >
            {showMinimap ? (
              <MiniMap
                position="top-right"
                className="border rounded-sm"
                nodeColor={nodeColor}
                nodeBorderRadius={2}
              />
            ) : null}
            <Background />
            <Controls position="top-left" />
          </ReactFlow>
          {/* <Properties code={code}/> */}
        </div>
      </div>
      <div className="d-flex justify-content-between my-2">
        <Modal
          code={code}
          fieldItem={fieldItem}
          idParent={idParent}
          parent={parent}
          panelId={panelId}
        />
        {buttonModal ? (
          <div
            className="d-flex align-items-center"
            style={{ display: buttonModal ? "block" : "none" }}
          >
            <div className="mx-1 px-1">Node Menu</div>
            {/* <ButtonModal
              label="Ubah"
              dataTarget="editElement"
              className="btn btn-secondary btn-xs"
              disabled={!buttonModal}
            /> */}
            <button
              className="btn btn-sm btn-secondary"
              data-target="#editElement"
              data-toggle="modal"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Ubah
            </button>
            <button
              className="btn btn-sm btn-danger"
              disabled={!buttonModal}
              onClick={handleDelete}
            >
              Hapus
            </button>
          </div>
        ) : (
          <div></div>
        )}
        <button
          type="submit"
          className="btn btn-sm btn-danger"
          onClick={onSave}
        >
          SIMPAN
        </button>
      </div>
    </div>
  )
}

// Wrapper
const Flowchart = ({ fieldItem, getValues, watch, parent, child, panel }) => {
  const findPanelId = (fieldId) => {
    let panelId = ""
    panel.forEach((panelItem) => {
      panelItem.listField.forEach((fieldItem) => {
        if (fieldItem.id === fieldId) {
          panelId = panelItem.panelId
        }
      })
    })
    return panelId
  }
  const panelId = findPanelId(fieldItem.id)

  return (
    <ReactFlowProvider>
      <Flow
        fieldItem={fieldItem}
        getValues={getValues}
        watch={watch}
        panelId={panelId}
      />
    </ReactFlowProvider>
  )
}

export default Flowchart

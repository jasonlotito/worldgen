import AppHeader from "./appHeader";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

const nav = [
  { to: "new", e: <NewDb/> },
  { to: "sets", e: <Sets/> }
]


function GenInput({
                    name, type = "text", value = "", handler = () => {
  }, disable = false
                  }) {
  return (
    <div className="genInput">
      <label>
        {name}
        <input type={type} value={value} onChange={e => handler(e.target.value)}
               disabled={disable}/>
      </label>
    </div>
  )
}

function GenSelect({ name, handler, options, value }) {
  return (
    <select onChange={e => handler(e.target.value)} value={value} style={{ padding: "5px 10px" }}>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
  )
}

function ColorEditor({ id, color, updateHandler, isNew=false }) {
  const [newColor, setNewColor] = useState(isNew ? "" : color)

  return (
    <>
      {!isNew && <GenInput name="id" value={isNew ? "" : id} disable={true}/>}
      <GenInput name="color" value={newColor} handler={setNewColor}/>
      <button onClick={() => {
        const data = isNew ? {color:newColor} : {id, color:newColor}
        updateHandler({id,color:newColor})
      }}>Update</button>
    </>
  )
}
function SpeciesEditor({ id, speciesName, updateHandler, isNew=false }) {
  const [name, setName] = useState(isNew ? "" : speciesName)

  return (
    <>
      {!isNew && <GenInput name="id" value={isNew ? "" : id} disable={true}/>}
      <GenInput name="name" value={name} handler={setName}/>
      <button onClick={() => {
        updateHandler({id,name})
      }}>Update</button>
    </>
  )
}

const Editors = {
  "haircolor": ColorEditor,
  "eyecolor": ColorEditor,
  "species": SpeciesEditor,
}

function Sets() {
  const [table, setTable] = useState("haircolor")
  const [data, setData] = useState([])
  const [editing, setEditing] = useState(false)
  const [datumId, setDatumId] = useState(0)
  const [newEntry, setNewEntry] = useState(false)

  function onChange(tbl) {
    setEditing(false)
    setTable(tbl);
    (async () => {
      const res = await fetch(`http://localhost:3004/${tbl}`)
      const json = await res.json()
      console.log(json)
      if (json.length) {
        setData(json)
      }
    })()
  }

  const Editor = Editors[table]

  const updater = (data) => {
    (async () => {
      const res = await fetch(`http://localhost:3004/${table}/${data.id}`,
        {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(res => console.log(res.ok))
    })()
  }

  return (
    <>
      <GenSelect name="tables" handler={onChange} options={Object.keys(Editors)} value={table}/>
      <br/>
      {newEntry &&
      <>
        <Editor updateHandler={updater} isNew={true} {...data[1]} />
      </>
      }
      {editing &&
        <>
          <Editor updateHandler={updater} {...data[datumId]}/>
        </>
      }
      {!editing &&
        <>
          <hr/>
          <button onClick={() => setNewEntry(true)}>Add Entry</button>
          <ul>
            {data.map((datum, k) => <li key={datum.id}><a onClick={e => {
              e.preventDefault()
              setDatumId(k)
              setEditing(!editing)
            }} href="">{JSON.stringify(datum)}</a></li>)}
          </ul>
        </>
      }
    </>
  )
}

function NewDb() {
  const [name, setName] = useState("")
  const [type, setType] = useState("list")
  return (
    <>
      <GenInput name="Name" handler={setName} value={name}/>
      <GenSelect name="Type" handler={setType} options={["list", "template", "multi"]}
                 value={type}/>
      <button>Create Entry</button>
      {name} - {type}
    </>
  )
}

function Db({ match }) {
  return (
    <>
      <AppHeader nav={nav} prefix="db"/>
      <Routes>
        {nav.map(n => <Route key={`/db/` + n.to} path={`${n.to}`} element={n.e}/>)}
      </Routes>
    </>
  )
}

export default Db

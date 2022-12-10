import AppHeader from "./appHeader";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from "react";

const nav = [
  { to: "new", e: <NewDb/> },
  { to: "set", e: <NewDb/> }
]

function GenInput({ name, type = "text", value = "", handler }) {
  return (
    <div className="genInput">
      <label>
        {name}
        <input type={type} value={value} onChange={e=>handler(e.target.value)}/>
      </label>
    </div>
  )
}

function GenSelect({name, handler, options, value}) {
  return (
   <select onChange={e => handler(e.target.value)} value={value}>
     {options.map(option => <option key={option}>{option}</option>)}
   </select>
  )
}

function NewDb() {
  const [name, setName] = useState("")
  const [type, setType] = useState("list")
  return (
    <>
      <GenInput name="Name" handler={setName} value={name}/>
      <GenSelect name="Type" handler={setType} options={["list", "template", "multi"]} value={type} />
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

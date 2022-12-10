import {BrowserRouter, Link, Route, Routes} from "react-router-dom";

function AppHeader({nav, prefix=""}) {

  return (
    <>
    <header>
      <nav>
        {nav.map(n => {
          const to = prefix.length > 0 ? `/${prefix}/${n.to}` : n.to
          return(
            <Link key={n.to} to={to}>{n.to}</Link>
          )
        })}

      </nav>
    </header>
    </>
  )
}

export default AppHeader

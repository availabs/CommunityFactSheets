import React from "react"

import NavBar from "../../containers/layout/NavBarContainer.react"
import SideBar from "../../containers/layout/SideBarContainer.react"

export default function Layout({ children }) {
    return (
        <div>
            <NavBar />
            <SideBar />

	       { children }

        </div>
    )
}
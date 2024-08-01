import React, { useState } from 'react'
import './App.css'
import  {Outlet}  from 'react-router-dom'
import NavBar from './components/NavBar'
import * as Toast from "@radix-ui/react-toast"

function App() {

  return (
    <Toast.Provider>
      <NavBar/>
      <div className='min-h-screen'>
        <Outlet/>
      </div>
    </Toast.Provider>
  )
}

export default App

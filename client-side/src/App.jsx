import React, { useState } from 'react'
import './App.css'
import  {Outlet}  from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {

  return (
    <>
      <NavBar/>
      <div className='min-h-screen'>
        <Outlet/>
      </div>
    </>
  )
}

export default App

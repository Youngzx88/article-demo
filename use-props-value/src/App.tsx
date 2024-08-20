import { useState } from 'react'
import './App.css'
import Switch from './switch/index'
function App() {
  const [checked, setChecked] = useState<boolean>(false)
  const handleChange = () => {
    setChecked(!checked)
  }

  return (
    <>
      <Switch></Switch>
      <Switch checked={checked} onChange={handleChange}></Switch>
    </>
  )
}

export default App

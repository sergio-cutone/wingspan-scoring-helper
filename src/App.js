import React from "react"
import logo from "./img/wingspan-logo.png"
import firebaseLogo from "./img/firebase.png"
import reactLogo from "./img/react.png"
import tailwindLogo from "./img/tailwindcss.png"
import i18next from "./img/i18next.png"
import "./App.css"
import "./translations/i18n"
import WingspanScoring from "./WingspanScoring"

function App() {
  return (
    <div className="App">
      <header className="App-header py-3">
        <img
          src={logo}
          className="w-full max-w-xs px-10"
          alt="Wingspan Scoring"
          title="Wingspan Scoring"
        />
      </header>
      <div className="max-w-screen-lg container mx-auto">
        <WingspanScoring />
      </div>
      <footer className="App-footer">
        <img src={reactLogo} alt="React logo" title="React" />
        <img src={tailwindLogo} alt="Tailwind CSS logo" title="Tailwind" />
        <img src={firebaseLogo} alt="Firebase logo" title="Firebase" />
        <img src={i18next} alt="i18next logo" title="i18next" />
      </footer>
    </div>
  )
}

export default App

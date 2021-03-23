import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.handleGameButton = this.handleGameButton.bind(this)
    this.handlePreviousButton = this.handlePreviousButton.bind(this)
  }

  handleGameButton() {
    this.props.onGameButton(false)
  }

  handlePreviousButton() {
    this.props.onPreviousButton(true)
  }
  render() {
    return (
      <div key="menu" className="mb-3 text-sm">
        <Translation>
          {t => (
            <button
              className="rounded-md bg-blue-500 p-1 text-white w-32 hover:bg-blue-300 mr-1"
              onClick={this.handlePreviousButton}
            >
              {t("previousgames")}
            </button>
          )}
        </Translation>
        <Translation>
          {t => (
            <button
              className="rounded-md bg-blue-500 p-1 text-white w-32 hover:bg-blue-300 ml-1"
              onClick={this.handleGameButton}
            >
              {t("newgame")}
            </button>
          )}
        </Translation>
      </div>
    )
  }
}

export default Menu

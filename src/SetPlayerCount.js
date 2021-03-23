import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"

class SetPlayerCount extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlayerNumberChange = this.handlePlayerNumberChange.bind(this)
    this.handlePlayerNumberDecrease = this.handlePlayerNumberDecrease.bind(this)
    this.handlePlayerNumberIncrease = this.handlePlayerNumberIncrease.bind(this)
  }

  handlePlayerNumberChange(e) {
    this.props.onPlayerNumberChange(e.target.value)
  }

  handlePlayerNumberDecrease() {
    this.props.onPlayerNumberDecrease(-1)
  }

  handlePlayerNumberIncrease() {
    this.props.onPlayerNumberIncrease(1)
  }

  render() {
    return (
      <div>
        <Translation>
          {t => <div className="text-lg font-bold">{t("playercount")}</div>}
        </Translation>
        <button
          className="hover:bg-blue-300 bg-blue-700 text-white rounded-full h-8 w-8 font-bold text-2xl mr-2"
          onClick={this.handlePlayerNumberDecrease}
        >
          {"-"}
        </button>
        <input
          className="text-center w-10"
          type="number"
          value={this.props.numberOfPlayers}
          onChange={this.handlePlayerNumberChange}
          placeholder={0}
          min="0"
        />
        <button
          className="hover:bg-blue-300 bg-blue-700 text-white rounded-full h-8 w-8 font-bold text-2xl ml-3"
          onClick={this.handlePlayerNumberIncrease}
        >
          {"+"}
        </button>
      </div>
    )
  }
}

export default SetPlayerCount

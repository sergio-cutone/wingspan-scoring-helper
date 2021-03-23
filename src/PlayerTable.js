import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"
import PlayerRow from "./PlayerRow"

class PlayerTable extends React.Component {
  constructor(props) {
    super(props)
    this.handleScoreChange = this.handleScoreChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleColourChange = this.handleColourChange.bind(this)
  }

  handleScoreChange(e, index, blockname) {
    this.props.onScoreChange(
      e.target.value.replace(/[^0-9.]+/g, ""),
      index,
      blockname
    )
  }

  handleNameChange(e, index) {
    this.props.onNameChange(e.target.value, index)
  }

  handleColourChange(e, index) {
    this.props.onColourChange(e.target.value, index)
  }
  render() {
    const playerRows = []
    for (let i = 0; i < this.props.numberOfPlayers; i++) {
      playerRows.unshift(
        <PlayerRow
          key={i}
          playerNumber={i}
          playerData={this.props.playerData}
          handleScoreChange={this.handleScoreChange}
          handleNameChange={this.handleNameChange}
          handleColourChange={this.handleColourChange}
        />
      )
    }
    let saveMatch =
      playerRows.length > 0 ? (
        <div>
          {this.props.matchState === "saving" ? (
            <Translation>
              {t => (
                <div className="font-bold my-3 text-xl">
                  {t("congratulations")} {this.props.winningNames}!
                </div>
              )}
            </Translation>
          ) : (
            ""
          )}
          <button
            onClick={this.props.onValidate}
            className={
              "hover:bg-blue-300 text-white p-4 font-bold rounded-lg my-5 " +
              (this.props.error ? "bg-red-600" : "bg-blue-700")
            }
          >
            {!this.props.error ? (
              this.props.matchState === "play" ? (
                <Translation>
                  {t => <span>{t("confirmmatch")}</span>}
                </Translation>
              ) : (
                <Translation>{t => <span>{t("savematch")}</span>}</Translation>
              )
            ) : (
              <Translation>
                {t => <span>{t("savematch_err")}</span>}
              </Translation>
            )}
          </button>
        </div>
      ) : (
        ""
      )

    return (
      <div>
        {playerRows}
        {saveMatch}
      </div>
    )
  }
}

export default PlayerTable

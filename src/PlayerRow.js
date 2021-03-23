import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"

var scoreBlocks = [
  { placeholder: "Birds", name: "birds" },
  { placeholder: "Bonus Cards", name: "bonuscards" },
  { placeholder: "Round End Goals", name: "roundendgoals" },
  { placeholder: "Eggs", name: "eggs" },
  { placeholder: "Food on Cards", name: "foodoncards" },
  { placeholder: "Tucked Cards", name: "tuckedcards" },
]

class PlayerRow extends React.Component {
  render() {
    const tmpPlayerRow = []
    scoreBlocks.forEach((block, index) => {
      tmpPlayerRow.push(
        <div key={index}>
          <div className="text-xs">
            <strong>{block.placeholder}</strong>
          </div>
          <input
            type="tel"
            min="0"
            name={block.name}
            placeholder={0}
            value={
              this.props.playerData[this.props.playerNumber].score[block.name]
            }
            onChange={e =>
              this.props.handleScoreChange(
                e,
                this.props.playerNumber,
                block.name
              )
            }
          />
        </div>
      )
    })
    return (
      <div
        className={
          this.props.playerData[this.props.playerNumber].colour +
          " player-wrapper"
        }
      >
        <div className="text-xl font-bold mb-3">
          {this.props.playerData[this.props.playerNumber].playername}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs font-bold">
              {this.props.playerData[this.props.playerNumber].error ? (
                <Translation>
                  {t => (
                    <div className="text-red-600">
                      {t("label_playername_err")}
                    </div>
                  )}
                </Translation>
              ) : (
                <Translation>
                  {t => <span>{t("label_playername")}</span>}
                </Translation>
              )}
            </div>
            <input
              type="text"
              name="playername"
              className={
                this.props.playerData[this.props.playerNumber].error
                  ? "bg-red-600"
                  : ""
              }
              placeholder={"Player " + (this.props.playerNumber + 1) + " Name"}
              onChange={e =>
                this.props.handleNameChange(e, this.props.playerNumber)
              }
            />
          </div>
          <div>
            <Translation>
              {t => (
                <div className="text-xs font-bold">{t("label_colour")}</div>
              )}
            </Translation>
            <select
              name="colour"
              onChange={e =>
                this.props.handleColourChange(e, this.props.playerNumber)
              }
            >
              <Translation>
                {t => <option value="white">{t("selectcolour")}</option>}
              </Translation>
              <Translation>
                {t => <option value="blue">{t("blue")}</option>}
              </Translation>
              <Translation>
                {t => <option value="green">{t("green")}</option>}
              </Translation>
              <Translation>
                {t => <option value="purple">{t("purple")}</option>}
              </Translation>
              <Translation>
                {t => <option value="red">{t("red")}</option>}
              </Translation>
              <Translation>
                {t => <option value="yellow">{t("yellow")}</option>}
              </Translation>
            </select>
          </div>
          <div>
            <Translation>
              {t => <div className="text-xs font-bold">{t("label_total")}</div>}
            </Translation>
            <input
              type="number"
              readOnly
              name="score"
              placeholder="Total"
              value={this.props.playerData[this.props.playerNumber].total}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {tmpPlayerRow}
        </div>
      </div>
    )
  }
}

export default PlayerRow

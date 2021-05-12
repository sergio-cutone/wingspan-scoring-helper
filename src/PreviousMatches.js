import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"

let lastVisible, firstVisible
const scoreSheetsPerPage = require("./services/fb-mpp")

class PreviousMatches extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: [],
      nextDisable: false,
      prevDisable: true,
    }
    this.handlePagination = this.handlePagination.bind(this)
    this.deleteMatch = this.deleteMatch.bind(this)
  }

  componentDidMount() {
    this.getMatches()
  }

  getNextMatch(startAfter) {
    this.props.db
      .collection(this.props.firebaseDoc)
      .orderBy("timestamp", "desc")
      .startAfter(startAfter)
      .limit(scoreSheetsPerPage)
      .get()
      .then(documentSnapshots => {
        this.setState({
          nextDisable: documentSnapshots.docs.length === 0 ? true : false,
        })
      })
  }

  getPreviousMatch() {
    this.props.db
      .collection(this.props.firebaseDoc)
      .orderBy("timestamp", "desc")
      .endBefore(firstVisible)
      .limitToLast(scoreSheetsPerPage)
      .get()
      .then(documentSnapshots => {
        this.setState({
          prevDisable: documentSnapshots.docs.length === 0 ? true : false,
        })
      })
  }

  getMatches() {
    let allMatches = []
    var first = this.props.db
      .collection(this.props.firebaseDoc)
      .orderBy("timestamp", "desc")
      .limit(scoreSheetsPerPage)

    first.get().then(documentSnapshots => {
      if (documentSnapshots.docs.length > 0) {
        lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]
        firstVisible = documentSnapshots.docs[0]

        documentSnapshots.forEach(doc => {
          allMatches.push({ data: doc.data(), docId: doc.id })
        })
        this.setState({
          matches: allMatches,
        })

        this.getNextMatch(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        )
      }
    })
  }

  deleteMatch(e) {
    let verify = window.confirm("Are you sure you want to delete this match?")
    if (verify === true) {
      this.props.db
        .collection(this.props.firebaseDoc)
        .doc(e.currentTarget.getAttribute("data-docid"))
        .delete()
        .then(() => {
          console.log("Document successfully deleted!")
          this.getMatches()
        })
        .catch(error => {
          console.error("Error removing document: ", error)
        })
    }
  }

  handlePagination(e) {
    let direction = e.currentTarget.getAttribute("data-paginate")
    let allMatches = []
    let collection =
      direction === "next"
        ? this.props.db
            .collection(this.props.firebaseDoc)
            .orderBy("timestamp", "desc")
            .startAfter(lastVisible)
            .limit(scoreSheetsPerPage)
        : this.props.db
            .collection(this.props.firebaseDoc)
            .orderBy("timestamp", "desc")
            .endBefore(firstVisible)
            .limitToLast(scoreSheetsPerPage)

    collection.get().then(documentSnapshots => {
      lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]
      firstVisible = documentSnapshots.docs[0]
      documentSnapshots.forEach(doc => {
        allMatches.push({ data: doc.data(), docId: doc.id })
      })
      this.setState({
        matches: allMatches,
      })

      this.getNextMatch(
        documentSnapshots.docs[documentSnapshots.docs.length - 1]
      )

      this.getPreviousMatch()
    })
  }

  cellWrap(cell, extraClass = "") {
    return (
      <div className={"p-1 border border-gray-300 truncate " + extraClass}>
        <div>{cell}</div>
      </div>
    )
  }

  render() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    if (this.state.matches.length > 0) {
      return (
        <div className="pb-5">
          {this.state.matches.map((match, i) => (
            <div
              className="rounded-lg shadow-lg m-2 mb-5 bg-gray-100 p-1 border-2 border-gray-300"
              key={`matches-${i}`}
            >
              <div className="text-xs mb-1">
                {monthNames[match.data.timestamp.toDate().getUTCMonth()]}{" "}
                {String(match.data.timestamp.toDate().getDay())},{" "}
                {String(match.data.timestamp.toDate().getFullYear())}{" "}
                {String(
                  match.data.timestamp.toDate().toLocaleTimeString("en-US")
                )}
                <button
                  data-docid={match.docId}
                  onClick={this.deleteMatch}
                  className="text-red-500 font-bold text-md float-right mr-2"
                >
                  Delete
                </button>
              </div>
              <div className="previous-games grid text-xs lg:text-md grid-cols-6">
                <div>
                  {this.cellWrap("Wingspan")}
                  <Translation>
                    {t => this.cellWrap(t("birds"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("bonuscards"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("endofround"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("eggs"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("foodoncards"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("tuckedcards"), "font-bold")}
                  </Translation>
                  <Translation>
                    {t => this.cellWrap(t("total"), "font-bold")}
                  </Translation>
                </div>
                {match.data.players
                  .sort((a, b) => b.total - a.total)
                  .map((player, i) => (
                    <div
                      className={"bg-white " + player.colour}
                      key={`match-${i}`}
                    >
                      {this.cellWrap(player.playername || 0, "player-name")}
                      {this.cellWrap(player.score.birds || 0)}
                      {this.cellWrap(player.score.bonuscards || 0)}
                      {this.cellWrap(player.score.roundendgoals || 0)}
                      {this.cellWrap(player.score.eggs || 0)}
                      {this.cellWrap(player.score.foodoncards || 0)}
                      {this.cellWrap(player.score.tuckedcards || 0)}
                      {this.cellWrap(
                        player.total || 0,
                        match.data.winner.includes(player.id)
                          ? "bg-blue-500 text-white font-bold"
                          : ""
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <button
            data-paginate="prev"
            onClick={this.handlePagination}
            disabled={this.state.prevDisable}
            className={
              (this.state.prevDisable ? "bg-blue-300" : "bg-blue-500") +
              " rounded-md p-1 text-white w-32 hover:bg-blue-300"
            }
          >
            <Translation>{t => t("back")}</Translation>
          </button>{" "}
          <button
            data-paginate="next"
            onClick={this.handlePagination}
            disabled={this.state.nextDisable}
            className={
              (this.state.nextDisable ? "bg-blue-300" : "bg-blue-500") +
              " rounded-md p-1 text-white w-32 hover:bg-blue-300"
            }
          >
            <Translation>{t => t("next")}</Translation>
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <Translation>{t => t("nogamesexist")}</Translation>
        </div>
      )
    }
  }
}

export default PreviousMatches

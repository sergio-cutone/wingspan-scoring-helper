import React from "react"
import firestore from "./services/firestore"
import SetPlayerCount from "./SetPlayerCount"
import PlayerTable from "./PlayerTable"
import PreviousMatches from "./PreviousMatches"
import LoginScreen from "./Login"
import Menu from "./Menu"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const firebaseDoc = ""

class WingspanScoring extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfPlayers: 0,
      playerName: "",
      playerColour: "bg-blue-100",
      error: false,
      playerData: [],
      matchState: "play",
      winningIds: [],
      winningNames: "",
      statsTable: false,
      email: "",
      password: "",
      signedIn: false,
    }
    this.handlePlayerNumberChange = this.handlePlayerNumberChange.bind(this)
    this.handlePlayerNumberDecrease = this.handlePlayerNumberDecrease.bind(this)
    this.handlePlayerNumberIncrease = this.handlePlayerNumberIncrease.bind(this)
    this.handleScoreChange = this.handleScoreChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleColourChange = this.handleColourChange.bind(this)
    this.handleSaveMatch = this.handleSaveMatch.bind(this)
    this.setWinner = this.setWinner.bind(this)
    this.validateInput = this.validateInput.bind(this)
    this.handleGameButton = this.handleGameButton.bind(this)
    this.handlePreviousButton = this.handlePreviousButton.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleGameButton(incomingStatState) {
    this.setState({
      numberOfPlayers: 0,
      statsTable: incomingStatState,
    })
  }

  handlePreviousButton(incomingStatState) {
    this.setState({
      statsTable: incomingStatState,
    })
  }

  setPlayerData(numberOfPlayers) {
    const tmpPlayerData = []
    let tmpExistingData = {
      playername: "",
      error: false,
      score: {
        birds: "",
        bonuscards: "",
        roundendgoals: "",
        eggs: "",
        foodoncards: "",
        tuckedcards: "",
      },
      total: 0,
      colour: "gray",
    }
    for (let i = 0; i < numberOfPlayers; i++) {
      tmpExistingData.id = i
      if (typeof this.state.playerData === "object") {
        if (typeof this.state.playerData[i] === "undefined") {
          tmpPlayerData.push(tmpExistingData)
        } else {
          tmpPlayerData.push(this.state.playerData[i])
        }
      } else {
        tmpPlayerData.push(tmpExistingData)
      }
    }
    return tmpPlayerData
  }

  validateInput() {
    let isValid = true
    Object.values(this.state.playerData).forEach(player => {
      if (!player.playername) {
        player.error = true
        isValid = false
      } else {
        player.error = false
      }
    })
    this.setState({
      error: !isValid ? true : false,
      matchState: "play",
    })
    return isValid
  }

  setWinner() {
    let highest = Object.values(this.state.playerData).filter(
      player =>
        player.total ===
        Math.max.apply(
          Math,
          Object.values(this.state.playerData).map(player => player.total)
        )
    )
    let winningNames = ""
    highest.forEach(e => {
      winningNames += `${e.playername}, `
    })
    this.setState({
      winningNames: winningNames.slice(0, -2),
      winningIds: highest.map(e => e.id),
    })
  }

  handleSaveMatch() {
    if (this.state.matchState === "play") {
      if (this.validateInput()) {
        this.setState(
          {
            matchState: "saving",
          },
          () => this.setWinner()
        )
      }
    } else {
      this.saveFirebaseData()
    }
  }

  saveFirebaseData() {
    var self = this
    db.collection(firebaseDoc)
      .add({
        players: this.state.playerData,
        winner: this.state.winningIds,
        timestamp: firestore.firestore.FieldValue.serverTimestamp(),
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id)
        self.setState({
          statsTable: true,
          playerData: [],
        })
      })
      .catch(function (error) {
        console.error("Error adding document: ", error)
      })
  }

  handlePlayerNumberChange(numberOfPlayers, validate) {
    const setNumberOfPlayers =
      numberOfPlayers < 2 ? 1 : numberOfPlayers > 4 ? 5 : numberOfPlayers
    this.setState(
      {
        numberOfPlayers: setNumberOfPlayers,
        playerData: this.setPlayerData(setNumberOfPlayers),
        error: false,
        matchState: "play",
      },
      () => (validate ? this.validateInput() : "")
    )
  }

  handlePlayerNumberDecrease(value) {
    this.handlePlayerNumberChange(this.state.numberOfPlayers + value, true)
  }

  handlePlayerNumberIncrease(value) {
    this.handlePlayerNumberChange(this.state.numberOfPlayers + value, false)
  }

  setTotalScore(index) {
    this.setState(prevState => ({
      playerData: prevState.playerData.map((player, i) =>
        i === index
          ? {
              ...player,
              total: Object.values(this.state.playerData[index].score)
                .map(a => (!a ? 0 : a))
                .reduce((a, b) => parseInt(a + b)),
            }
          : player
      ),
      matchState: "play",
    }))
  }

  handleScoreChange(value, index, blockname) {
    this.setState(
      prevState => ({
        playerData: prevState.playerData.map((player, i) =>
          i === index
            ? {
                ...player,
                score: {
                  ...player.score,
                  [blockname]: Number(value),
                },
              }
            : player
        ),
      }),
      () => this.setTotalScore(index)
    )
  }

  handleNameChange(value, index) {
    this.setState(
      prevState => ({
        playerData: prevState.playerData.map((player, i) =>
          i === index ? { ...player, playername: value } : player
        ),
      }),
      () => this.validateInput()
    )
  }

  handleColourChange(value, index) {
    this.setState(prevState => ({
      playerData: prevState.playerData.map((player, i) =>
        i === index ? { ...player, colour: value } : player
      ),
    }))
  }

  handleEmail(value) {
    this.setState({
      email: value,
    })
  }

  handlePassword(value) {
    this.setState({
      password: value,
    })
  }

  handleSignIn() {
    console.log(this.state.email, this.state.password, "works")
    firestore
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredential => {
        // Signed in
        var user = userCredential.user
        this.setState({
          signedIn: true,
        })
        console.log(user)
        // ...
      })
      .catch(error => {
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  handleSignOut() {
    firestore
      .auth()
      .signOut()
      .then(() => {
        this.handleGameButton(false)
        this.setState({
          signedIn: false,
        })
      })
      .catch(error => {
        // An error happened.
        console.log(error)
      })
  }

  render() {
    var displayScreen = []
    if (!this.state.statsTable) {
      displayScreen.push(
        <SetPlayerCount
          numberOfPlayers={this.state.numberOfPlayers}
          onPlayerNumberChange={this.handlePlayerNumberChange}
          onPlayerNumberDecrease={this.handlePlayerNumberDecrease}
          onPlayerNumberIncrease={this.handlePlayerNumberIncrease}
        />,
        <PlayerTable
          numberOfPlayers={this.state.numberOfPlayers}
          playerData={this.state.playerData}
          matchState={this.state.matchState}
          onScoreChange={this.handleScoreChange}
          onNameChange={this.handleNameChange}
          onColourChange={this.handleColourChange}
          onValidate={this.handleSaveMatch}
          error={this.state.error}
          winningNames={this.state.winningNames}
        />
      )
    } else {
      displayScreen.push(<PreviousMatches firebaseDoc={firebaseDoc} db={db} />)
    }
    return (
      <div key="wingspan">
        <LoginScreen
          signedIn={this.state.signedIn}
          onEmail={this.handleEmail}
          onPassword={this.handlePassword}
          onSignIn={this.handleSignIn}
          onSignOut={this.handleSignOut}
        />
        <Menu
          onGameButton={this.handleGameButton}
          onPreviousButton={this.handlePreviousButton}
        />
        <div key="displayscreen">{displayScreen}</div>
      </div>
    )
  }
}

export default WingspanScoring

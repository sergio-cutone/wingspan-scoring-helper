import React from "react"
import "./translations/i18n"
import { Translation } from "react-i18next"
import logo from "./img/wingspan-logo.png"

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    const url_string = window.location.href
    const url = new URL(url_string)
    const email = url.searchParams.get("email") || ""
    if (email) {
      this.setState({
        email: email,
      })
      this.props.onEmail(email)
    }
  }
  handleEmail(value) {
    this.props.onEmail(value)
    this.setState({
      email: value,
    })
  }
  handleKeyDown(e) {
    if (e.key === "Enter") {
      this.props.onPassword("")
      this.props.onSignIn()
    }
  }
  render() {
    return (
      <>
        {this.props.signedIn ? (
          <div
            className="absolute top-1 right-2 cursor-pointer hover:text-white text-blue-700"
            onClick={e => this.props.onSignOut()}
          >
            <Translation>{t => t("logout")}</Translation>
          </div>
        ) : (
          <div className="bg-black bg-opacity-80 w-full h-full fixed top-0 left-0 text-center p-5">
            <div className="max-w-xl bg-white p-3 rounded mx-auto border-4 border-blue-500">
              <img
                src={logo}
                className="w-full max-w-xs px-10 mx-auto mb-3"
                alt="Wingspan Scoring"
                title="Wingspan Scoring"
              />
              <p className="text-xl mb-3 font-bold">Please Sign In</p>
              <p className="mb-3">
                Email
                <br />
                <input
                  type="email"
                  name="email"
                  className="border-2 p-2 border-black rounded"
                  onChange={e => this.handleEmail(e.target.value)}
                  value={this.state.email}
                />
              </p>
              <p className="mb-3">
                Password
                <br />
                <input
                  type="password"
                  name="pw"
                  className="border-2 p-2 border-black rounded"
                  onChange={e => this.props.onPassword(e.target.value)}
                  onKeyDown={this.handleKeyDown}
                />
              </p>
              <button
                className="hover:bg-blue-300 bg-blue-500 py-2 px-4 rounded text-white"
                onClick={e => this.props.onSignIn()}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default LoginScreen

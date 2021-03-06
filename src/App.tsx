import React, { FunctionComponent, useEffect, useState } from "react"

import "./App.css"
import { getState, submitCommand } from "./game/Game"

import compromise from "compromise"
import nlpAdjectives from "compromise-adjectives"

const nlp = compromise.extend(nlpAdjectives)

type HeaderProps = {
    moves: number
    score: number
    room: string
}

const Header: FunctionComponent<HeaderProps> = ({ moves, room, score }) => (
    <div className="header">
        <div className="room">{room}</div>
        <div>
            Moves: <span className="headerValue">{moves}</span>
        </div>
        <div>
            Score: <span className="headerValue">{score}</span>
        </div>
    </div>
)

const App = () => {
    const [input, setInput] = useState("")
    const [history, setHistory] = useState<string[]>([])
    const [moves, setMoves] = useState(0)
    const [score, setScore] = useState(0)
    const [room, setRoom] = useState("")

    const submit = () => {
        const terms = nlp(input)

        const action = terms.verbs().first().text()
        const object = terms.nouns().first().text()
        const adjective = terms.adjectives().json()[0]?.text
        let command = action

        if (object) {
            command += " " + object
        }

        if (adjective) {
            command += " " + adjective
        }

        submitCommand(command.trim())

        updateState(input)

        setInput("")
    }

    const updateState = (command?: string) => {
        const state = getState()
        const currentHistory = command ? [...history, "> " + command] : history
        const newHistory = [...currentHistory, state.output]

        setHistory(newHistory)
        setMoves(state.moves)
        setRoom(state.room)
        setScore(state.score)
    }

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    })

    useEffect(() => {
        updateState()
    }, [])

    return (
        <div className="wrapper">
            <Header room={room} moves={moves} score={score} />
            <span>ZORK</span>
            <br />
            <br />
            Welcome to ZORK.
            <br />
            (Originally implemented by by Dillon Lomnitzer & Josh Stevens.)
            <br />
            Original game &copy; 1981, 1982, 1983 Infocom Inc. All rights reserved.
            <br />
            <br />
            <div className="content">{history.map(line => line.split("\n").map(subLine => <p>{subLine}</p>))}</div>
            <div className="input">
                &gt;{" "}
                <input
                    type="text"
                    autoFocus
                    data-lpignore="true"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    onKeyPress={event => {
                        if (event.which === 13) {
                            submit()
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default App

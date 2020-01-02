import React, { Component } from "react";
import { Container, Label } from "semantic-ui-react";
//import LineLabel from "./LineLabel";


class Lesson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lesson: [],
            stopPlayingPart: null,
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        const epNo = this.props.epNo
        const jsonName = '/data/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        this.setState({ lesson: myJson })
    }

    onTimeUpdate = () => {
        const audio = document.getElementById('track')
        //const duration = audio.duration
        const currentTime = Math.round(audio.currentTime * 10) / 10;

        //this.updateTrackTime(currentTime, duration)
        this.stopPlayingPart(currentTime)
    }
    stopPlayingPart = (currentTime) => {
        const stopPlayingPart = this.state.stopPlayingPart
        if (stopPlayingPart && stopPlayingPart <= currentTime) {
            this.setState({ stopPlayingPart: null })
            document.getElementById('track').pause()
        }
    }

    playPart = (index) => {
        const audio = document.getElementById('track')
        const line = this.state.lesson[index]
        this.startPlayingPart(audio, line.mp3Start, line.mp3End)
    }
    startPlayingPart = (player, start, end) => {
        player.currentTime = start
        this.setState({ stopPlayingPart: end })
        player.play()
    }

    render() {
        const epNo = this.props.epNo
        const mp3Path = '/data/ep' + epNo + '.mp3'
        return (
            <Container>
                epNo = {epNo}
                <audio id="track" src={mp3Path}
                    onTimeUpdate={this.onTimeUpdate}>
                    <p>Your browser does not support the audio element</p>
                </audio>

                {this.state.lesson.map((linia, index) => {
                    //let audioPart = (this.state.lesson.length > index) ? this.state.lesson[index] : ''
                    return (
                        <div className="line-container">
                            {linia.lineNo}
                            <Label className="zdanie" onClick={() => this.playPart(index)}>{linia.linePl}</Label>
                            <Label className="zdanie translation" onClick={() => this.playPart(index)}>{linia.lineEn}</Label>
                            {/* <button type="button" onClick={() => this.playPart(index)} >play</button> */}
                        </div>
                    )
                })}



                {/* <LineLabel textPl={textPl} textEn={textEn} /> */}
            </Container>
        );
    }
}

//const textPl = "Narrator: Witamy ponownie w języku angielskim w pracy. Nadal jesteśmy w pierwszym tygodniu Anny w zajęte biura Tip Top Trading. Jak leci Anna?"
//const textEn = "Narrator:  Welcome back to English at Work. We're still in Anna's first week in the busy offices of Tip Top Trading. How's it going Anna?"

export default Lesson;
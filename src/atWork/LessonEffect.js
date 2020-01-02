import React, { useState, useEffect } from 'react';
import { Container, Label } from "semantic-ui-react";

export const LessonEffect = ({ epNo }) => {
    const [lesson, setLesson] = useState([])
    const [timeToStopPlayingPart, setTimeToStopPlayingPart] = useState(null)

    useEffect(() => {
        load(epNo)
    }, [epNo])

    async function load(epNo) {
        const jsonName = '/data/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        setLesson(myJson)
    }
            
    const mp3Path = '/data/ep' + epNo + '.mp3'

    const onTimeUpdate = () => {
        const audio = document.getElementById('track')
        const duration = audio.duration
        const currentTime = Math.round(audio.currentTime * 10) / 10;

        //this.updateTrackTime(currentTime, duration)
        stopPlayingPart(currentTime)
    }
    const stopPlayingPart = (currentTime) => {
        if (timeToStopPlayingPart && timeToStopPlayingPart <= currentTime) {
            setTimeToStopPlayingPart(null)
            document.getElementById('track').pause()
        }
    }

    const playPart = (index) => {
        const audio = document.getElementById('track')
        const line = lesson[index]
        startPlayingPart(audio, line.mp3Start, line.mp3End)
    }
    const startPlayingPart = (player, start, end) => {
        player.currentTime = start
        setTimeToStopPlayingPart(end)
        player.play()
    }

    return (
        <Container>
            epNo = {epNo}
            <audio id="track" src={mp3Path}
                onTimeUpdate={onTimeUpdate}>
                <p>Your browser does not support the audio element</p>
            </audio>

            {lesson.map((linia, index) => {
                let audioPart = (lesson.length > index) ? lesson[index] : ''
                return (
                    <div className="line">
                        <div className="lineNo">
                            {linia.lineNo}
                        </div>
                        <div className="times">
                            <div>{linia.mp3Start}</div>
                            <div>{linia.mp3End}</div>
                        </div>
                        <div className="sentences">
                            <div className="" onClick={() => playPart(index)}>{linia.linePl}</div>
                            <div className="" onClick={() => playPart(index)}>{linia.lineEn}</div>
                            {/* <Label className="zdanie" onClick={() => playPart(index)}>{linia.linePl}</Label>
                            <Label className="zdanie translation" onClick={() => playPart(index)}>{linia.lineEn}</Label> */}
                        </div>
                        {/* <button type="button" onClick={() => this.playPart(index)} >play</button> */}
                    </div>
                )
            })}
        </Container>
    )
}
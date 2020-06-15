import React, { useState, useEffect } from 'react';
import { Container } from "semantic-ui-react";
import './LessonEffect.css';

export const LessonEffect = ({ epNo }) => {
    const [lesson, setLesson] = useState([])
    const [timeToStopPlayingPart, setTimeToStopPlayingPart] = useState(null)
    const [edit, setEdit] = useState(false)

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
        //const duration = audio.duration
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

    if(!edit)
    return (
        <>
            <button onClick={() => setEdit(true)} className="header-button"><strong>edit</strong></button>
            <Container>
            {/* epNo = {epNo} */}
            <audio id="track" src={mp3Path}
                onTimeUpdate={onTimeUpdate}>
                <p>Your browser does not support the audio element</p>
            </audio>

            {lesson.map((linia, index) => {
                //let audioPart = (lesson.length > index) ? lesson[index] : ''
                return (
                     <div className="less_line">
                            <div className="less_line_left">
                                <div className="less_line_lineNo padding">{linia.lineNo}</div>
                                <div className="less_line_tekstPl padding" onClick={() => playPart(index)}>
                                    {linia.linePl}
                                </div>
                            </div>
                            <div className="less_line_right">
                                <div className="less_line_tekstEn padding" onClick={() => playPart(index)}>
                                    <div className="text_hidden">{linia.lineEn}</div>                                    
                                </div>
                                <div className="less_line_times padding">
                                    <div>{linia.mp3Start}</div>
                                    <div>{linia.mp3End}</div>
                                </div>
                            </div>
                    </div>
                )
            })}
        </Container>
        </>
        )
    if (edit)
    return (
        <>
            <button onClick={() => setEdit(false)} className="header-button">stop edit</button>
            <audio id="track" src={mp3Path}
                onTimeUpdate={onTimeUpdate}>
                <p>Your browser does not support the audio element</p>
            </audio>

            {lesson.map((linia, index) => {
                //let audioPart = (lesson.length > index) ? lesson[index] : ''
                return (
                    <div className="less_line">
                        <div className="less_line_left">
                            <div className="less_line_tekstPl " onClick={() => playPart(index)}>
                                <textarea id={"epPl" + index} name='textPl' value={linia.linePl} readOnly
                                    className="lesson_edit_textarea" />
                            </div>
                        </div>
                        <div className="less_line_lineNo padding">
                            {linia.lineNo}
                            <button onClick={() => alert('add '+ index)} className="">add</button>
                            <button onClick={() => alert('jooin ' + index)} className="header-button">join</button>
                        </div>
                        <div className="less_line_right">
                            <div className="less_line_times padding">
                                <div>
                                    <button onClick={() => alert('subStart ' + index)} className="">{'<'}</button>
                                    {linia.mp3Start}
                                    <button onClick={() => alert('addStart ' + index)} className="">{'>'}</button>
                                </div>
                                <div>
                                    {linia.mp3End}

                                </div>
                            </div>
                            <div className="less_line_tekstEn " onClick={() => playPart(index)}>
                                <textarea id={"epPl" + index} name='textPl' value={linia.lineEn} readOnly
                                    className="lesson_edit_textarea" />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
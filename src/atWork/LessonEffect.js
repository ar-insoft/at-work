import React, { useState, useEffect } from 'react';
import { Container } from "semantic-ui-react";
import { saveAs } from 'file-saver'
import './LessonEffect.css';

export const LessonEffect = ({ epNo }) => {
    const [lesson, setLesson] = useState([])
    const [status, setStatus] = useState('...')
    const [jsonLoaded, setJsonLoaded] = useState(false)
    const [timeToStopPlayingPart, setTimeToStopPlayingPart] = useState(null)
    const [playingIndex, setPlayingIndex] = useState(null)
    const [currentPlayingTime, setCurrentPlayingTime] = useState(null)
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        load(epNo)
    }, [epNo])

    async function load(epNo) {
        const jsonName = '/atWork/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        const contentType = response.headers.get("content-type")
        const contentTypeOk = contentType && contentType.indexOf("application/json") !== -1
        //console.log('contentType ' + epNo, contentType)
        //console.log('response ' + epNo, response)
        if (!response.ok || !contentTypeOk) {
            setStatus('no json')
            setLesson([])
            setJsonLoaded(false)
            return
        }
        const myJson = await response.json();
        setStatus('')
        setLesson(myJson)
        setJsonLoaded(true)
    }
            
    const mp3Path = '/atWork/ep' + epNo + '.mp3'

    const save = () => {
        const fileName = 'ep' + epNo + '.json'
        const lessons = normalize()
        var blob = new Blob([JSON.stringify(lessons)], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
    }
    const normalize = () => {
        const lessons = [...lesson]
        for (let index = 0; index < lessons.length; index++) {
            const element = lessons[index];
            element.lineNo = index + 1
            element.mp3Start = formatTime(element.mp3Start)
            element.mp3End = formatTime(element.mp3End)
        }
        setLesson(lessons)
        return lessons
    }

    const onTimeUpdate = () => {
        const audio = document.getElementById('track')
        //const duration = audio.duration
        const currentTime = Math.round(audio.currentTime * 10) / 10;

        setCurrentPlayingTime(currentTime)
        stopPlayingPart(currentTime)
    }
    const stopPlayingPart = (currentTime) => {
        if (timeToStopPlayingPart && timeToStopPlayingPart <= currentTime) {
            setTimeToStopPlayingPart(null)
            document.getElementById('track').pause()
            setPlayingIndex(null)
        }
    }

    const playPart = (index) => {
        const audio = document.getElementById('track')
        const line = lesson[index]
        setPlayingIndex(index)
        startPlayingPart(audio, line.mp3Start, line.mp3End)
    }
    const startPlayingPart = (player, start, end) => {
        player.currentTime = start
        setTimeToStopPlayingPart(end)
        player.play()
    }
    const joinParts = (index) => {
        const newArray = index > 0 ? lesson.slice(0, index) : []
        const postArray = index + 2 < lesson.length - 1 ? lesson.slice(index + 2) : []

        newArray.push(lesson[index], ...postArray)
        newArray[index].linePl += ' ' + lesson[index + 1].linePl
        newArray[index].lineEn += ' ' + lesson[index + 1].lineEn
        newArray[index].mp3End = lesson[index + 1].mp3End
        setLesson(newArray)
    }
    const addParts = (index) => {
        const newArray = index > 0 ? lesson.slice(0, index) : []
        const postArray = index + 1 < lesson.length - 1 ? lesson.slice(index + 1) : []
        const newLine = {
            linePl: '', lineEn: '', lineNo: lesson[index].lineNo,
            mp3Start: lesson[index].mp3End, mp3End: lesson[index + 1].mp3Start,
        }
        newArray.push(newLine, ...postArray)
        setLesson(newArray)
    }
    const handleChangeLinePl = (index, value) => {
        const lessons = [...lesson]
        lessons[index].linePl = value
        setLesson(lessons)
    }
    const subStart = (index) => {
        const lessons = [...lesson]
        lessons[index].mp3Start = lesson[index].mp3Start - 0.1
        setLesson(lessons)
    }
    const changeTime = (function () {
        const incrementValue = 0.1
        function changeTimeValue(index, field, value) {
            const lessons = [...lesson]
            lessons[index][field] = +lesson[index][field] + +value
            setLesson(lessons)
        }
        return {
            decrementStart: function (index) {
                changeTimeValue(index, 'mp3Start', -incrementValue)
            },
            incrementStart: function (index) {
                changeTimeValue(index, 'mp3Start', incrementValue)
            },
            incrementEnd: function (index) {
                changeTimeValue(index, 'mp3End', incrementValue)
            },
            decrementEnd: function (index) {
                changeTimeValue(index, 'mp3End', -incrementValue)
            },
        }
    })()
    const formatTime = (num) => {
        if (typeof num === 'number') {
            return num.toFixed(1)
        }
        return num
    }
    if (!jsonLoaded)
        return (
            <>
                {epNo} {status}
            </>
        )

    if(!edit)
    return (
        <>
            <button onClick={() => setEdit(true)} className="header-button"><strong>edit</strong></button> {epNo} {status}
            <Container>
            {/* epNo = {epNo} */}
            <audio id="track" src={mp3Path}
                onTimeUpdate={onTimeUpdate}>
                <p>Your browser does not support the audio element</p>
            </audio>

            {lesson.map((linia, index) => {
                //let audioPart = (lesson.length > index) ? lesson[index] : ''
                return (
                    <div className="less_line" key={index}>
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
            <button onClick={() => save()} className="header-button">save</button>
            <audio id="track" src={mp3Path}
                onTimeUpdate={onTimeUpdate}>
                <p>Your browser does not support the audio element</p>
            </audio>

            {lesson.map((linia, index) => {
                //let audioPart = (lesson.length > index) ? lesson[index] : ''
                return (
                    <div className="less_line" key={index}>
                        <div className="less_line_left">
                            <div className="less_line_tekstPl " >
                                <textarea id={"epPl" + index} name='textPl' value={linia.linePl}
                                    onChange={event => handleChangeLinePl(index, event.target.value)}
                                    className="lesson_edit_textarea" />
                            </div>
                        </div>
                        <div className="less_line_lineNo padding">
                            {linia.lineNo}
                            <button onClick={() => addParts(index)} className="">add</button>
                            <button onClick={() => joinParts(index)} className="header-button">join</button>
                            <br />
                            {playingIndex === index ? formatTime(currentPlayingTime) : ''}
                        </div>
                        <div className="less_line_right">
                            <div className="less_line_times padding">
                                <div>
                                    <button onClick={() => changeTime.decrementStart(index)} className="">{'<'}</button>
                                    {formatTime(linia.mp3Start)}
                                    <button onClick={() => changeTime.incrementStart(index)} className="">{'>'}</button>
                                </div>
                                <div>
                                    <button onClick={() => changeTime.decrementEnd(index)} className="">{'<'}</button>
                                    {formatTime(linia.mp3End)}
                                    <button onClick={() => changeTime.incrementEnd(index)} className="">{'>'}</button>
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
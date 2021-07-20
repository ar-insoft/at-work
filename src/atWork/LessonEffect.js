import React, { useState, useEffect } from 'react';
import { Container } from "semantic-ui-react";
import classNames from 'classnames/bind'
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

    const [przerobione, setPrzerobione] = useState([])

    const mp3Url = '/atWork/ep' + epNo + '.mp3'
    const jsonUrl = '/atWork/ep' + epNo + '.json'
    const saveLessonUrl = '/at-work/handle_save_lesson'
    const savePrzerobioneUrl = '/at-work/handle_save_lesson/przerobione/'

    useEffect(() => {
        load(epNo)
    }, [epNo])

    useEffect(() => {
        setPrzerobione([])
    }, [epNo])

    async function load(epNo) {
        const response = await fetch(jsonUrl);
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

    const post = () => {
        const file = 'ep' + epNo
        const lessons = normalize()
        const body = { time: new Date().toISOString(), file, lessons}
        //body[file] = JSON.stringify(lessons)
        postData(saveLessonUrl, body)
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
    }
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

    async function postData(url = '', data = {default: 'test'}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            //mode: 'no-cors', // no-cors, *cors, same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
            //body: JSON.stringify({ a: 1, b: 'Textual content' })
        });
        console.log('postData.response', response)
        return response.json(); // parses JSON response into native JavaScript objects
    }
    async function postTest() {
        const rawResponse = await fetch('/test', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: 'ep_testpost', lessons: 'Test content' })
        });
        const content = await rawResponse.json();

        console.log('postTest', content);
    }

    const zarejestrujPrzerobienie = index => {
        if (!przerobione.includes(index)) przerobione.push(index)
        setPrzerobione(przerobione)
        const toSend = { time: new Date().toISOString(), 'ep': epNo, index, przerobione }
        postData(savePrzerobioneUrl, toSend)
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
    }
    async function postPrzerobione() {
        const rawResponse = await fetch('/test', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ file: 'ep_testpost', lessons: 'Test content' })
        });
        const content = await rawResponse.json();

        console.log('postTest', content);
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

        zarejestrujPrzerobienie(index)
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
        const newArray = lesson.slice(0, index + 1)
        const postArray = index + 1 < lesson.length - 1 ? lesson.slice(index + 1) : []
        //console.log('addParts index=' + index +' ' + newArray.length + ' ' + postArray.length)
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
    const handleChangeLineEn = (index, value) => {
        const lessons = [...lesson]
        lessons[index].lineEn = value
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
            decrementStart: function (index, value = -incrementValue) {
                changeTimeValue(index, 'mp3Start', value)
            },
            incrementStart: function (index, value = incrementValue) {
                changeTimeValue(index, 'mp3Start', value)
            },
            incrementEnd: function (index, value = incrementValue) {
                changeTimeValue(index, 'mp3End', value)
            },
            decrementEnd: function (index, value = -incrementValue) {
                changeTimeValue(index, 'mp3End', value)
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
            <audio id="track" src={mp3Url}
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
                            <div onClick={() => playPart(index)} className={classNames(
                                'less_line_tekstEn  padding',
                                {
                                    'less_line_tekstEn_przerobione': przerobione.includes(index),
                                })}>
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
            <button onClick={() => post()} className="header-button">post</button>
            <span className="debug_span">
                <button onClick={() => save()} className="header-button">download</button>
                <button onClick={() => postTest()} className="header-button">postTest</button>
            </span>
            <audio id="track" src={mp3Url}
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
                        <div className="playDiv" onClick={() => playPart(index)}></div>
                        <div className="less_line_right">
                            <div className="less_line_times padding">
                                <div>
                                    <button onClick={() => changeTime.decrementStart(index)}
                                        onDoubleClick={() => changeTime.decrementStart(index, -0.5)}>
                                        {'<'}
                                    </button>
                                    {formatTime(linia.mp3Start)}
                                    <button onClick={() => changeTime.incrementStart(index)}
                                        onDoubleClick={() => changeTime.incrementStart(index, 0.5)}>
                                        {'>'}
                                    </button>
                                </div>
                                <div>
                                    <button onClick={() => changeTime.decrementEnd(index)}
                                        onDoubleClick={() => changeTime.decrementEnd(index, -0.5)}>
                                        {'<'}
                                    </button>
                                    {formatTime(linia.mp3End)}
                                    <button onClick={() => changeTime.incrementEnd(index)}
                                        onDoubleClick={() => changeTime.incrementEnd(index, 0.5)}>
                                        {'>'}
                                    </button>
                                </div>
                            </div>
                            <div className="less_line_tekstEn ">
                                <textarea id={"epPl" + index} name='textPl' value={linia.lineEn}
                                    onChange={event => handleChangeLineEn(index, event.target.value)}
                                    className="lesson_edit_textarea" />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
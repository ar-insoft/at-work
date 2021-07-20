import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
//import Lesson from './Lesson';
import { LessonEffect } from './LessonEffect'
import {Boxes} from './development/Boxes'

const liczbaLekcji = 65
class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            tabActiveIndex: 0,
            tabLess: this.fillArrayWithNumbers(liczbaLekcji + 1),
            saLekcje: Array(liczbaLekcji + 1).fill('')
        }
    }

    componentDidMount() {
        this.checkLesson('01')
    } 
    
    async checkLesson(epNo) {
        const jsonName = '/atWork/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        const contentType = response.headers.get("content-type")
        const contentTypeOk = contentType && contentType.indexOf("application/json") !== -1
        console.log('contentTypeOk ' + contentTypeOk)
        if (!response.ok || !contentTypeOk) {
            return
        }
        const saLekcje = [...this.state.saLekcje]
        saLekcje[1] = 'L'
        this.setState(saLekcje)
    }

    fillArrayWithNumbers = (n) => {
        var arr = Array.apply(null, Array(n));
        return arr.map(function (x, i) {
            if(i<10) return '0' + i
            return ''+i
        });
    }
    
    //tab1 = Array.from({ length: 59 }, (v, k) => k < 9 ? '0' + (k + 1) : '' + (k + 1));

    taby = () => [ //['01', '06', '20', '21', '22', '30']
        ...this.state.tabLess.map((lessonNo, index) => {//new Array(25)
            return ({
                menuItem: this.state.saLekcje[index] + ' ' + lessonNo +'',
                render: () =>
                    <Tab.Pane>
                        {/* {index} */}
                        <LessonEffect epNo={lessonNo} />
                    </Tab.Pane>
            })
        }),
        {
            menuItem: 'Boxes',
            render: () =>
                <Tab.Pane>
                    <Boxes />
                </Tab.Pane>
        },
    ]

    handleTabChange = (e, { activeIndex }) => this.setState({ tabActiveIndex: activeIndex })

    render() {

        return (
            <>
                <Tab panes={this.taby()} activeIndex={this.state.tabActiveIndex} onTabChange={this.handleTabChange}
                    menu={{ pointing: true, className: "wrapped" }}/>
                {/*  loading={this.state.loading} */}

            </>
        )
    }
}

export default Tabs
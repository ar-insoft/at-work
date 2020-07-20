import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
//import Lesson from './Lesson';
import { LessonEffect } from './LessonEffect'
import {Boxes} from './development/Boxes'

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            tabActiveIndex: 0,

        }
    }

    taby = () => [
        ...['01', '06', '20', '21', '22','30'].map((lessonNo, index) => {
            return ({
                menuItem: 'L ' + lessonNo,
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
                <Tab panes={this.taby()} activeIndex={this.state.tabActiveIndex} onTabChange={this.handleTabChange}/>
                {/*  loading={this.state.loading} */}

            </>
        )
    }
}

export default Tabs
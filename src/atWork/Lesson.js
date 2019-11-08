import React, { Component } from "react";
import { Grid, Container, Card, Reveal, Image, Label } from "semantic-ui-react";
import LineLabel from "./LineLabel";


class Lesson extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const textPl = "Narrator: Witamy ponownie w języku angielskim w pracy. Nadal jesteśmy w pierwszym tygodniu Anny w zajęte biura Tip Top Trading. Jak leci Anna?"
        const textEn = "Narrator:  Welcome back to English at Work. We're still in Anna's first week in the busy offices of Tip Top Trading. How's it going Anna?"
        return (
            <Container>
                <LineLabel textPl={textPl} textEn={textEn} />
            </Container>
        );
    }
}

export default Lesson;
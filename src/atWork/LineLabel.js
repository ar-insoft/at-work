import React from 'react'
import PropTypes from 'prop-types'
import { Label } from "semantic-ui-react";
import './LineLabel.css'

const LineLabel = props => {
    const { textPl, textEn } = props
    return (
        <div>
            <Label className="zdanie">{textPl}</Label>
            <Label className="zdanie translation">{textEn}</Label>
        </div>
    )
}

LineLabel.propTypes = {
    textPl: PropTypes.string.isRequired,
    textEn: PropTypes.string //.isRequired,
}

export default LineLabel
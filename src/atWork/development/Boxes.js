import React, { useState, useEffect } from 'react';
import './Boxes.css'

export const Boxes = () => {
    return (
        <div>
            Boxes
            <div className="boxes_first boxes padding">
                <div className="box1a padding"></div>
                <div className="box1b padding"></div>
                <div className="box1right padding"></div>
                <div className="box1middle padding"></div>
            </div>
            <div className="boxes_first boxes padding flex">
                <div className="box2a padding">1</div>
                <div className="box2b padding">2</div>
                <div className="box2right padding">3</div>
                <div className="box2middle padding">4</div>
            </div>
            <div className="boxes_first boxes padding flex">
                <div className="box3left flex">
                    <div className="box3no padding">No</div>
                    <div className="box3tekstPl padding">
                        tekst pl dfdskldnslfld fjsldfsdjldsj fsdlfjsdlk
                         jdslf dsjlf sdkfjds fl sdfklsd fl asdf lasdfj l
                        jfdskl fdklasdjf sdljsdf ljkl
                    </div>
                </div>
                <div className="box3right flex">
                    <div className="box3tekstEn padding">
                        tekstEn ksdfjkdsfjdsk
                    </div>
                    <div className="box3times padding">
                        times
                    </div>
                </div>
            </div>
        </div>
    )
}
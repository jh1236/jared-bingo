import React from "react";
import {ReactFitty} from "react-fitty";

interface BingoType {
    index: number,
    state: boolean[],
    setState: (state: boolean[]) => void,
    text: string,
    isTask: boolean
}


export function BingoSquare({index, setState, state, text, isTask}: BingoType) {
    const isCentreSquare = index === 12;
    const clicked = isCentreSquare || state[index];
    const name = localStorage.getItem("name");
    return <div style={{
        width: "20%",
        height: "20vmin",
        maxHeight: "16vh",
        backgroundColor: isCentreSquare ? 'cyan' : !clicked ? (isTask ? "gold" : 'white') : "grey",
        color: 'black',
        textAlign: "center",
        overflow: 'hidden',
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        textWrap: 'wrap'
    }}
                onClick={() => {
                    const s = state.slice();
                    s[index] = !(s[index] || name === null) || isCentreSquare;
                    setState(s);
                }}>
        <ReactFitty wrapText>{'   '}{isCentreSquare ? 'Free Space!!' : text}{'   '}</ReactFitty>
    </div>;
}
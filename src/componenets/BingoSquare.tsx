import React from "react";

interface BingoType {
    index: number,
    state: boolean[],
    setState: (state: boolean[]) => void,
    text: string,
    isTask: boolean
}


export function BingoSquare({index, setState, state, text, isTask}: BingoType) {
    const coolAsf = index === 12;
    const clicked = coolAsf || state[index];
    return <div style={{
        width: "20%",
        height: "150px",
        backgroundColor: coolAsf ? 'cyan' : !clicked ? (isTask ? "gold" : 'white') : "grey",
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
                    s[index] = !s[index] || coolAsf;
                    setState(s);
                }}>
        {coolAsf ? 'Free Space!!' : text}
    </div>;
}
import React from "react";
import {ReactFitty} from "react-fitty";
import {addYapaneseJenForName, setStateForName} from "@/components/ServerActions";
import {PopUp} from "@/components/PopUp";

interface BingoType {
    index: number,
    state: boolean[],
    setState: (state: boolean[]) => void,
    text: string,
    isTask: boolean,
    setYapaneseJen: (a: number) => void,
}


export function BingoSquare({index, setState, state, text, isTask, setYapaneseJen}: BingoType) {
    const isCentreSquare = index === 12;
    const [isOpen, setIsOpen] = React.useState(false);
    const clicked = isCentreSquare || state[index];
    const name = localStorage.getItem("name");
    const complete = (setOpen: (arg0: boolean) => void) => <button style={{border: 'solid 1px'}} key={index} onClick={() => {
        const s = state.slice();
        s[index] = !s[index];
        setState(s);
        setStateForName(name!, s)
        setOpen(false)
        let delta: number;
        if (isTask) {
            delta = s[index] ? 4 : -5;
        } else {
            delta = s[index] ? 2 : -3;
        }
        addYapaneseJenForName(name!, delta).then((newAmount) => {
            setYapaneseJen(newAmount)
        });
    }
    }>
        Mark Square As {state[index] ? 'Incomplete' : 'Complete'}
    </button>
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
                    if (name === null || isCentreSquare) return;
                    setIsOpen(true);
                }}>
        <ReactFitty wrapText>{'   '}{isCentreSquare ? 'Free Space!!' : text}{'   '}</ReactFitty>
        <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title='Bingo Square' description={`${text}. (Setting a square as complete pre-emptively carries a penalty.)`}
               buttons={[complete]}></PopUp>
    </div>;
}
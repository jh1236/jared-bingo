import React, {useEffect, useState} from "react";
import {addYapaneseJenForName, setStateForName} from "@/components/ServerActions";
import {PopUp} from "@/components/PopUp";

export type TaskType = 'basic' | 'task' | 'challenge';


interface BingoType {
    index: number,
    state: boolean[],
    setState: (state: boolean[]) => void,
    text: string,
    taskLevel: TaskType
    setYapaneseJen: (a: number) => void,
}

const taskLevelToCost: { [_ in TaskType]: number } = {
    basic: 2,
    task: 4,
    challenge: 8,
}
const taskLevelToColor: { [_ in TaskType]: string } = {
    basic: 'white',
    task: 'gold',
    challenge: '#cc55cc',
}


export function BingoSquare({index, setState, state, text, taskLevel, setYapaneseJen}: BingoType) {
    const isCentreSquare = index === 12;
    const [isOpen, setIsOpen] = React.useState(false);
    const clicked = isCentreSquare || state[index];
    const [name, setName] = useState<string | null>(null);
    useEffect(() => {
        setName(localStorage.getItem("name"));
    }, []);
    const complete =
        (setOpen: (arg0: boolean) => void) => <button style={{border: 'solid 1px'}} key={index} onClick={() => {
            const s = state.slice();
            s[index] = !s[index];
            setState(s);
            setStateForName(name!, s)
            setOpen(false)
            const delta = taskLevelToCost[taskLevel] * (state[index] ? -1 : 1);
            addYapaneseJenForName(name!, delta).then((newAmount) => {
                setYapaneseJen(newAmount)
            });
        }
        }>
            Mark Square
            As {state[index] ? 'Incomplete' : 'Complete'} ({state[index] ? `-` : '+'}{taskLevelToCost[taskLevel]})
        </button>
    return <div style={{
        width: "20%",
        height: "20vmin",
        maxHeight: "16vh",
        backgroundColor: isCentreSquare ? 'cyan' : !clicked ? taskLevelToColor[taskLevel] : "grey",
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
        <p style={{fontSize: '.75em'}}>{'   '}{isCentreSquare ? 'Free Space!!' : text}{'   '}</p>
        <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title='Bingo Square' description={`${text}.`}
               buttons={[complete]}></PopUp>
    </div>;
}
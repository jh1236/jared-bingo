'use client'

import React, {useEffect} from "react";
import {BingoSquare} from "@/components/BingoSquare";
import data from '../resources/squares.json'
import dictionary from '../resources/dictionary_keys.json'
import {addYapaneseJenForName, getBoardForName, setBoardForName, setStateForName} from "@/components/ServerActions";
import {YapaneseJen} from "@/components/YapaneseJen";
import {PopUp} from "@/components/PopUp";

function fakeRandom(seed: number) {
    //used so that we can have a seeded rng
    const x = Math.sin(Math.floor(seed)) * 10000;
    return x - Math.floor(x);
}

function winCheck(state: boolean[]): boolean {
    state[12] = true
    let passedLeftDiag = true;
    let passedRightDiag = true;
    for (let i = 0; i < 5; i++) {
        let passedHorizontal = true;
        let passedVertical = true;
        for (let j = 0; j < 5; j++) {
            passedHorizontal &&= state[i * 5 + j]
            passedVertical &&= state[i + j * 5]
        }
        if (passedHorizontal || passedVertical) {
            return true;
        }
        passedLeftDiag &&= state[i * 6]
        passedRightDiag &&= state[4 + 4 * i]
    }
    return passedLeftDiag || passedRightDiag;
}

const options = data.basic.concat(data.tasks);


function generateSquares(state: boolean[], setState: (state: boolean[]) => void, text: string[], isTask: boolean[], setYapaneseJen: (a: number) => void) {
    const squares = []

    for (let i = 0; i < 5; i++) {
        const next = []
        for (let j = 0; j < 5; j++) {
            const pos = i * 5 + j;
            next.push(<BingoSquare key={j} index={pos} state={state} setState={setState} text={text[pos]}
                                   isTask={isTask[pos]} setYapaneseJen={setYapaneseJen}/>);
        }
        squares.push(next);
    }

    return squares
}

function generateBingo(seed: number,
                       setText: (state: string[]) => void,
                       setIsTask: (isTask: boolean[]) => void
) {
    const text = Array(25).fill("")
    const isTask = Array(25).fill(false)
    const tempOptions = options.slice()
    let taskStart = data.basic.length;
    for (let i = 0; i < 25; i++) {
        const idx = Math.floor(fakeRandom(seed + i) * tempOptions.length);
        let tempText = tempOptions[idx]
        if (tempText.includes("$random")) {
            const idx2 = Math.floor(fakeRandom(seed + i + 123456) * dictionary.length);
            tempText = tempText.replace("$random", dictionary[idx2])
        }
        const isTaskIn = idx >= taskStart;
        if (!isTaskIn) {
            taskStart--;
        }
        tempOptions.splice(idx, 1)
        isTask[i] = isTaskIn
        text[i] = tempText
    }
    setText(text)
    setIsTask(isTask)
}


interface BingoBoxProps {
}

function generateNewBingo(setSeed: (state: number) => void,
                          setState: (state: boolean[]) => void,
                          setText: (state: string[]) => void,
                          setIsTask: (isTask: boolean[]) => void) {
    const name = localStorage.getItem("name");
    const newSeed = Math.random() * 123456789
    const init = Array(25).fill(false)
    init[12] = true
    setSeed(newSeed)
    setBoardForName(name!, newSeed)
    setState(init)
    setStateForName(name!, init)
    generateBingo(newSeed, setText, setIsTask);
}

export function BingoBox({}: BingoBoxProps) {
    const [yapaneseJen, setYapaneseJen] = React.useState<number>(0);
    const [isOpen, setIsOpen] = React.useState(false)
    const init = Array(25).fill(false)
    init[12] = true
    const [state, setState] = React.useState<boolean[]>(init);
    const name = localStorage.getItem("name");
    const [seed, setSeed] = React.useState<number>(0);
    const [isTask, setIsTask] = React.useState<boolean[]>(Array(25).fill(false));
    const [text, setText] = React.useState<string[]>(Array(25).fill(""));
    useEffect(() => {
        if (name) {
            getBoardForName(name).then((b) => {
                if (b.board) {
                    setSeed(b.board)
                    generateBingo(b.board, setText, setIsTask);
                } else if (seed === 0) {
                    generateNewBingo(setSeed, setState, setText, setIsTask)
                }
                if (b.state) setState(b.state);
            })
        } else {
            const text = Array(25).fill("")
            text[17] = "Login by writing your name here"
            text[22] = "⬇️"
            setText(text)
        }
    }, []);
    useEffect(() => {
        if (winCheck(state)) {
            setIsOpen(true);
            addYapaneseJenForName(name!, 20).then((newAmount) => {
                setYapaneseJen(newAmount)
            });
            const newSeed = Math.random() * 123456789
            setSeed(newSeed)
            setBoardForName(name!, newSeed)
            generateBingo(newSeed, setText, setIsTask);
            setState(init)
            setStateForName(name!, init)
        }
    }, [state]);
    init[12] = true
    const squares = generateSquares(state, setState, text, isTask, setYapaneseJen)

    return <>
        <div style={{height: '100vmin', maxHeight: "80vh"}}>
            {squares.map((v, i) => (
                <div style={{display: 'flex', flexDirection: 'row'}} key={i}>{v}</div>
            ))}
        </div>
        <div style={{height: "20%"}}>
            <YapaneseJen yapaneseJen={yapaneseJen} setYapaneseJen={setYapaneseJen}
                         regenBoard={() => generateNewBingo(setSeed, setState, setText, setIsTask)}></YapaneseJen>
        </div>
        <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title='YIPE!!!!'
               description='You have completed a bingo!!'
               exitText='Fuck yea, let me
    see my new
    card!'></PopUp>
    </>;
}
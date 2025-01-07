'use client'

import React, {useEffect} from "react";
import {BingoSquare} from "@/componenets/BingoSquare";
import data from '../resources/squares.json'
import dictionary from '../resources/dictionary_keys.json'
import {addYapaneseJenForName, getBoardForName, setBoardForName, setStateForName} from "@/componenets/ServerActions";

function fakeRandom(seed: number) {
    //used so that we can have a seeded rng
    const x = Math.sin(Math.floor(seed)) * 10000;
    return x - Math.floor(x);
}

function winCheck(state: boolean[]): boolean {
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


function generateSquares(state: boolean[], setState: (state: boolean[]) => void, text: string[], isTask: boolean[]) {
    const squares = []

    for (let i = 0; i < 5; i++) {
        const next = []
        for (let j = 0; j < 5; j++) {
            const pos = i * 5 + j;
            next.push(<BingoSquare key={j} index={pos} state={state} setState={setState} text={text[pos]}
                                   isTask={isTask[pos]}/>);
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


export function BingoBox() {
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
                    const newSeed = Math.random() * 123456789
                    setSeed(newSeed)
                    setBoardForName(name!, newSeed)
                    generateBingo(newSeed, setText, setIsTask);
                }
                if (b.state) setState(b.state);
            })
        }
    }, []);
    useEffect(() => {
        if (winCheck(state)) {
            alert("YIPE!!")
            addYapaneseJenForName(name!, 1).then(() => location.reload());
            const newSeed = Math.random() * 123456789
            setSeed(newSeed)
            setBoardForName(name!, newSeed)
            generateBingo(newSeed, setText, setIsTask);
            setState(init)
            setStateForName(name!, init)
        }
    }, [state]);
    init[12] = true
    const squares = generateSquares(state, setState, text, isTask)

    return <div>
        {squares.map((v, i) => (
            <div style={{display: 'flex', flexDirection: 'row'}} key={i}>{v}</div>
        ))}
    </div>;
}
import React, {useEffect} from "react";

const defaultValue = 'Write something here!';

import classes from "./button.module.css";
import {addYapaneseJenForName, getYapaneseJenForName} from "@/components/ServerActions";
import Link from "next/link";

interface YapaneseJenProps {
    yapaneseJen: number;
    setYapaneseJen: (yapaneseJen: number) => void;
    regenBoard: () => void;
}

export function YapaneseJen({yapaneseJen, setYapaneseJen, regenBoard}: YapaneseJenProps) {
    const name = localStorage.getItem("name");
    const ref = React.useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYapaneseJen)
        }
    })
    if (name === null) {
        return <div style={{
            alignItems: "center",
            width: '100%',
            textAlign: "center"
        }}>
            <br></br>
            <br></br>
            <label htmlFor='namePicker'>Name: </label>
            <input id='namePicker' ref={ref} defaultValue={defaultValue} style={{color: 'black',}}></input>
            <br></br>
            <br></br>
            <button className={classes.button} role="button" onClick={
                () => {
                    const name = ref.current?.value ?? null;
                    if (!name || name === defaultValue) return;
                    localStorage.setItem('name', name);
                    location.reload();
                }
            }>Submit!
            </button>
        </div>;
    }

    return <div style={{
        alignItems: "center",
        width: '100%',
        textAlign: "center"
    }}>
        <br></br>
        <br></br>
        <p>My name is {name}. I have {yapaneseJen} Yappanese Jen!</p>
        <br></br>
        <br></br>
        <button
            className={classes.button}
            onClick={() => {
                regenBoard()
                addYapaneseJenForName(name, -1).then(setYapaneseJen)
            }}
        >New Board {yapaneseJen > 0 ? '(-1)' : null}
        </button>
        <br></br>
        <br></br>
        <Link href='/shop'>
            <button
        className={classes.button}
        >To Shop
            </button>
        </Link>
        <br></br>
        <br></br>
        <Link href='/casino'>
            <button
                className={classes.button}
            >To The Cas!!
            </button>
        </Link>
    </div>;
}
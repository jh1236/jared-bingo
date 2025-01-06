'use client'

import React from "react";

const defaultValue = 'Write something here!';

import classes from "./button.module.css";

export function YapaneseJen() {
    const name = localStorage.getItem("name");
    const ref = React.useRef<HTMLInputElement | null>(null);
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
        <p>My name is {name}</p>
        <br></br>
        <br></br>
        <button
            className={classes.button}
            onClick={
                () => {
                    localStorage.removeItem('name');
                }
            }
        >clear
        </button>
    </div>;
}
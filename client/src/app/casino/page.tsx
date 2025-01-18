'use client'
import React, {RefObject, useEffect} from "react";
import {addYapaneseJenForName, getYapaneseJenForName} from "@/components/ServerActions";
import Link from "next/link";
import classes from "./casino.module.css";
import Image from "next/image";
import {useIntervalMagic} from "@/utils";


const choices = [
    '🍒',
    '🌸',
    '7️⃣',
    '🐉',
    '💌',
    '⚜️',
    '🦞',
    '🐔',
    '🪙'
]

export default function TestPage() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const [spinning, setSpinning] = React.useState<number>(0);
    const [counter, setCounter] = React.useState<number>(0)
    const [winEmoji, setwinEmoji] = React.useState<string>(null)
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
        }

    }, [name])


    useIntervalMagic(looped, spinning !== 0 ? 80 : null);


    if (!name) {
        location.href = "/"
        return <></>
    }

    function looped() {
        setCounter((counter + 1) % 9)
        const next = (counter + 1) % 9;
        const prev = (counter + 8) % 9; //same as - 1

        const prevElement = document.getElementById(`box${prev % 3}${Math.floor(prev / 3)}`)!;
        const element = document.getElementById(`box${counter % 3}${Math.floor(counter / 3)}`)!;
        const nextElement = document.getElementById(`box${next % 3}${Math.floor(next / 3)}`)!;
        if (element && nextElement && spinning <= 3 && spinning !== 0) {
            element.className = spinning === -1 ? classes.animated : classes.done
            element.textContent = choices[Math.floor(Math.random() * choices.length)]
            if (spinning > 0) {
                const c = Math.random();
                if (spinning === 1) {
                    if (c < 0.005)
                        setwinEmoji('🪙')
                    if (c < 0.15) {
                        setwinEmoji(element.textContent)
                    }
                }
                if (winEmoji) {
                    element.textContent = winEmoji
                } else if (spinning === 3) {
                    while (element.textContent === prevElement.textContent) {
                        element.textContent = choices[Math.floor(Math.random() * choices.length)]
                    }
                }
                setSpinning(spinning + 1)
            } else {
                nextElement.className = classes.hidden
            }
        } else if (spinning === 4) {
            if (winEmoji === '🪙') {
                addYapaneseJenForName(name!, 100).then(setYappaneseJen)
            } else if (winEmoji === '🪙') {
                addYapaneseJenForName(name!, 4).then(setYappaneseJen)
            }
            setSpinning(0)
            setCounter(counter + 5) //same as removing 3, ensures that the 3 icons that are frozen are used again
        }
    }


    return (
        <div>
            <Image src='/gambl.png' alt={"cooler logo"} width={500} height={500}></Image>
            <div style={{height: "100px"}}>
                <div style={{
                    borderRadius: '10px',
                    backgroundColor: '#1c1c1c',
                    textAlign: "center",
                    margin: '10px',
                    fontSize: '32px',
                    position: "absolute",
                    width: 'calc(50% - 15px)',
                    height: '60px',
                    border: '2px black solid',
                    right: '0',
                    padding: '0px'
                }}>
                    <p style={{position: "relative", top: "2px"}}>
                        {yappaneseJen} <img style={{display: 'inline'}} src='/small_jenny.jpg' width='50'/>
                    </p>
                </div>

                <Link href='/'>
                    <button className={classes.rainbow}>
                        to bingo
                    </button>
                </Link>
            </div>


            <div style={{height: '80vh'}}>
                <div style={{
                    position: 'fixed',
                    left: 'calc(50% - 250px)',
                    top: 'calc(50% - 150px)',
                    width: '500px',
                    height: '400px',
                    textAlign: 'center',
                    borderRadius: '30px',
                    fontSize: '40px'
                }}>
                    <div style={{
                        width: '500px',
                        height: '300px',
                        textAlign: 'center',
                        borderRadius: '30px',
                        fontSize: '40px',
                        backgroundColor: 'blue'
                    }}>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 120px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box00' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 120px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box01' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% - 120px)',
                                top: '45%',

                                width: '60px',
                                alignItems: 'center',
                            }}
                            id='box02' className={classes.hidden}>
                            3
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 30px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box10' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 30px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box11' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% - 30px)',
                                top: '45%',
                                width: '60px',
                                alignItems: 'center',
                            }}
                            id='box12' className={classes.hidden}>
                            3
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% + 60px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box20' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% + 60px)',
                            top: '45%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box21' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% + 60px)',
                                top: '45%',
                                width: '60px',
                                alignItems: 'center',
                            }}
                            id='box22' className={classes.hidden}>
                            3
                        </div>
                    </div>
                    <button className={classes.shopButton} onClick={() => {
                        if (spinning === 0) {
                            setSpinning(-1)
                            setwinEmoji(null)
                        } else if (spinning === -1) {
                            setSpinning(1)
                            addYapaneseJenForName(name, -1).then(setYappaneseJen)
                        }

                    }}>{
                        spinning ? '1 Jenny to see results' : winEmoji ? (winEmoji === '🪙' ? 'JACKPOT!!! have 100 Jennies' : 'YIPE! have 4 Jennies') : 'Start the spin!!'
                    }</button>
                </div>

            </div>
        </div>
    )
}

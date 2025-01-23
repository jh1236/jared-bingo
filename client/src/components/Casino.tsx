'use client'

import {
    addItemForName,
    addYapaneseJenForName,
    getYapaneseJenForName,
    SpendJenniesForName
} from "@/components/ServerActions";
import React, {useEffect} from "react";
import {useIntervalMagic} from "@/utils";
import classes from "./casino.module.css";
import Image from "next/image";
import Link from "next/link";

const NEAR_MISS = 0.6
const WIN_RATIO = 0.4
const WIN_DELAY = 17  // how long the slot machine takes to announce the win

const emojis: {
    [key: string]: { reward: number | ((name: string) => void); odds: number; message?: string };
} = {
    '💸': {
        odds: 1,
        reward: 500,
        message: 'HOLY FUCK!! FIVE HUNDRED JENNIES!!!!'
    },
    '🪙': {
        odds: 15,
        reward: 100,
        message: 'JACKPOT!!! Take 100 Jennies!'
    },
    '7️⃣': {
        odds: 30,
        reward: 77,
        message: 'Triple 7\'s! Enjoy 77 Jennies'
    },
    '☕': {
        odds: 60,
        reward: (name: string) => addItemForName(name!, 'coffee'),
        message: 'Jared will shout you a drink from maccas!'
    },
    '🪑': {
        odds: 60,
        reward: (name: string) => addItemForName(name!, 'front_seat'),
        message: 'Have a front seat'
    },
    '🪟': {
        odds: 80,
        reward: (name: string) => addItemForName(name!, 'windows'),
        message: 'Have a free window selection'
    },
    '💿': {
        odds: 90,
        reward: (name: string) => addItemForName(name!, 'song'),
        message: 'Have a song queue!'
    },
    '💣': {
        odds: 100,
        reward: -5,
        message: 'Fuck you! -5 Jennies!'
    },
    '🎇': {
        odds: 100,
        reward: 0,
        message: 'Have some confetti (and no prize)'
    },
    '🐴': {
        odds: 100,
        reward: (name: string) => addItemForName(name!, 'pony'),
        message: 'NEIGH!!!!! +1 Horses',
    },
    '🔁': {
        odds: 110,
        reward: 1,
        message: 'And again! (+1 Jennies)'
    },
    '🍒': {
        odds: 45,
        reward: 4
    },
    '🌸': {
        odds: 45,
        reward: 4
    },
    '⚜️': {
        odds: 45,
        reward: 4
    },
    '🦞': {
        odds: 45,
        reward: 4
    },
    '🥾': {
        odds: 45,
        reward: 4
    }
}

function getWinEmoji(): string {
    const choices = []
    for (const i in emojis) {
        for (let j = 0; j < emojis[i].odds; j++) {
            choices.push(i)
        }
    }
    return choices[Math.floor(Math.random() * choices.length)]
}

export function Casino() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const [spinning, setSpinning] = React.useState<number>(-1);
    const [nearMiss, setNearMiss] = React.useState<boolean>(false)
    const [confetti, setConfetti] = React.useState<boolean>(false)
    const [counter, setCounter] = React.useState<number>(0)
    const [winEmoji, setWinEmoji] = React.useState<string>(null)
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
        const threeForward = (counter + 3) % 9;
        const prev = (counter + 8) % 9; //same as - 1

        const prevElement = document.getElementById(`box${prev % 3}${Math.floor(prev / 3)}`)!;
        const element = document.getElementById(`box${counter % 3}${Math.floor(counter / 3)}`)!;
        const nextElement = document.getElementById(`box${next % 3}${Math.floor(next / 3)}`)!;
        const threeForwardElement = document.getElementById(`box${threeForward % 3}${Math.floor(threeForward / 3)}`)!;
        if (element && nextElement && spinning <= 3 && spinning !== 0) {
            const allChoices = Object.keys(emojis)
            element.className = spinning === -1 ? classes.animated : classes.done
            element.textContent = allChoices[Math.floor(Math.random() * allChoices.length)]
            if (spinning > 0 && spinning <= 3) {
                const c = Math.random();
                if (spinning === 1 && c < WIN_RATIO) {
                    const emoji = getWinEmoji();
                    setWinEmoji(emoji)
                    element.textContent = emoji
                } else if (winEmoji) {
                    element.textContent = winEmoji
                }
                if (spinning === 3) {
                    if (winEmoji && c < NEAR_MISS && winEmoji !== '🎇') {
                        setSpinning(2)
                        setNearMiss(true)
                        element.className = classes.nearly;
                        let w = winEmoji;
                        while (winEmoji === w) {
                            w = allChoices[Math.floor(Math.random() * allChoices.length)]
                        }
                        threeForwardElement.textContent = w
                        threeForwardElement.className = classes.evilHackyFix;
                        setWinEmoji(null);
                    } else if (winEmoji) {
                        element.className = classes.final;
                    } else {
                        while (element.textContent === prevElement.textContent) {
                            element.textContent = allChoices[Math.floor(Math.random() * allChoices.length)]
                        }
                    }
                }
            } else {
                nextElement.className = classes.hidden
            }
        } else if (spinning >= WIN_DELAY || (!nearMiss && !winEmoji && spinning >= 3)) {
            if (winEmoji) {
                const reward = emojis[winEmoji].reward;
                if (typeof (reward) === 'number') {
                    addYapaneseJenForName(name!, reward).then(setYappaneseJen)
                } else {
                    reward(name!)
                }
                setConfetti(true)
            }
            setSpinning(0)
            setCounter(counter + 5) //same as removing 3, ensures that the 3 icons that are frozen are used again
        }
        if (spinning > 0 && (spinning < WIN_DELAY && (winEmoji || spinning <= 3 || nearMiss))) {
            setSpinning(spinning + 1)
        }
    }


    const sum = Object.keys(emojis).filter(k => typeof (emojis[k].reward) === 'number').map(k => emojis[k].reward * emojis[k].odds * (k === '🎇' ? 1 : (1 - NEAR_MISS))).reduce((a, b) => a + b, 0)
    const count = Object.keys(emojis).map(k => emojis[k].odds).reduce((a, b) => a + b, 0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const avg = sum / count * WIN_RATIO;
    return (
        <div>
            <Image src='/confett.gif' width={100}
                   height={100}
                   alt='Fuckin Confetti'
                   style={{
                       position: "absolute",
                       left: 0,
                       top: 0,
                       width: '100vw',
                       height: '100vh',
                       display: confetti ? 'block' : 'none'
                   }}></Image>
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
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box00' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 120px)',
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box01' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% - 120px)',
                                top: '48%',

                                width: '60px',
                                alignItems: 'center',
                            }}
                            id='box02' className={classes.hidden}>
                            3
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 30px)',
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box10' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% - 30px)',
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box11' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% - 30px)',
                                top: '48%',
                                width: '60px',
                                alignItems: 'center',
                            }}
                            id='box12' className={classes.hidden}>
                            3
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% + 60px)',
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box20' className={classes.hidden}>
                            1
                        </div>
                        <div style={{
                            position: 'fixed',
                            left: 'calc(50% + 60px)',
                            top: '48%',
                            width: '60px',
                            alignItems: 'center',
                        }} id='box21' className={classes.hidden}>
                            2
                        </div>
                        <div
                            style={{
                                position: 'fixed',
                                left: 'calc(50% + 60px)',
                                top: '48%',
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
                            setWinEmoji(null)
                            setConfetti(false)
                            setNearMiss(false)
                        } else if (spinning === -1) {
                            SpendJenniesForName(name, 1).then(([wealth, success]) => {
                                setYappaneseJen(wealth)
                                if (success) {
                                    setSpinning(1)
                                } else {
                                    alert('Broke Fuck!')
                                }
                            })
                        }
                    }}>{
                        spinning ? '1 Jenny to see results' : winEmoji ? (emojis[winEmoji]?.message ?? 'YIPE! have 4 Jennies') : nearMiss ? 'Close!! Better luck next time' : 'Start the spin!!'
                    }</button>
                </div>

            </div>
        </div>
    )
}


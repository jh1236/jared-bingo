import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import React, {Fragment, useEffect, useState} from "react";
import Link from "next/link";
import classes from "@/components/playground/playground.module.css";

const playgroundFields = {
    "playability": "Playability",
    "slide": "Slide",
    "swing": "Swing",
    "aesthetics": "Aesthetics",
    "thematicConsistency": "Thematic Consistency",
    "heightAccessibility": "Height Accessibility",
    "lighting": "Lighting",
    "variety": "Variety",
}

export function PlaygroundRater() {
    const [name, setName] = useState<string | null>("");
    useEffect(() => {
        const tempName = localStorage.getItem("name");
        setName(tempName);
        if (!tempName) {
            location.href = "/"
        }
    }, []);

    return <>
        <Image src="/baclgroun.png" alt="" height={200} width={500}
               style={{zIndex: -99, top: 0, width: "100%", height: "100%", position: "absolute"}}></Image>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: 20}}>
            <Image src="/playgrouynd.png" alt="" height={200} width={500}></Image>
            <Link href='/'>
                <button style={{width: 100}} className={classes.rainbow}>
                    to bingo
                </button>
            </Link>
            <iframe name="nothing" style={{display: 'none'}}></iframe>
            <form target="nothing" style={{display: "flex", flexDirection: "column", alignItems: "center", margin: 20}}
                  action="https://api.jh1236.top/api/playground" method="POST">
                <input type="hidden" value={name!} name="name"/>
                <TextField style={{backgroundColor: '#ffffff33'}} color="secondary"  margin="normal" label="Playground Name" name="playground" variant="filled"/>
                {Object.entries(playgroundFields).map(([k, v]) => <Fragment key={k}><label style={{fontSize: '1.3em'}}
                                                                                           htmlFor={k}>{v}: </label>
                    <Rating
                        size="large"
                        precision={0.5}
                        name={k}
                    /></Fragment>)
                }
                <div style={{display: "inline"}}>
                    <label style={{fontSize: '1.3em',}} htmlFor="zipline">Has Zipline?</label>
                    <Checkbox name="zipline"/>
                </div>
                <button type="submit" style={{
                    margin: 10,
                    backgroundColor: 'red',
                    padding: 10,
                    fontSize: '1.5em',
                    fontWeight: 600,
                    color: '#00ff00'
                }}>Let&apos;s Play!!
                </button>
            </form>

        </div>
    </>
}
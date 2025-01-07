import React from "react";
import {BingoBox} from "@/components/BingoBox";


export default function Home() {
    return (
        <div style={{height: "100vh"}}>
            <img src='/coollogo_com-5458458.gif' alt={'A sick logo saying Jared Bingo but it\'s on fire'}/>
            <BingoBox></BingoBox>
        </div>
    );
}

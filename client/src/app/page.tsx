import React from "react";
import {BingoBox} from "@/components/BingoBox";
import Image from "next/image";


export default function Home() {
    return (
        <div style={{height: "100vh"}}>
            <Image src='/coollogo_com-5458458.gif' alt={'A sick logo saying Jared Bingo but it\'s on fire'} width={300} height={300}/>
            <BingoBox></BingoBox>
        </div>
    );
}

'use client'


import {BingoBox} from "@/components/BingoBox";
import {YapaneseJen} from "@/components/YapaneseJen";
import React from "react";

export function BingoManager() {


    return (
        <>
            <div style={{height: '100vmin', maxHeight: "80vh"}}>
                <BingoBox yapaneseJen={yapaneseJen} setYapaneseJen={setYapaneseJen}></BingoBox>
            </div>
        </>
    )
}
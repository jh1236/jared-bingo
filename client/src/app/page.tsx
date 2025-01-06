import {BingoBox} from "@/componenets/BingoBox";
import {YapaneseJen} from "@/componenets/YapaneseJen";


export default function Home() {
    return (
        <div style={{height: "100vh"}}>
            <div style={{height: '100vmin'}}>
                <BingoBox></BingoBox>
            </div>
            <div style={{height: "20%"}}>
                <YapaneseJen></YapaneseJen>
            </div>
        </div>
    );
}

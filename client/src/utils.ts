import dictionary from "@/resources/dictionary_keys.json";
import {useEffect, useRef} from "react";

export function fakeRandom(seed: number) {
    //used so that we can have a seeded rng
    const x = Math.sin(Math.floor(seed)) * 10000;
    return x - Math.floor(x);
}


export function getRandomWord(seed?: number) {
    if (!seed) {
        seed = Math.random();
    } else {
        seed = fakeRandom(seed + 12345);
    }
    const idx = Math.floor(seed * dictionary.length);
    return dictionary[idx]
}


//https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useIntervalMagic(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
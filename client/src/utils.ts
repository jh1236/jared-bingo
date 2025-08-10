import dictionary from "@/resources/dictionary_keys.json";
import roads from "@/resources/roads.json";
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

export function getRandomRoad(seed?: number) {
    if (!seed) {
        seed = Math.random();
    } else {
        seed = fakeRandom(seed + 12345);
    }
    const idx = Math.floor(seed * roads.length);
    return roads[idx]
}


//https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useIntervalMagic(callback: () => void, delay: number | null) {
    const savedCallback = useRef<(() => void) | null>(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current!();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
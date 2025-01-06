const site = `http://flun.in:5000/api`;


export function getYapaneseJenForName(name: string): Promise<number> {
    return fetch(`${site}/score?name=${name}`, {
        method: "GET",
    }).then((response: Response) => response.json()).then((data: any) => {
        return data.score;
    })
}

export function addYapaneseJenForName(name: string, score: number): Promise<Response> {
    return fetch(`${site}/score`, {
        method: "POST",
        body: JSON.stringify({name: name, score: score}),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export function getBoardForName(name: string): Promise<{board: number, state: boolean[]}> {
    return fetch(`${site}/board?name=${name}`, {
        method: "GET",
    }).then((response: Response) => response.json().then((data: any) => {console.log(data); return data}))
}

export function setBoardForName(name: string, board: number): Promise<Response> {
    return fetch(`${site}/board`, {
        method: "POST",
        body: JSON.stringify({name: name, board: board}),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
export function setStateForName(name: string, state: boolean[]): Promise<Response> {
    return fetch(`${site}/state`, {
        method: "POST",
        body: JSON.stringify({name: name, state: state}),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
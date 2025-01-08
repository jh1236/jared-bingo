const site = `http://flun.in:5000/api`;

function stateToInt(state: boolean[]) {
    let out = 0;
    for (let i = 0; i < state.length; i++) {
        if (!state[i]) continue;
        out += 2 ** i
    }
    return out;
}

function intToState(state: number) {
    const out = [];
    for (let i = 0; i < 25; i++) {
        out.push(((state >> i) & 1) === 1);
    }
    return out;
}


export function getYapaneseJenForName(name: string): Promise<number> {
    return fetch(`${site}/score?name=${name}`, {
        method: "GET",
    }).then((response: Response) => response.json()).then((data: any) => {
        return data.score;
    })
}

export function addYapaneseJenForName(name: string, score: number): Promise<number> {
    return fetch(`${site}/score`, {
        method: "POST",
        body: JSON.stringify({name: name, score: score}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response: Response) => response.json()).then((data: any) => {
        return data.score;
    });
}

export function getBoardForName(name: string): Promise<{ board: number, state: boolean[] }> {
    return fetch(`${site}/board?name=${name}`, {
        method: "GET",
    }).then((response: Response) => response.json().then((data: any) => {
        data.state = intToState(data.state);
        return data;
    }))
}

export function getInventoryForName(name: string): Promise<{ formattedName: string; name: string, cost: number, image: string }[]> {
    return fetch(`${site}/inventory?name=${name}`, {
        method: "GET",
    }).then((response: Response) => response.json().then((data: any) => {
        return data.inventory;
    }))
}

export function getPurchasableItems(): Promise<{ formattedName: string; name: string, cost: number, image: string }[]> {
    return fetch(`${site}/purchasable`, {
        method: "GET",
    }).then((response: Response) => response.json().then((data: any) => {
        return data.items;
    }))
}

export function purchaseItemForName(name: string, item: string): Promise<[{
    score: number,
    inventory: string[]
}, boolean]> {
    return fetch(`${site}/purchase`, {
        method: "POST",
        body: JSON.stringify({name, item}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response: Response) => {
        return response.json().then((out: any) => {
            return [out, response.ok]
        })
    })
}

export function consumeItemForName(name: string, item: string): Promise<[string[], boolean]> {
    return fetch(`${site}/use_item`, {
        method: "POST",
        body: JSON.stringify({name, item}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response: Response) => {
        return response.json().then((out: any) => {
            return [out, response.ok]
        })
    })
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
        body: JSON.stringify({name: name, state: stateToInt(state)}),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

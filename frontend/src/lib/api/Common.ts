
export function validate(res: Response, message: string) {
    if (!res.ok) {
        throw new Error(`${message}: ${res.status} ${res.statusText}`);
    }
}


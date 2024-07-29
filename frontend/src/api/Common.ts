
export const API_URL = import.meta.env.VITE_API_URL

export function validate(res: Response, message: string) {
    if (!res.ok) {
        throw new Error(`${message}: ${res.status} ${res.statusText}`);
    }
}


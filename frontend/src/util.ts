
const apiPath = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path: string) => `${apiPath}${path}`

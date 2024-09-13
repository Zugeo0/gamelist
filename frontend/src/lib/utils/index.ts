// place files you want to import through the `$lib` alias in this folder.

export function formatDate(date: Date): string {
    let month = '';
    switch (date.getMonth()) {
        case 0:  month = 'Jan'; break;
        case 1:  month = 'Feb'; break;
        case 2:  month = 'Mar'; break;
        case 3:  month = 'Apr'; break;
        case 4:  month = 'May'; break;
        case 5:  month = 'Jun'; break;
        case 6:  month = 'Jul'; break;
        case 7:  month = 'Aug'; break;
        case 8:  month = 'Sep'; break;
        case 9:  month = 'Oct'; break;
        case 10: month = 'Nov'; break;
        case 11: month = 'Dec'; break;
    }
    return `${date.getDate()}. ${month} ${date.getFullYear()}`
}

export function pad(str: string, char: string, size: number): string {
    for (let i = str.length; i < size; i++) {
        str = char + str;
    }
    return str;
}

export function zeroPad(num: number, size: number): string {
    return pad(num.toString(), "0", size);
}

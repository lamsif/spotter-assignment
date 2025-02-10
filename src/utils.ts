
export function DateToString(date: Date): string {
    const usedDate = new Date(date);
    usedDate.setMinutes(usedDate.getMinutes() - usedDate.getTimezoneOffset());
    return usedDate.toISOString().substring(0, 10);
}

export function FormatMinutes(minutes: number): string {

    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);

    return (h > 0 ? `${h}h ` : '') + (m > 0 ? ` ${m}m` : '');

}

export function ToCapitalizedCase(value: string) {
    return value[0].toUpperCase() + value.slice(1);
}

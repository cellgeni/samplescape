

const SortText = (a: any, b: any, property: string) => {

    const resolve = (o: any, p: string, s: string = '.'): any => {
        return p.split(s).reduce((prev: any, curr: any) => prev?.[curr], o)
    }

    const value_a = resolve(a, property);
    const value_b = resolve(b, property);
    if (value_a == null && value_b != null) return 1;
    if (value_a != null && value_b == null) return -1;
    if (value_a == null && value_b == null) return 0;
    return value_a.localeCompare(value_b);
};

export default SortText;
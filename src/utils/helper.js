export function formatDate(value) {
    // Remove all non-digits
    value = value.replace(/\D+/g, '');

    // Format as "dd/MM/yyyy"
    if (value.length <= 2) {
        return value;
    } else if (value.length <= 4) {
        return `${value.slice(0, 2)}.${value.slice(2)}`;
    } else {
        return `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
    }
}
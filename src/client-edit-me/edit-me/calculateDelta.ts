export function calculateDelta({ prevQuote, latestQuote }: { prevQuote?: number, latestQuote: number }) {
    if (prevQuote && latestQuote) {
        const delta = ((latestQuote - prevQuote) / prevQuote) * 100

        const positive = delta > 0

        // Return a string instead of a number because if the delta is an integer, we lose the `.toFixed(3)` decimal points
        // e.g. `Number('0.000')` resolves to 0 as opposed to 0.000
        // Ensures the delta always has 3 decimal points (thereby avoiding janky width changes)
        return `${positive ? "+" : ""}${delta.toFixed(3)}`
    } else {
        // Will be the case when we first connect to the server (and therefore do not have a prevQuote to compare to)
        return 'loading'
    }
}

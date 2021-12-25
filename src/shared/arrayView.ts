export class ArrayView<T> {
    constructor(
        src: ArrayLike<T> | ArrayView<T>,
        start: number = 0, end: number = -1,
    ) {
        this.source = src
        this.start = start
        this.end = end === -1 ? src.length : end
    }

    at(offset: number): T | undefined {
        const index = this.start + offset
        if (offset >= this.end) return undefined
        return 'at' in this.source ? this.source.at(index) :
            this.source[index]
    }

    ats(offset: number): T {
        const val = this.at(offset)
        if (typeof val === undefined) {
            throw new RangeError('Index out of range.')
        }
        return <T>val
    }

    get length(): number {
        return this.end - this.start
    }

    private source: ArrayLike<T> | ArrayView<T>
    private start: number
    private end: number
}

import { customType } from 'drizzle-orm/pg-core';
import { Range, RANGE_LB_INC, RANGE_UB_INC, parse as rangeParse, serialize as rangeSerialize } from 'postgres-range';

export interface RangeBound<T> {
    value: T;
    inclusive: boolean;
}

export class Int4Range {
    constructor(public readonly range: Range<number>) {}

    get start(): RangeBound<number> | null {
        return this.range.lower != null
            ? {
                  value: this.range.lower,
                  inclusive: this.range.isLowerBoundClosed(),
              }
            : null;
    }

    get end(): RangeBound<number> | null {
        return this.range.upper != null
            ? {
                  value: this.range.upper,
                  inclusive: this.range.isUpperBoundClosed(),
              }
            : null;
    }

    static from(start: number, end: number): Int4Range {
        return new Int4Range(new Range(start, end, RANGE_LB_INC | RANGE_UB_INC));
    }
}

export const int4range = customType<{
    data: Int4Range;
}>({
    dataType: () => 'int4range',
    fromDriver: (value: unknown): Int4Range => {
        if (typeof value !== 'string') {
            throw new Error('Expected string');
        }

        const parsed = rangeParse(value, (val) => parseInt(val, 10));
        return new Int4Range(parsed);
    },
    toDriver: (value: Int4Range): string => rangeSerialize(value.range),
});

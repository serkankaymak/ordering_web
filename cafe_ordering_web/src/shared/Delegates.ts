export type Predicate<T> = (obj: T | null) => boolean;
export type Func<T, R> = (obj: T | null) => R;
export type Action<T> = (obj: T | null) => void;
export type Action2<T1, T2> = (obj1: T1 | null, obj2: T2 | null) => void;
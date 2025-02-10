import { Predicate, Func, Action } from "./Delegates";

class ItemWrapper<T> {
    item: T | null;
    index: number;
    next: ItemWrapper<T> | null = null;
    previous: ItemWrapper<T> | null = null;

    constructor(item: T | null, index: number) {
        this.item = item;
        this.index = index;
    }
}

export default class ArrayListStream<T> {
    private innerList: (T | null)[] = [];
    toList(): T[] {
        return this.innerList.filter((item): item is T => item !== null);
    }

    static fromEmpty<T>(): ArrayListStream<T> { const arrayListStream = new ArrayListStream<T>(); return arrayListStream; }
    static fromObject<T>(obj: T): ArrayListStream<T> {
        const arrayListStream = new ArrayListStream<T>();
        arrayListStream.add(obj);
        return arrayListStream;
    }


    static fromNumbers(count: number): ArrayListStream<number> {
        const arrayListStream = new ArrayListStream<number>();
        for (let i = 1; i <= count; i++) {
            arrayListStream.add(i);
        }
        return arrayListStream;
    }

    static fromList<T>(list: T[]): ArrayListStream<T> {
        const arrayListStream = new ArrayListStream<T>();
        list.forEach((item) => arrayListStream.add(item));
        return arrayListStream;
    }

    static fromArrayListStream<T>(arrayListStream: ArrayListStream<T>): ArrayListStream<T> {
        const newList = new ArrayListStream<T>();
        arrayListStream.innerList.forEach((item) => newList.add(item));
        return newList;
    }

    add(item: T | null): void {
        this.innerList.push(item);
    }

    addAll(items: (T | null)[]): void {
        this.innerList.push(...items);
    }

    findIndex(predicate: Predicate<T>): number {
        return this.innerList.findIndex(predicate);
    }

    getFromIndex(index: number): T | null {
        return this.innerList[index];
    }

    select<R>(func: Func<T, R>): ArrayListStream<R> {
        const newList = new ArrayListStream<R>();
        this.innerList.forEach((item, index) => {
            const transformedItem = func(item);
            newList.add(transformedItem);
        });
        return newList;
    }

    selectWithIndex<R>(func: Func<ItemWrapper<T>, R>): ArrayListStream<R> {
        const newList = new ArrayListStream<R>();
        this.innerList.forEach((item, index) => {
            const wrapper = new ItemWrapper(item, index);
            const transformedItem = func(wrapper);
            newList.add(transformedItem);
        });
        return newList;
    }

    foreachExecuteThisWithIndex(action: Action<ItemWrapper<T>>): void {
        this.innerList.forEach((item, index) => {
            const wrapper = new ItemWrapper(item, index);
            action(wrapper);
        });
    }

    foreachExecuteThis(action: Action<T>): void {
        this.innerList.forEach((item) => {
            if (item !== null) action(item);
        });
    }

    getLinkedItems(): ArrayListStream<ItemWrapper<T>> {
        const linkedList = new ArrayListStream<ItemWrapper<T>>();
        this.innerList.forEach((item, index) => {
            linkedList.add(new ItemWrapper(item, index));
        });

        linkedList.innerList.forEach((wrapper, index) => {
            const current = wrapper as ItemWrapper<T>;
            if (index > 0) {
                const previous = linkedList.innerList[index - 1] as ItemWrapper<T>;
                current.previous = previous;
                previous.next = current;
            }
            if (index < linkedList.innerList.length - 1) {
                const next = linkedList.innerList[index + 1] as ItemWrapper<T>;
                current.next = next;
            }
        });

        return linkedList;
    }

    wheree(predicate: Predicate<T>): ArrayListStream<T> {
        const newList = new ArrayListStream<T>();
        this.innerList.forEach((item) => {
            if (predicate(item)) newList.add(item);
        });
        return newList;
    }

    groupBy<R>(func: Func<T, R>): Map<R, ArrayListStream<T>> {
        const groups = new Map<R, ArrayListStream<T>>();
        this.innerList.forEach((item) => {
            if (item == null) return;
            const key = func(item);
            if (!groups.has(key)) {
                groups.set(key, new ArrayListStream<T>());
            }
            groups.get(key)?.add(item);

        });

        return groups;
    }

    groupByMulti<R, K>(innerListFunc: Func<T, R[]>, keyFunc: Func<R, K>): Map<K, ArrayListStream<T>> {
        const groups = new Map<K, ArrayListStream<T>>();

        this.innerList.forEach((item) => {
            if (item == null) return;
            const innerList = innerListFunc(item); // İç listeyi al
            innerList.forEach((innerItem) => {
                if (innerItem == null) return;
                const key = keyFunc(innerItem); // İç listedeki elemandan key üret
                if (!groups.has(key)) {
                    groups.set(key, new ArrayListStream<T>());
                }
                groups.get(key)!.add(item); // Ana öğeyi ilgili gruba ekle
            });
        });

        return groups;
    }

    getUniqueList<R>(func: Func<T, R>): ArrayListStream<T> {
        const uniqueValues = new Set<R>();
        const uniqueList = new ArrayListStream<T>();
        this.innerList.forEach((item) => {
            if (item !== null) {
                const value = func(item);
                if (!uniqueValues.has(value)) {
                    uniqueValues.add(value);
                    uniqueList.add(item);
                }
            }
        });
        return uniqueList;
    }

    countForThisMatch(predicate: Predicate<T>): number {
        return this.innerList.filter(predicate).length;
    }

    isAllMatch(predicate: Predicate<T>): boolean {
        return this.innerList.every(predicate);
    }

    isThereAllSame<R>(func: Func<T, R>): boolean {
        if (this.innerList.length <= 1) return true;
        const firstValue = func(this.innerList[0]);
        return this.innerList.every((item) => item !== null && func(item) === firstValue);
    }

    convertToPlainStringArray(func: Func<T, string>): string {
        return this.innerList.map((item) => (item !== null ? func(item) : "")).join(", ");
    }

    firstOrDefault(predicate: Predicate<T> | null): T | null {
        if (predicate == null) return this.innerList[0];
        return this.innerList.find(predicate) || null;
    }


    any(predicate?: Predicate<T>): boolean {
        if (!predicate) return this.innerList.length > 0;
        return this.innerList.some(predicate);
    }


    sum(selector?: Func<T, number>): number {
        if (!selector) {
            return this.innerList.reduce((total, item) => {
                if (typeof item === "number") {
                    return total + item;
                }
                return total;
            }, 0);
        }
        return this.innerList.reduce((total, item) => total + selector(item), 0);
    }


}

import { Dispatch, useEffect, useState } from 'react';

const getStorageValue = <T>(key: string, defaultValue: T): T | undefined => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(key);
        const initial = saved !== null ? JSON.parse(saved) : defaultValue;

        return initial;
    }

    return undefined;
};

type UseLocalStorage<T> = [T | undefined, Dispatch<T>];

const useLocalStorage = <T>(key: string, defaultValue: T): UseLocalStorage<T> => {
    const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
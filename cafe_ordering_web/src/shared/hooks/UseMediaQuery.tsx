import { useState, useEffect } from 'react';



export enum Breakpoints {
    SMALL = 576,
    MEDIUM = 768,
    LARGE = 992,
    XLARGE = 1200,
}



type MediaQueryType = 'min' | 'max';

function useMyMediaQuery(breakpoint: Breakpoints, type: MediaQueryType = 'min'): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const query = `(${type}-width: ${breakpoint}px)`;
        const media = window.matchMedia(query);

        const listener = () => setMatches(media.matches);
        listener(); // İlk kontrol

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [breakpoint, type]);

    return matches;
}

export default useMyMediaQuery;

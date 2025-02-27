"use client";

import Masonry from "react-masonry-css";
import React, { ReactNode } from "react";

interface MyMasonryProps {
    items: ReactNode[];
    breakpointCols?: { [key: number]: number }; // Opsiyonel Breakpoints
}

const defaultBreakpoints = { default: 6, 1100: 5, 700: 4, 500: 3, 300: 2 };

const MyMasonry: React.FC<MyMasonryProps> = ({ items, breakpointCols }) => {
    return (
        <div style={styles.masonryWrapper}>
            <Masonry
                breakpointCols={breakpointCols ?? defaultBreakpoints} // Eğer null ise varsayılan kullanılır
                className="masonry-grid overflow-hidden"
                columnClassName="masonry-column"
                style={styles.masonryGrid}
            >
                {items.map((item, index) => (
                    <div key={index} style={styles.masonryItem}>
                        {item}
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

// CSS Objeleri
const styles = {
    masonryWrapper: {
        padding: "1px",
    },
    masonryGrid: {
        display: "flex",
        marginLeft: "-5px",
        width: "auto",
    },
    masonryColumn: {
        paddingLeft: "5px",
        backgroundClip: "padding-box",
    },
    masonryItem: {
        margin: "3px",
        marginBottom: "1px",
    },
    masonryImg: {
        width: "100%",
        borderRadius: "8px",
        display: "block",
    },
};

export default MyMasonry;

"use client";

import Masonry from "react-masonry-css";
import React from "react";

const imageUrlList = [
    "antique-cafe-bg-01.jpg", "antique-cafe-bg-02.jpg",
    "antique-cafe-bg-03.jpg", "antique-cafe-bg-04.jpg",
    "menu-item-1.jpg", "menu-item-2.jpg"
];

// Listeyi 10 kez tekrar et
const repeatedImageUrlList = Array(10).fill(imageUrlList.map((url) => "/images/" + url)).flat();

const MasonryExample: React.FC = () => {
    return (
        <div style={styles.masonryWrapper}>
            <Masonry
                breakpointCols={{ default: 6, 1100: 5, 700: 4, 500: 3, 300: 2 }}
                className="masonry-grid"
                columnClassName="masonry-column"
                style={styles.masonryGrid}
            >
                {repeatedImageUrlList.map((src, index) => (
                    <div key={index} style={styles.masonryItem}>
                        <img src={src} alt={`Image ${index}`} style={styles.masonryImg} />
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

// CSS Objeleri
const styles = {
    masonryWrapper: {
        padding: "16px",
    },
    masonryGrid: {
        display: "flex",
        marginLeft: "-16px", // Gutter düzeltme
        width: "auto",
    },
    masonryColumn: {
        paddingLeft: "16px",
        backgroundClip: "padding-box",
    },
    masonryItem: {
        marginBottom: "16px",
    },
    masonryImg: {
        width: "100%",
        borderRadius: "8px",
        display: "block",
    },
};

export default MasonryExample;

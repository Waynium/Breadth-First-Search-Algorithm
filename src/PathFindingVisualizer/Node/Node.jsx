import React, { Component } from 'react';

import './Node.css';

const Node = ({
    col, 
    isFinish, 
    isStart, 
    isWall, 
    onMouseDown, 
    onMouseEnter, 
    onMouseUp, 
    row,
}) => {
        
    const extraClassName = 
        isFinish 
        ? 'node-finish' 
        : isStart 
        ? 'node-start' 
        : isWall
        ? 'node-wall'
        : '';

    return (
        <>
            <div 
                id={`node-${row}-${col}`} // This helps to identify which nodes are in the shortest path
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp(row, col)}>
            </div>
        </>
    );
}

export default Node;
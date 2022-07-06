import React, { Component } from 'react';
import Node from './Node/Node';
import {Dijkstra, getNodesInShortestPathOrder} from '../Algorithms/Dijkstra';
 
import './PathFindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 4;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export default class PathFindingVisualizer extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount = () => {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown = (row, col) => {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter = (row, col) => {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp = () => {
        this.setState({mouseIsPressed: false});
    }

    /**
     * @param visitedNodesInOrder => an array of visted nodes in order
     * @param nodesInShortestPathOrder 
     * @returns 
     */
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                // set timeout method is a function that's used to execute an     
                // instruction for a certain amount of time, which is provided     
                // as one of the parameters 
                setTimeout(() => {
                  this.animateShortestPath(nodesInShortestPathOrder);
                }, 20 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                else if (node.isFinish) 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                else 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 20 * i);
        }
    }
    
    /**
     * This method is for literally adding colour, or drawing the nodes 
     * that are within the shortest path to the finish node
     */
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i=0; i<nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                // As we see, the node is defined according to the index number of the array 
                // which carries the nodes that are in the shortest path order      
                // So that they can be specifically reffered to the CSS element, that animates them
                const node = nodesInShortestPathOrder[i];
                //if (node.row !== START_NODE_ROW && node.col !== START_NODE_COL) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                //}

            }, 50 * i);
        }
    }

    /**
     * This function is for making the process of dijkstra's algorithm visual,
     * using the grid as the nodes
     */
    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        // the dijstra method returns the visited nodes in order,
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    cleanVisitedNodes() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        // the dijstra method returns the visited nodes in order,
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isStart) 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                else if (node.isFinish) 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                else 
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            }, 20 * i);
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            // This div returns the grid for the nodes
            <>
                <div className="header__container">
                    <h2 className="header">Dijkstra's Algorithm Visualizer</h2>
                    <button className="btn" id="primary" onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                    <button className="btn" onClick={() => this.cleanVisitedNodes()}>
                        Clean visited Nodes
                    </button>
                    <div className="header__container"></div>
                </div>
                <div className="grid"> {/**This is where the whole grid is rendered */}
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    // destructuring the node object into the respective variables
                                    const {row, col, isStart, isFinish, isWall} = node;
                                    return (
                                    <Node 
                                        key={nodeIdx} 
                                        col={col} 
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        row={row}>
                                    </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="copyright">
                    <small>&copy; Copyright Wandile Nyembe 2022 - All rights reserved.</small>
                </div>
            </>
        );
    }
}

/**
 * This function is for creating the nodes, using 2 dimensional arrays
 * Simply rows and columns
 * @returns a grid
 */
const getInitialGrid = () => {
    const grid = [];
    for (let row=0; row<23; row++) {
        const currentRow = []; // an array of nodes
        for (let col=0; col<50; col++) {
            currentRow.push(createNode(col, row)); // adds node to array
        }
        grid.push(currentRow); //  adds array of nodes to nodes list
    }
    return grid;
};

/**
 * This functions purpose is to create individual nodes
 * where each node has properties as shown below
 * 2 dimensional position, start and finish nodes, distance etc
 */
const createNode = (col, row) => {
    return {
        //key,
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL, // boolean
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL, // boolean
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    console.log("getNewGridWithWallToggled method")
    console.log("row: " + row + " col: " + col);
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

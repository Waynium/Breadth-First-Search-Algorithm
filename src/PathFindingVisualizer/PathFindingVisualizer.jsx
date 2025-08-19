import React from 'react';
import Node from './Node/Node';
import { Dijkstra, getNodesInShortestPathOrder, getAllNodes } from '../Algorithms/Dijkstra';
 
import './PathFindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 4;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

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

const PathFindingVisualizer = props => {

    const [
        state,
        setState,
    ] = React.useState({
        grid: [],
        mouseIsPressed: false,
    })

    /**
     * Method used to generate wall when mouse is pressed
     */
    const handleMouseDown = (row, col) => {

        const newGrid = getNewGridWithWallToggled(state.grid, row, col);
        setState({
            grid: newGrid, 
            mouseIsPressed: true,
        });
    }

    const handleMouseEnter = (row, col) => {

        if (!state.mouseIsPressed) return;

        const newGrid = getNewGridWithWallToggled(state.grid, row, col);
        setState(prevState => ({
            ...prevState,
            grid: newGrid,
        }));
    }

    const handleMouseUp = () => {

        setState(prevState => ({
            ...prevState,
            mouseIsPressed: false,
        }));
    }

    /**
     * @param visitedNodesInOrder => an array of visted nodes in order
     * @param nodesInShortestPathOrder 
     * @returns 
     */
    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                // set timeout method is a function that's used to execute an     
                // instruction for a certain amount of time, which is provided     
                // as one of the parameters 
                setTimeout(() => {
                  animateShortestPath(nodesInShortestPathOrder);
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
    const animateShortestPath = (nodesInShortestPathOrder) => {
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
    const visualizeDijkstra = () => {
        const { grid } = state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        // the dijstra method returns the visited nodes in order,
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    const cleanVisitedNodes = () => {
        const { grid } = state;
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

    /*
    generateWall() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        // the dijstra method returns the visited nodes in order,
        const allNodes = getAllNodes(grid);
        var x = 0;
        var y = 0;
        //let x = Math.floor((Math.random() * 10) + 1);
        for (let i = 0; i <= 20; i++) {
            if (i === allNodes.length) {
                return;
            }
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
                const node = allNodes[i];
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
                }
                else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
                }
                else {
                    x = Math.floor((Math.random() * 25) + 10); // columns
                    y = Math.floor((Math.random() * 25) + 3); // rows
                    document.getElementById(`node-${y}-${x}`).className = 'node node-wall';
                }
            }, 20 * i);
        }

    }*/

    React.useEffect(() => {
        
        const newGrid = getInitialGrid();
        setState(prevState => ({
            ...prevState,
            grid: newGrid,
        }));
    },[])

    console.log('checking re-renders');

    return (
        // This div returns the grid for the nodes
        <React.Fragment>

            <div className="header__container">
                <h2 className="header">Breadth First Search Algorithm</h2>
                <button className="btn" id="primary" onClick={() => visualizeDijkstra()}>
                    Search for Red Node
                </button>
                <button className="btn" id="primary" onClick={() => cleanVisitedNodes()}>
                    Clean visited Nodes
                </button>
                {/*<button className="btn" onClick={() => this.generateWall()}>
                    Generate New Wall
                </button>*/}
                <div className="header__container"></div>
            </div>
            <div className="grid"> {/**This is where the whole grid is rendered */}

                { state.grid.map((row, rowIdx) => {
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
                                        mouseIsPressed={state.mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
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
        </React.Fragment>
    );
}

export default PathFindingVisualizer;
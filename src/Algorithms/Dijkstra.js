/**
 * Performs Dijkstras algorithm; returns all nodes in the order  
 * in which they were visited. Also makes nodes point back to their  
 * previous node. Therefore, this method is for all the nodes visited,
 * while we are searching for the finish node.
 */
export function Dijkstra(grid, startNode, finishNode) {
    /** 
     * if we encounter a wall, we skip it  
     * if (closestNode.isWall) continue  
     * if the closest node is at a distance of infinity,  
     * we must be trapped and shoulod therefore stop.
     * if (closestNode.distance === infinity) return visitedNodesInOrder
     */

    const visitedNodesInOrder = [];
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
    }

    startNode.distance = 0; // initial distance
    const unvisitedNodes = getAllNodes(grid); // an array of unvisited nodes

    while (!!unvisitedNodes.length) {
        // The array of unvisited nodes is sorted, so that the 
        // closest node can be retrieved
        sortNodesByDistance(unvisitedNodes);

        // shift pops off the value from the front of the array 
        // and assigns that value to the closest Destination variable
        const closestNode = unvisitedNodes.shift(); 

        if (closestNode.isWall)  continue; 
        if (closestNode.distance === Infinity) return visitedNodesInOrder; 

        closestNode.isVisited = true;
        // now because the closest node is visted, we add it to the array of visted nodes in order
        visitedNodesInOrder.push(closestNode);

        // if the closest node is the finish node, then we are done and  
        // we have reached the end, the while loop returns the array of the visted nodes in order
        if (closestNode === finishNode) { return visitedNodesInOrder; }

        updateUnvisitedNeighbours(closestNode, grid);
    }
}

/**
 * Backtracks from finishNode to find the shortest path 
 * only works when called after the dijkstra method above
 * This is the most important method, because it returns the array
 * of the nodes in the shortest path, effectively allowing us to 
 * compute the shortest path by backtracking from the finish node
 */
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode); // opposite direction
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

/**
 * Sorts nodes in a given array, according to their distance from the starting node
 */
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

/**
 * neighbours is a list of the 4 neighbours
 * this method adds 1 to the distance of every neighbour 
 * of the central node
 */
function updateUnvisitedNeighbours(node, grid) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
    for (const neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
    }
}

/**
 * This method is for getting the neighbours of a node from
 * left, right, top and bottom. Therefore, each node has four neighbours
 * It then returns a list of the 4 neighbours
 */
function getUnvisitedNeighbours (node, grid) {
    const neighbours = [];
    const {col, row} = node;
    if (row > 0) neighbours.push(grid[row - 1][col]); 
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]); 
    console.log("getUnvisitedNeighbours method"); // debugging lines
    console.log("row: " + row + " col: " + col);
    if (col > 0) neighbours.push(grid[row][col - 1]); 
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]); 
    return neighbours.filter(neighbour => !neighbour.isVisited);
}

/**
 * Returns an array of all the existing nodes
 */
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}
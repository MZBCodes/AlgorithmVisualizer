class Node {
    constructor(x, y, parent) {
        this.spacing = 50;
        this.indexx = x;
        this.indexy = y;
        this.x = x * this.spacing;
        this.y = y * this.spacing;
        this.value = 0;
        this.nodes = [];
        this.start = false;
        this.end = false;
        this.element = document.createElement('div');
        this.parent = parent;
        parent.appendChild(this.element);
        this.draw();
        this.element.addEventListener('click', () => {
            this.toggle();
        });
    }

    addNodes(node){
        this.nodes.push(node);
    }


    draw() {
        this.element.style.top = this.y.toString() + "px"
        this.element.style.left = this.x.toString() + "px"
        this.element.className = "node"
    }

    toggle() {
        console.log(this.indexx, this.indexy, this.nodes);
        if (!startSet){
            this.element.style.backgroundColor = "#3f9b37";
            startSet = true;
            startIndex = [this.x / this.spacing, this.y / this.spacing]
        } else if (!endSet){
            this.element.style.backgroundColor = "#9b3737";
            endSet = true;
            endIndex = [this.x / this.spacing, this.y / this.spacing]
            console.log(startIndex, endIndex)
            startSearch();
        }
    }

    searched() {
        this.element.style.backgroundColor = "#cfcfcf";
    }

    clear() {
        this.element.style.background = "none";
    }
}

class Wall {
    constructor(node1, node2){
        let n1 = node1;
        let n2 = node2;
        let y = n2.indexy - n1.indexy;
        let x = n2.indexx - n1.indexx;
    }

    clearNeighbors() {
        if (!this.y){//if its a horizontal y
            for (let i = 0; i < x; i++){

            }
        }
        if (!this.x){

        }

    }
}

class Grid {
    constructor(n, element){
        this.width = 800;
        this.height = 800;
        this.num = n;
        this.nodes = [];
        this.element = element;
    }

    fillNodes() {
        for (let i = 0; i < this.num; i++){
            for (let j = 0; j < this.num; j++){
                let temp = new Node(j, i,this.element)
                this.nodes.push(temp)
            }
        }
    }

    fillNeighbors() {
        let temp = null;
        let temp2 = null;
        for (let i = 0; i < this.num - 1; i++){
            for (let j = 0; j < this.num; j++){
                temp = this.nodes[i * this.num + j];
                temp2 = this.nodes[(i+1) * this.num + j];
                temp2.addNodes(temp);
                temp.addNodes(temp2)
            }
            console.log("Flip");
            for (let j = 0; j < this.num; j++){
                temp = this.nodes[j * this.num + i];
                temp2 = this.nodes[j * this.num + (i+1)];
                temp2.addNodes(temp);
                temp.addNodes(temp2)
            }
        }
    }

    dfs(start, end) {
        let searched = new Array(this.num * this.num).fill(false);
        let node = this.nodes[startIndex[1] * this.num + startIndex[0]];
        let stack = []
        console.log("node", node)
        console.log(startIndex, startIndex[1] * this.num + startIndex[0],this.nodes[startIndex[1] * this.num + startIndex[0]] );
        stack.push(node);
        while (stack.length > 0){
            let temp = stack.pop();
            console.log(temp.indexx, temp.indexy);

            if (temp.indexx == endIndex[0] && temp.indexy == endIndex[1]){
                break;
            }

            if (!searched[temp.indexy * this.num + temp.indexx]){
                searched[temp.indexy * this.num + temp.indexx] = true;
                if (temp != this.nodes[startIndex[1] * this.num + startIndex[0]]){
                    temp.searched();
                }
            }
            for (let i = 0; i < temp.nodes.length; i++){
                let temp2 = temp.nodes[i];
                if (!searched[(temp2.indexy) * this.num + temp2.indexx]){
                    stack.push(temp2);
                }
            }
        }
    }

    dfsRecursive(start, end){
        let searched = new Array(this.num * this.num).fill(false);
        let node = this.nodes[startIndex[1] * this.num + startIndex[0]];
        let queue = new Set()
        queue.add(node);
        this.dfsSearch(searched, queue);
    }

    dfsSearch(searched, queue){
        let tempCopy = [...queue][queue.size - 1];//get last element
        let temp = [...queue][queue.size - 1];//get last element
        queue.delete(tempCopy);
        if (!searched[temp.indexy * this.num + temp.indexx]){
            searched[temp.indexy * this.num + temp.indexx] = true;
            if (!(temp == this.nodes[startIndex[1] * this.num + startIndex[0]] || 
                temp == this.nodes[endIndex[1] * this.num + endIndex[0]])){
                temp.searched();
            }
        }
        
        for (let i = 0; i < temp.nodes.length; i++){
            let temp2 = temp.nodes[i];
            if (!searched[(temp2.indexy) * this.num + temp2.indexx]){
                queue.add(temp2);
            }
        }
        setTimeout(() => {
            if (queue.size > 0 && !(temp.indexx == endIndex[0] && temp.indexy == endIndex[1])){
                this.dfsSearch(searched, queue);
            }
        }, speed);
    }

    allVisited(neighbours, visited){
        neighbours.forEach(e => {
            if (!visited[(e.indexy) * this.num + e.indexx]) return false
        })
        return true
    }
    bfs(start, end) {       
        let searched = new Array(this.num * this.num).fill(false);
        let node = this.nodes[startIndex[1] * this.num + startIndex[0]];
        let queue = []
        queue.push(node);
        while (queue.length > 0){
            let temp = queue.shift();

            if (temp.indexx == endIndex[0] && temp.indexy == endIndex[1]){
                break;
            }

            if (!searched[temp.indexy * this.num + temp.indexx]){
                searched[temp.indexy * this.num + temp.indexx] = true;
                if (temp != this.nodes[startIndex[1] * this.num + startIndex[0]]){
                    temp.searched();
                }
            }
            
            for (let i = 0; i < temp.nodes.length; i++){
                let temp2 = temp.nodes[i];
                if (!searched[(temp2.indexy) * this.num + temp2.indexx]){
                    queue.push(temp2);
                }
            }
        }
    }

    bfsRecursive() {
        let searched = new Array(this.num * this.num).fill(false);
        let node = this.nodes[startIndex[1] * this.num + startIndex[0]];
        let queue = new Set()
        queue.add(node);
        this.bfsSearch(searched, queue);
    }

    bfsSearch(searched, queue){
        let [tempCopy] = queue;//get first element
        let [temp] = queue;
        queue.delete(tempCopy);
        if (!searched[temp.indexy * this.num + temp.indexx]){
            searched[temp.indexy * this.num + temp.indexx] = true;
            if (!(temp == this.nodes[startIndex[1] * this.num + startIndex[0]] || 
                temp == this.nodes[endIndex[1] * this.num + endIndex[0]])){
                temp.searched();
            }
        }
        
        for (let i = 0; i < temp.nodes.length; i++){
            let temp2 = temp.nodes[i];
            if (!searched[(temp2.indexy) * this.num + temp2.indexx]){
                queue.add(temp2);
            }
        }
        setTimeout(() => {
            if (queue.size > 0 && !(temp.indexx == endIndex[0] && temp.indexy == endIndex[1])){
                this.bfsSearch(searched, queue);
            }
        }, speed);
    }

    reset() {
        for (let i = 0; i < this.nodes.length; i++){
            this.nodes[i].clear();
        }
        startSet = false;
        endSet = false;
        startIndex = [];
        endIndex = [];
    }
}


const startSearch = () => {
    //grid.dfs();
    //grid.bfsRecursive();
    if (dfsOrGfs){
        grid.dfsRecursive();
    } else {
        grid.bfsRecursive();
    }
}


let dfsOrGfs = true
let startSet = false, endSet = false;
let startIndex = [];
let endIndex = [];
let speed = 10;

const body = document.getElementById('grid');
const grid = new Grid(10, body);

const toggle = document.getElementById('toggle');
toggle.addEventListener('click', () => {
    dfsOrGfs = !toggle.checked
})

const slider = document.getElementById('sliderRange');
slider.addEventListener('click', () => {
    console.log(slider.value);
    speed = 100 - 90 * (slider.value / 100);
})

grid.fillNodes();
grid.fillNeighbors();
console.log(grid.nodes);
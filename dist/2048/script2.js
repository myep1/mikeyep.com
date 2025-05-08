import Grid from "./Grid.js"
import Tile from "./Tile.js"

const msg = document.getElementById("msg")
const msg2 = document.getElementById("msg2")
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard, __G.boardSize)
grid.randomEmptyCell().tile = new Tile(gameBoard)
console.log('Tile placed in random empty cell:', grid.randomEmptyCell().tile);
grid.randomEmptyCell().tile = new Tile(gameBoard)
console.log('Tile placed in random empty cell:', grid.randomEmptyCell().tile);


var mc = new Hammer.Manager(gameBoard);
mc.add(new Hammer.Pan({direction:Hammer.DIRECTION_HORIZONTAL, threshold:80, pointers: 0}));
mc.add(new Hammer.Pan({direction:Hammer.DIRECTION_VERTICAL, threshold:80, pointers: 0}));
mc.on("panend", function(ev) {
  msg.innerHTML = "PANEND"
  if(ev.direction == Hammer.DIRECTION_RIGHT) 
  {
    msg.innerHTML = "RIGHT"
  }

  if(ev.direction == Hammer.DIRECTION_LEFT) 
  {
    msg.innerHTML = "LEFT"
  }

  if(ev.direction == Hammer.DIRECTION_UP) 
  {
    msg.innerHTML = "UP"
  }

  if(ev.direction == Hammer.DIRECTION_DOWN) 
  {
    msg.innerHTML = "DOWN"
  }
});

// hammertime.on("pan", function(ev) {
//   if(ev.type == 'pan'){
// 		window.removeEventListener("keydown", handleInput)
// 		msg.innerHTML = ev.additionalEvent;
// 		if(ev.additionalEvent == 'panright'){
// 			if (!canMoveRight()) {
// 				setupInput()
// 				return
// 			}
// 			moveRight()
// 		}
// 		if(ev.additionalEvent == 'panleft'){
// 			 if (!canMoveLeft()) {
// 				setupInput()
// 				return
// 			}
// 			moveLeft()
// 		}
// 		if(ev.additionalEvent == 'panup'){
// 			 if (!canMoveUp()) {
// 				setupInput()
// 				return
// 			}
// 			moveUp()			
// 		}
// 		if(ev.additionalEvent == 'pandown'){
// 			if (!canMoveDown()) {
// 				setupInput()
// 				return
// 			}
// 			moveDown()
// 		}		
		
// 		 grid.cells.forEach(cell => cell.mergeTiles())

// 		const newTile = new Tile(gameBoard)
// 		grid.randomEmptyCell().tile = newTile

// 		if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
// 			newTile.waitForTransition(true).then(() => {
// 				alert("You lose")
// 			})
// 			return
// 		}

// 		setupInput()
// 	}   
// });

setupInput()

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true }) 
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    case "u":
    case "U":
      if(!canUndo()){
        setupInput()
        return
      }else{        
        await undo()
        setupInput()
        return
      }
    default:
      setupInput()
      return
  }

  grid.cells.forEach(cell => cell.mergeTiles())
  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile
  console.log('Tile added:', newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
    })
    return
  }
  setupInput()
}

function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function undo() {  
  console.log('undo ' + __G.moves.length)
  let lastMove = __G.moves.pop()  
  console.dir(lastMove)
  return slideTiles(lastMove)
}

function slideTiles(cells) {
  if(__G.moves){
    __G.moves.push(cells)    
  }
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function canUndo(){
  return __G.moves.length > 0
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

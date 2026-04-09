export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };
    
    // We've included code to prevent your Battlesnake from moving backwards
    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    const length = gameState.you.length;
    const body = gameState.you.body;
    let nextMove;
    
    if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
        moveSafety.left = false;
        
    } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
        moveSafety.right = false;
        
    } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
        moveSafety.down = false;
        
    } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
        moveSafety.up = false;
    }
    
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
    // gameState.board contains an object representing the game board including its width and height
    // https://docs.battlesnake.com/api/objects/board
    
    if (myHead.y + 1 === 11){moveSafety.up = false;console.log('dodge wall')}
    if (myHead.y - 1 === -1){moveSafety.down = false;console.log('dodge wall')}
    if (myHead.x + 1 === 11){moveSafety.right = false;console.log('dodge wall')}
    if (myHead.x - 1 === -1){moveSafety.left = false;console.log('dodge wall')}

    // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
    // gameState.you contains an object representing your snake, including its coordinates
    // https://docs.battlesnake.com/api/objects/battlesnake
    for(let i = 2; i < length; i++){
        let bodyX = body[i].x
        let bodyY = body[i].y
        if(myHead.x - 1 === bodyX && myHead.y === bodyY){moveSafety.left = false; console.log('dodge self')}
        if(myHead.x + 1 === bodyX && myHead.y === bodyY){moveSafety.right = false; console.log('dodge self')}
        if(myHead.x === bodyX && myHead.y - 1 === bodyY){moveSafety.down = false; console.log('dodge self')}
        if(myHead.x === bodyX && myHead.y + 1 === bodyY){moveSafety.up = false; console.log('dodge self')}
    }
    
    const otherSnakes = gameState.board.snakes;
    for(let i = 0; i < otherSnakes.length; i++){
        let enemy = otherSnakes[i]
        for(let j = 0; j < enemy.length; j++){
            let enemyBody = enemy.body[j];
            //check 2 above
            if(moveSafety.up){
                if(myHead.y + 1 >= enemyBody.y && myHead.y < enemyBody.y) {
                    if(myHead.x - 1 <= enemyBody.x && myHead.x + 1 >= enemyBody.x){
                        moveSafety.up = false
                        console.log('dodge! w');
                    }
                }
            }
            // check 2 down
            if(moveSafety.down){
                if(myHead.y - 1 <= enemyBody.y && myHead.y > enemyBody.y) {
                    if(myHead.x - 1 <= enemyBody.x && myHead.x + 1 >= enemyBody.x){
                        moveSafety.down = false
                        console.log('dodge! s');
                    }
                }
            }
            // check 2 left
            if(moveSafety.left){
                if(myHead.x - 1 <= enemyBody.y && myHead.x > enemyBody.y) {
                    if(myHead.y - 1 <= enemyBody.x && myHead.y + 1 >= enemyBody.x){
                        moveSafety.left = false
                        console.log('dodge! a');
                    }
                }
            }
            // check 2 right
            if(moveSafety.right){
                if(myHead.x + 1 >= enemyBody.y && myHead.x < enemyBody.y) {
                    if(myHead.y - 1 <= enemyBody.x && myHead.y + 1 >= enemyBody.x){
                        moveSafety.right = false
                        console.log('dodge! d');
                    }
                }
            }
        }
    }

    if(gameState.you.health < 100){
        const food = gameState.board.food;
        let closestFood = null;
        let closestDistance = 9999;


        for (let i = 0; i < food.length; i++) {
            const f = food[i];
            const distance = Math.abs(myHead.x - f.x) + Math.abs(myHead.y - f.y);


            if (distance < closestDistance) {
                closestDistance = distance;
                closestFood = f;
            }
        }

        if (closestFood) {
            if (closestFood.x < myHead.x && moveSafety.left) {
                nextMove = "left";
            } else if (closestFood.x > myHead.x && moveSafety.right) {
                nextMove = "right";
            } else if (closestFood.y < myHead.y && moveSafety.down) {
                nextMove = "down";
            } else if (closestFood.y > myHead.y && moveSafety.up) {
                nextMove = "up";
            }
    }

    }
    

    const safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected!`);
        return { move: "down" };
    }
    console.log(safeMoves)
    // Choose a random move from the safe moves
    nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    

    
    

    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}
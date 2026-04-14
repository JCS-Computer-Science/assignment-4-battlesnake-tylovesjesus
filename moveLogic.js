export default function move(gameState){
    let moveSafety = {
        up: true,
        down: true,
        left: true,
        right: true
    };

    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];
    const length = gameState.you.length;
    const body = gameState.you.body;
    const otherSnakes = gameState.board.snakes;
    const myId = gameState.you.id
    let nextMove;

    function dontKillYourself(){ //makes you not kill yourself
        if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
            moveSafety.left = false;
            
        } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
            moveSafety.right = false;
            
        } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
            moveSafety.down = false;
            
        } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
            moveSafety.up = false;
        }
        
        if (myHead.y + 1 === 11){moveSafety.up = false;console.log('dodge wall')}
        if (myHead.y - 1 === -1){moveSafety.down = false;console.log('dodge wall')}
        if (myHead.x + 1 === 11){moveSafety.right = false;console.log('dodge wall')}
        if (myHead.x - 1 === -1){moveSafety.left = false;console.log('dodge wall')}

        for(let i = 2; i < length -1 ; i++){
            let bodyX = body[i].x
            let bodyY = body[i].y
            if(myHead.x - 1 === bodyX && myHead.y === bodyY){moveSafety.left = false; console.log('dodge self')}
            if(myHead.x + 1 === bodyX && myHead.y === bodyY){moveSafety.right = false; console.log('dodge self')}
            if(myHead.x === bodyX && myHead.y - 1 === bodyY){moveSafety.down = false; console.log('dodge self')}
            if(myHead.x === bodyX && myHead.y + 1 === bodyY){moveSafety.up = false; console.log('dodge self')}
        }
    }

    function lookForOthersDirect(checkDistance){ //looks for other snakes within a certian distance of my head
        for(let i = 0; i < otherSnakes.length; i++){
            let enemy = otherSnakes[i]
            if(otherSnakes[i].id != myId){
                for(let j = 0; j < enemy.length -1 ; j++){
                    let enemyBody = enemy.body[j];
                    //check above
                    if(moveSafety.up){
                        if(myHead.y + checkDistance >= enemyBody.y && myHead.y <= enemyBody.y) {
                            if(myHead.x === enemyBody.x){
                                moveSafety.up = false
                                console.log('dodge! w');
                            }
                        }
                    }
                    // check down
                    if(moveSafety.down){
                        if(myHead.y - checkDistance <= enemyBody.y && myHead.y >= enemyBody.y) {
                            if(myHead.x === enemyBody.x){
                                moveSafety.down = false
                                console.log('dodge! s');
                            }
                        }
                    }
                    // check left
                    if(moveSafety.left){
                        if(myHead.x - checkDistance <= enemyBody.x && myHead.x >= enemyBody.x) {
                            if(myHead.y === enemyBody.y){
                                moveSafety.left = false
                                console.log('dodge! a');
                            }
                        }
                    }
                    // check right
                    if(moveSafety.right){
                        if(myHead.x + checkDistance >= enemyBody.x && myHead.x <= enemyBody.x) {
                            if(myHead.y === enemyBody.y){
                                moveSafety.right = false
                                console.log('dodge! d');
                            }
                        }
                    }
                }
            }
        }
        console.log("direct scan called, check distance: " + checkDistance)
    }

    function lookForOthersArea(checkDistance){ //looks for other snakes within a certian distance of my head
        for(let i = 0; i < otherSnakes.length; i++){
            let enemy = otherSnakes[i]
            if(otherSnakes[i].id != myId){
                for(let j = 0; j < enemy.length -1; j++){
                    let enemyBody = enemy.body[j];
                    //check above
                    if(moveSafety.up){
                        if(myHead.y + checkDistance >= enemyBody.y && myHead.y <= enemyBody.y) {
                            if(myHead.x -1 <= enemyBody.x && myHead.x +1 >= enemyBody.x){
                                moveSafety.up = false
                                console.log('dodge! w');
                            }
                        }
                    }
                    // check down
                    if(moveSafety.down){
                        if(myHead.y - checkDistance <= enemyBody.y && myHead.y >= enemyBody.y) {
                            if(myHead.x -1 <= enemyBody.x && myHead.x +1 >= enemyBody.x){
                                moveSafety.down = false
                                console.log('dodge! s');
                            }
                        }
                    }
                    // check left
                    if(moveSafety.left){
                        if(myHead.x - checkDistance <= enemyBody.x && myHead.x >= enemyBody.x) {
                            if(myHead.y -1 <= enemyBody.y && myHead.y +1 >= enemyBody.y){
                                moveSafety.left = false
                                console.log('dodge! a');
                            }
                        }
                    }
                    // check right
                    if(moveSafety.right){
                        if(myHead.x + checkDistance >= enemyBody.x && myHead.x <= enemyBody.x) {
                            if(myHead.y -1 <= enemyBody.y && myHead.y +1 >= enemyBody.y){
                                moveSafety.right = false
                                console.log('dodge! d');
                            }
                        }
                    }
                }
            }
        }
        console.log("area scan called, check distance: " + checkDistance)
    }

    dontKillYourself();
    lookForOthersArea(2);

    let safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
    if (safeMoves.length == 0) {
        console.log(`MOVE ${gameState.turn}: No safe moves detected! going to check again`);

        moveSafety.up = true;
        moveSafety.down = true;
        moveSafety.left = true;
        moveSafety.right = true;
        
        lookForOthersDirect(1);
        dontKillYourself();
        safeMoves = Object.keys(moveSafety).filter(direction => moveSafety[direction]);
        console.log(moveSafety)
        if(safeMoves.length == 0){
            console.log("no safe moves")
            return { move: "down" };
        }
    }
    // Choose a random move from the safe moves
    nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    
if(gameState.you.health < 60 || gameState.you.length <= 3){
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
    }else{
        //have the snake prioritize the middle of the board.
        if(moveSafety.up && myHead.y < 5){
            nextMove = "up";
        }

        if(moveSafety.down && myHead.y > 5){
            nextMove = "down"
        }
        if(moveSafety.left && myHead.x > 5){
            nextMove = "left";
        }

        if(moveSafety.right && myHead.x < 5){
            nextMove = "right";
        }
        
    }
    
    
    console.log(moveSafety)
    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove };
}
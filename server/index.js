const { disconnect } = require('process');

const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});


const players = [];
let dealer, spotter, queenPosition, spotterGuess;
let dealerTurn, spotterTurn;
let spotterPoints = 0;
let dealerPoints = 0;
let round = 0;

// io.use((socket, next) => {
//     console.log(socket.handshake);
//     if(socket.handshake.auth.username == 'dannyboi' && 
//         socket.handshake.auth.password == 'dre@margh_shelled'){
        
//         next();
//     }
// })

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    players.push(socket.id);
    console.log(players);


    if( players.length == 2 ){
        const dealerIndex = Math.floor(Math.random() * 2);
        dealer = players[dealerIndex];
        const spotterIndex = dealerIndex == '1' ? '0' : '1';
        spotter = players[spotterIndex];
        console.log(`dealer is ${dealer}`);
        console.log(`spotter is ${spotter}`);
        dealerTurn = true;
        spotterTurn = false;

        io.to(dealer).emit('message', 'You are the dealer! It is currently your turn. Choose a number');
        io.to(spotter).emit('message', 'You are the spotter. Wait for the dealer to pick a number.');
    }

    socket.on('message', (message) => {
        if(round<5){
            if (socket.id == dealer) {
                if(dealerTurn) {
                    queenPosition = message;
                    dealerTurn = false;
                    spotterTurn = true;
                    io.to(dealer).emit('message', 'Waiting for the spotters guess...');
                    io.to(spotter).emit('message', 'Waiting for your guess...');
                } else {
                    io.to(dealer).emit('message', 'it is currently the spotters turn! please wait.');
                }
                
            }
            if (socket.id == spotter) {
                if(spotterTurn) {
                    spotterGuess = message;
                    dealerTurn = true;
                    spotterTurn = false;
    
                    if(spotterGuess == queenPosition) {
                        io.to(dealer).emit('message', 'Aww! The spotter got it right. Send your next number.');
                        io.to(spotter).emit('message', 'You got it right!! currently waiting for the dealer.');
                        spotterPoints++;
                        round++;
                        io.emit('message', { points: true, spotterPoints: spotterPoints, dealerPoints: dealerPoints, round: round });
                    } else {
                        io.to(dealer).emit('message', 'The spotter got it wrong! Woohoo! Send your next number.');
                        io.to(spotter).emit('message', 'Aww! You got it wrong. Waiting for the dealer.');
                        dealerPoints++;
                        round++;
                        io.emit('message', { points: true, spotterPoints: spotterPoints, dealerPoints: dealerPoints, round: round });
                    }
                } else {
                    io.to(spotter).emit('message', 'It is currently the dealers turn! Please wait your turn.');
                }
            }     
            // console.log(`${socket.id.substr(0,2)} said ${message}` );   
        } else {
            if(spotterPoints<dealerPoints){
                io.emit('message', 'Game Over! Dealer Wins!');
            } else {
                io.emit('message', 'Game Over! Spotter Wins!');
            }
            
        }
    });
});

io.on("disconnect", (reason) => {
    io.emit('message', 'Disconnected! bye bye!')
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );



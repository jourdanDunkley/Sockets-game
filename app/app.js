let socket;
socket = io('ws://localhost:8080');

socket.on('message', text => {

    if(text.points){
        document.getElementById('dealerScore').innerText = text.dealerPoints
        document.getElementById('spotterScore').innerText = text.spotterPoints
        document.getElementById('round').innerText = text.round
        if(text.round==5){
            if(text.dealerPoints<text.spotterPoints){
                document.getElementById('message').innerText = "GAME OVER! Spotter Wins"
                document.getElementById('game-title').innerText = "Thanks for playing"
            } else {
                document.getElementById('message').innerText = "GAME OVER! Dealer Wins"
                document.getElementById('game-title').innerText = "Thanks for playing"
            }
        }
    } else {
        document.getElementById('message').innerText = text
    }
});

document.getElementById('1').onclick = () => {
    socket.emit('message', '1');
}
document.getElementById('2').onclick = () => {
    socket.emit('message', '2');
}
document.getElementById('3').onclick = () => {
    socket.emit('message', '3');
}



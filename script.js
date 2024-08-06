let level = 1;
let n = 3;
let timer = 2000;
let score = 0;
let currentHighlightedItem = null;
let totalScore=0
function getDateInFormat(){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let now=new Date();
    let hours=now.getHours();
    let minutes=now.getMinutes();
    let amorpm= hours<12 ? 'AM' :'PM';
    hours=hours%12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let time=`${hours}:${minutes} ${amorpm}`
    let datestring=`${months[now.getMonth()]} ${now.getDate()}-${now.getFullYear()}: ${time}`;
    return datestring;
}
function leaderBoardInsertion(totalScore){
    //Maintaining only five leaderboard scores
    let data = JSON.parse(localStorage.getItem('leaderBoardScores'));
    if (!data) return;
    data.push({ score: totalScore, date: getDateInFormat() });
    data.sort((a, b) => b.score-a.score);
    if (data.length > 5) {
        data = data.slice(0, 5);
    }
    localStorage.setItem('leaderBoardScores', JSON.stringify(data));
}
function displayLeaderboard(){
    const leaderboardList = document.getElementById('leaderboard-list');
    const data = JSON.parse(localStorage.getItem('leaderBoardScores'));
    leaderboardList.innerHTML='';
    leaderboardList.innerHTML = data.map(entry => 
        `<li class="leaders">
                    <div class="details">
                      <span class="icon">🏆</span>
                      <span class="value">${entry.score}</span>
                    </div>
                    <div class="details">
                      <span class="icon">🗓️</span>
                      <span class="value">${entry.date}</span>
                    </div>
                  </li> `
    ).join('');
}
function handleItemClick(event){
    const item = event.target;
    if (item === currentHighlightedItem) {
        score++;
        totalScore++;
        document.getElementById('score').textContent = score;
        document.getElementById('totalscore').textContent = totalScore;
        // Check if score matches level goal
        if (score === level * 10) {
            level++;//level increase
            n++;//grid size increases
            timer = Math.max(100, timer - 100); // timer got reduced by 0.1 ms and upto level20 it is decreasing,after that the time 0.1 ms
            //making level score zero
            score = 0;
            document.querySelector('.startbutton').textContent = `Play Level-${level}`;
            document.getElementById('score').textContent = score;
            button.addEventListener('click', () => {gaming(level, n, timer); },{once:true});//To prevent double clicks on playing same level twice so set once:true
        }
    }
}
function createGridBox(n){
    const container = document.querySelector('.grid-container');
    container.innerHTML = '';
    //repeating n rows and n columns in that grid box 
    container.style.gridTemplateColumns = `repeat(${n}, 1fr)`;//repeating n fr
    container.style.gridTemplateRows = `repeat(${n}, 1fr)`;
    //creating grid items
    for (let i = 1; i <= n * n; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.id = `item-${i}`;
        item.addEventListener('click', handleItemClick);
        container.appendChild(item);
    }
}
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function startHighlighting(k){
    for (let j = 1; j <= k; j++) {
        const random = getRandomNumber(1, n * n);
        currentHighlightedItem = document.getElementById(`item-${random}`);
        currentHighlightedItem.classList.add('highlight');
        canClick = true;
        const userClicked = await new Promise(resolve => {
            const timeoutId = setTimeout(() => resolve(false), timer);
                currentHighlightedItem.addEventListener('click', () => {
                    clearTimeout(timeoutId);
                    resolve(true);
                },{ once: true });
            });
        if (!userClicked) {
            // User failed to click in time
            leaderBoardInsertion(totalScore);
            alert('😔You missed the grid.Play again,game will restart for you');
            window.location.reload();    
            }
        currentHighlightedItem.classList.remove('highlight');
    }   
}
function gaming(level, n, timer){
    createGridBox(n);
    startHighlighting(level * 10);
}
//Starts here
const button = document.querySelector('.startbutton');
button.addEventListener('click', () => {gaming(level, n, timer);},{once:true});

const refreshButton = document.getElementById('refresh-leaderboard');
refreshButton.addEventListener('click', ()=>{displayLeaderboard()});

if(!localStorage.getItem('leaderBoardScores')){
localStorage.setItem('leaderBoardScores',JSON.stringify([]));
}

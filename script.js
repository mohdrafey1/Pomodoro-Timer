const timer = document.querySelector('.timer');
const title = document.querySelector('.title');
const startbtn = document.querySelector('#startbtn');
const pausebtn = document.querySelector('#pausebtn');
const resumebtn = document.querySelector('#resumebtn');
const resetbtn = document.querySelector('#resetbtn');
const pomoCountsDisplay = document.querySelector('.pomoCountsDisplay');

const Work_time = 25 * 60;
const Break_time = 5 * 60;

let timerID = null;
let oneRoundCompleted = false;
let totalCount = 0;
let paused = false;

const updateTitle = (msg) => {
    title.textContent = msg;
}

const saveLocalCounts = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCounts"));
    counts !== null ? counts++ : counts = 1;
    counts++;
    localStorage.setItem("pomoCounts", JSON.stringify(counts));
}

const countDown = (time) => {
    return () => {
        const mins = Math.floor(time/60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        timer.textContent = `${mins}:${secs}`;
        time--;
        if (time < 0) {
            stopTimer();
            if (!oneRoundCompleted) {
                timerID = startTimer(Break_time);
                oneRoundCompleted = true;
                updateTitle("Its break Time!");
            } else {
                updateTitle("Completed 1 round of pomodoro technique");
                setTimeout(() => updateTitle("Start Time Again!"), 2000);
                totalCount++;
                saveLocalCounts();
                showPomoCounts();
            }
        }
    }
}

const startTimer = (startTime) => {
    if(timerID !== null ) {
        stopTimer();
        timerID = startTimer(Break_time);
    }
    return setInterval(countDown(startTime), 1000);
}

const stopTimer = () => {
    clearInterval(timerID);
    timerID = null;
}

const getTimeInSeconds = (timeString) => {
    const[minutes, seconds] = timeString.split(":");
    return parseInt(minutes * 60) + parseInt(seconds) ;
}

startbtn.addEventListener('click', () => {
    timerID = startTimer(Work_time);
    updateTitle("It's Work Time");
});

resetbtn.addEventListener('click', () => {
    stopTimer();
    timer.textContent = "25:00";
    updateTitle("Start Timer Again");
});

pausebtn.addEventListener('click', () => {
    stopTimer();
    paused = true;
    updateTitle("Timer Paused");
});


resumebtn.addEventListener('click', () => {
    if (paused) {        
        const currentTime =  getTimeInSeconds(timer.textContent);
        timerID = startTimer(currentTime);
        paused = false;
        (!oneRoundCompleted) ? updateTitle("It's Work Time") : updateTitle("Its break time");
    }
});


const showPomoCounts = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCounts"));
    if (counts > 0) {
        pomoCountsDisplay.style.display = "flex";
    }
    pomoCountsDisplay.firstElementChild.textContent = counts;
}
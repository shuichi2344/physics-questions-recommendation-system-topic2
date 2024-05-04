const questionElement = document.getElementById("question");
const difficultyElement = document.getElementById("difficulty");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
const maxQuestions = 15;
let consecutiveIncorrectAnswers = 0;
let askedQuestionIDs = []; // Array to store IDs of asked questions 
let similarQuestionsQueue = [];

const questions = [
    {
        QuestionID: 2001,
        Topics: "Kinematics",
        Question: "A sports car accelerates along a straight test truck from rest to 70km h^-1 in 6.3s. What is its average acceleration?",
        AnswerChoices: ["3.0m s^-2", "3.5m s^-2", "3.0km h^-2", "3.0m s^-1"],
        Answer: "3.0m s^-2",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2002, 2032, 2008],
        Similarity_Score: [1.0000000000000002, 0.31308397082766964, 0.2959097184834059]
    },
    {
        QuestionID: 2002,
        Topics: "Kinematics",
        Question: "A railway train, travelling along a straight tracks, takes 1.5 minutes to  come to rest from a speed of 115km h^-1. What is its average acceleration while braking?",
        AnswerChoices: ["-0.35m s^-2", "3.5m s^-2", "-0.35km h^-2", "0.35m s^-2"],
        Answer: "-0.35m s^-2",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2001, 2018, 2009],
        Similarity_Score: [1.0000000000000004, 0.31308397082766964, 0.3078988422718467]
    },
    {
        QuestionID: 2003,
        Topics: "Kinematics",
        Question: "A sprinter, starting from the blocks ,reaches his full speed of 9.0m s^-1 in 1.5s. What is his average acceleration?",
        AnswerChoices: ["6m s^-2", "3m s^-2", "2m s^-2", "7m s^-2"],
        Answer: "6m s^-2",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2019, 2005, 2025],
        Similarity_Score: [1.0000000000000002, 0.37893218350993857, 0.2800267693182302]
    },
    {
        QuestionID: 2004,
        Topics: "Kinematics",
        Question: "A car is travelling at a speed of 25m s^-1. At this speed, it is capable of accelerating at 1.8m s^-2. How long would it take to accelerate from 25m s^-1 to the speed limit of 31m s^-1?",
        AnswerChoices: ["3.8s", "2.5s", "4.0s", "3.3s"],
        Answer: "3.3s",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2009, 2029, 2018],
        Similarity_Score: [1.0, 0.47229250136191114, 0.3289261648182784]
    },
    {
        QuestionID: 2005,
        Topics: "Kinematics",
        Question: "How far does a cyclist travel in 11 minutes if his average speed is 22km h^-1?",
        AnswerChoices: ["3000m", "4000m", "5000m", "6000m"],
        Answer: "4000m",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2006, 2039, 2003],
        Similarity_Score: [1.0000000000000004, 0.3812926993722117, 0.3775940460625063]
    },
    {
        QuestionID: 2006,
        Topics: "Kinematics",
        Question: "At an average speed of 24km h^-1, how many kilometres will a cyclist travel in 75 minutes?",
        AnswerChoices: ["44km", "30km", "32km", "40km"],
        Answer: "30km",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2005, 2039, 2007],
        Similarity_Score: [1.0, 0.3812926993722117, 0.2643856265028823]
    },
    {
        QuestionID: 2007,
        Topics: "Kinematics",
        Question: "An aircraft travels 1600km in 2.5 hours. What is its average speed, in m s^-1?",
        AnswerChoices: ["110m s^-1", "150m s^-1", "100m s^-1", "180m s^-1"],
        Answer: "180m s^-1",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2031, 2006, 2005],
        Similarity_Score: [1.0, 0.2716364664596108, 0.19493420300920336]
    },
    {
        QuestionID: 2008,
        Topics: "Kinematics",
        Question: "A sports car can stop in 6.1s from a speed of 110km h^-1. What is its acceleration?",
        AnswerChoices: ["-3.0m s^-2", "-5.0m s^-2", "-6.6m s^-2", "-7.3m s^-2"],
        Answer: "-5.0m s^-2",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2001, 2027, 2032],
        Similarity_Score: [1.0, 0.2865890152714864, 0.25890528931089946]
    },
    {
        QuestionID: 2009,
        Topics: "Kinematics",
        Question: "A car increases its speed from 25m s^-1 to 31m s ^-1 with a uniform acceleration of 1.8m s^-2. How far does it travel while accelerating?",
        AnswerChoices: ["90m", "92m", "93m", "94m"],
        Answer: "93m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2004, 2039, 2014],
        Similarity_Score: [1.0000000000000002, 0.47229250136191114, 0.29339810183516446]
    },
    {
        QuestionID: 2010,
        Topics: "Kinematics",
        Question: "A cricket ball is thrown vertically upwards with a speed of 15.0m s^-1. What is its velocity when it first passes through a point 8.0m above the cricketer's hands?",
        AnswerChoices: ["7.1m s^-1", "8.2m s^-1", "7.3m s^-1", "9.4m s^-1"],
        Answer: "8.2m s^-1",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2020, 2019, 2012],
        Similarity_Score: [1.0, 0.3363018417289563, 0.2360916337202399]
    },
    {
        QuestionID: 2011,
        Topics: "Kinematics",
        Question: "An airliner must reach a speed of 110m s^-1 to take off. If the available length of the runway is 2.4km and the aircraft accelerates uniformly from rest at one end, what minimum acceleration must be available if it is to take off?",
        AnswerChoices: ["1.2m s^-2", "2.5m s^-2", "2.8m s^-2", "3.0m s^-2"],
        Answer: "2.5m s^-2",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2029, 2026, 2024],
        Similarity_Score: [1.0000000000000002, 0.2978010637394323, 0.22974970077613582]
    },
    {
        QuestionID: 2012,
        Topics: "Kinematics",
        Question: "A ball is thrown horizontally from the top of the tower 30m high and lands 15m from its base. What is the ball's initial speed?",
        AnswerChoices: ["6.1m s^-1", "6.3m s^-1", "6.5m s^-1", "6.7m s^-1"],
        Answer: "6.1m s ^-1",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2020, 2023, 2036],
        Similarity_Score: [1.0000000000000002, 0.3222667963096983, 0.3158350121801105]
    },
    {
        QuestionID: 2013,
        Topics: "Kinematics",
        Question: "A football is kicked on level ground at a velocity of 15m s^-1 at an angle of 30 degree to the horizontal. How far away is the first bounce?",
        AnswerChoices: ["18m", "19m", "20m", "21m"],
        Answer: "20m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2028, 2017, 2039],
        Similarity_Score: [1.0, 0.2972358453122014, 0.2285492506418632]
    },
    {
        QuestionID: 2014,
        Topics: "Kinematics",
        Question: "A car accelerates from 5.0m s^-1 to 20m s^-1 in 6.0s. Assuming unifrom acceleration, how far does it trvael in this time?",
        AnswerChoices: ["72m", "73m", "74m", "75m"],
        Answer: "75m",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2019, 2032, 2024],
        Similarity_Score: [1.0, 0.26316065513252385, 0.26262452794616803]
    },
    {
        QuestionID: 2015,
        Topics: "Kinematics",
        Question: "If a raindrop were to fall from a height of 1km, with what velocity would it hit the ground if there were no air resistance?",
        AnswerChoices: ["120m s^-1", "130m s^-1", "140m s^-1", "150m s^-1"],
        Answer: "140m s^-1",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2038, 2033, 2037],
        Similarity_Score: [1.0, 0.23605921710759498, 0.1935296112741921]
    },
    {
        QuestionID: 2016,
        Topics: "Kinematics",
        Question: "A student, standing on a platform at a railway station, notices that the first two carriages of an arriving trian pass her in 2.0s, and the next two in 2.4s. The train is decelerating uniformly. Each carriage is 20m long. When the train stops, the student is opposite the last carriage. How mnay carraiges are there in the train?",
        AnswerChoices: ["5", "6", "7", "8"],
        Answer: "8",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2018, 2029, 2013],
        Similarity_Score: [1.0000000000000002, 0.29171852918423424, 0.18930248036411051]
    },
    {
        QuestionID: 2017,
        Topics: "Kinematics",
        Question: "An athlete competing in the long jump leaves the ground at an angle of 28 degree and makes a jump of 7.40m. Calculate the speed at which the athlete took off.",
        AnswerChoices: ["9.1m s^-1", "9.2m s^-1", "9.3m s^-1", "9.4m s^-1"],
        Answer: "9.4m s^-1",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2013, 2033, 2011],
        Similarity_Score: [0.9999999999999999, 0.2285492506418632, 0.1740465550073922]
    },
    {
        QuestionID: 2018,
        Topics: "Kinematics",
        Question: "A train is travelling at an speed of 25m s^-1 along a straight track. A boy walks along the corridor in a carriage towards the rear of the train, at a speedmof 1m s^-1 relative to the train. What is his speed relative to Earth?",
        AnswerChoices: ["22m s^-1", "23m s ^-1", "24m s ^-1", "25m s^-1"],
        Answer: "24m s^-1",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2002, 2016, 2004],
        Similarity_Score: [1.0000000000000002, 0.3078988422718467, 0.29171852918423424]
    },
    {
        QuestionID: 2019,
        Topics: "Kinematics",
        Question: "The average acceleration of a sprinter from the time of leaving the blocks to reaching her maximum speed of 9.0m s^-1 is 6.0m s^-2. For how long does she accelerate?",
        AnswerChoices: ["1.0s", "1.5s", "2.0s", "2.5s"],
        Answer: "1.5s",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2003, 2025, 2014],
        Similarity_Score: [1.0000000000000002, 0.37893218350993857, 0.297413325110737]
    },
    {
        QuestionID: 2020,
        Topics: "Kinematics",
        Question: "A cricketer throws a ball vertically upward into the air with an initial velocity of 18.0m s^-1. How high does the ball go?",
        AnswerChoices: ["15.0m", "15.5m", "16.0m", "16.5m"],
        Answer: "16.5m",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2030, 2010, 2012],
        Similarity_Score: [1.0, 0.4169454474225232, 0.3363018417289563]
    },
    {
        QuestionID: 2021,
        Topics: "Kinematics",
        Question: "A car accelerates uniformly from rest at a rate of 2.5 m/s^2 for 8 seconds. What is its final velocity?",
        AnswerChoices: ["20 m/s", "22 m/s", "25 m/s", "30 m/s"],
        Answer: "20 m/s",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2022, 2029, 2024],
        Similarity_Score: [1.0000000000000002, 0.8070543909675105, 0.5035178500124838]
    },
    {
        QuestionID: 2022,
        Topics: "Kinematics",
        Question: "A rocket accelerates from rest at a rate of 30 m/s^2 for 4 seconds. What is its final velocity?",
        AnswerChoices: ["120 m/s", "100 m/s", "80 m/s", "60 m/s"],
        Answer: "120 m/s",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2021, 2029, 2032],
        Similarity_Score: [1.0000000000000002, 0.8070543909675105, 0.3890437732563687]
    },
    {
        QuestionID: 2023,
        Topics: "Kinematics",
        Question: "A stone is thrown horizontally from the top of a cliff. If it takes 3 seconds to reach the ground and the cliff is 45 meters high, what is the stone's horizontal velocity?",
        AnswerChoices: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
        Answer: "15 m/s",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2038, 2036, 2030],
        Similarity_Score: [1.0, 0.47629784767242944, 0.46262995500216214]
    },
    {
        QuestionID: 2024,
        Topics: "Kinematics",
        Question: "A bicycle accelerates uniformly from 10 m/s to 20 m/s in 5 seconds. What is its acceleration?",
        AnswerChoices: ["2 m/s^2", "3 m/s^2", "4 m/s^2", "5 m/s^2"],
        Answer: "2 m/s^2",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2032, 2027, 2021],
        Similarity_Score: [1.0000000000000004, 0.7550716586110245, 0.5250571832240859]
    },
    {
        QuestionID: 2025,
        Topics: "Kinematics",
        Question: "A sprinter runs at a constant speed of 10 m/s for 20 seconds. How far does the sprinter travel during this time?",
        AnswerChoices: ["200 m", "250 m", "300 m", "350 m"],
        Answer: "200 m",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2039, 2040, 2019],
        Similarity_Score: [1.0, 0.41864260529852126, 0.29952690023686274]
    },
    {
        QuestionID: 2026,
        Topics: "Kinematics",
        Question: "An object is dropped from a height of 100 meters. How long does it take to reach the ground?",
        AnswerChoices: ["5 s", "6 s", "7 s", "8 s"],
        Answer: "5 s",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2035, 2029, 2033],
        Similarity_Score: [1.0000000000000002, 0.4718192899668719, 0.4186358708745549]
    },
    {
        QuestionID: 2027,
        Topics: "Kinematics",
        Question: "A car slows down from 20 m/s to 10 m/s in 4 seconds. What is its acceleration?",
        AnswerChoices: ["-2.5 m/s^2", "-2 m/s^2", "-1.5 m/s^2", "-1 m/s^2"],
        Answer: "-2.5 m/s^2",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2024, 2032, 2034],
        Similarity_Score: [1.0, 0.5250571832240859, 0.42822763717970314]
    },
    {
        QuestionID: 2028,
        Topics: "Kinematics",
        Question: "A projectile is launched at an angle of 30 degrees with an initial velocity of 40 m/s. What is its horizontal velocity component?",
        AnswerChoices: ["20 m/s", "30 m/s", "35 m/s", "40 m/s"],
        Answer: "20 m/s",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2013, 2035, 2037],
        Similarity_Score: [1.0, 0.2972358453122014, 0.2693516570873571]
    },
    {
        QuestionID: 2029,
        Topics: "Kinematics",
        Question: "A train accelerates uniformly from rest at a rate of 2 m/s^2. How long does it take to reach a speed of 25 m/s?",
        AnswerChoices: ["12.5 s", "13 s", "14 s", "15 s"],
        Answer: "12.5 s",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2021, 2026, 2022],
        Similarity_Score: [1.0, 0.5035178500124838, 0.4186358708745549]
    },
    {
        QuestionID: 2030,
        Topics: "Kinematics",
        Question: "A stone is thrown vertically upward with a velocity of 30 m/s. How high does it go?",
        AnswerChoices: ["45 m", "60 m", "75 m", "90 m"],
        Answer: "45 m",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2035, 2037, 2020],
        Similarity_Score: [1.0000000000000002, 0.548734223888327, 0.44425487822822884]
    },
    {
        QuestionID: 2031,
        Topics: "Kinematics",
        Question: "A car travels at a constant speed of 60 km/h for 3 hours. What is the total distance traveled?",
        AnswerChoices: ["180 km", "200 km", "220 km", "240 km"],
        Answer: "180 km",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2039, 2007, 2004],
        Similarity_Score: [1.0000000000000002, 0.3141516055097281, 0.2716364664596108]
    },
    {
        QuestionID: 2032,
        Topics: "Kinematics",
        Question: "A bicycle accelerates from 5 m/s to 15 m/s in 4 seconds. What is its acceleration?",
        AnswerChoices: ["2.5 m/s^2", "3.0 m/s^2", "3.5 m/s^2", "4.0 m/s^2"],
        Answer: "2.5 m/s^2",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2024, 2027, 2034],
        Similarity_Score: [1.0, 0.7550716586110245, 0.42822763717970314]
    },
    {
        QuestionID: 2033,
        Topics: "Kinematics",
        Question: "An object falls freely from a certain height and hits the ground with a velocity of 30 m/s. What is the height from which it fell?",
        AnswerChoices: ["45 m", "60 m", "70 m", "90 m"],
        Answer: "45 m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2026, 2040, 2038],
        Similarity_Score: [1.0000000000000002, 0.3238730872982191, 0.21119939245560787]
    },
    {
        QuestionID: 2034,
        Topics: "Kinematics",
        Question: "A car decelerates from 25 m/s to 10 m/s in 5 seconds. What is its deceleration?",
        AnswerChoices: ["-3 m/s^2", "-3.5 m/s^2", "-4 m/s^2", "-4.5 m/s^2"],
        Answer: "-3 m/s^2",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2027, 2024, 2032],
        Similarity_Score: [1.0000000000000002, 0.37627606242046113, 0.32595449356653483]
    },
    {
        QuestionID: 2035,
        Topics: "Kinematics",
        Question: "A stone is thrown vertically upward with an initial velocity of 20 m/s. How long does it take to reach its maximum height?",
        AnswerChoices: ["2.0 s", "2.5 s", "3.0 s", "3.5 s"],
        Answer: "2.0 s",
        Difficulty_Level: "Intermediate",
        Similar_Question_ID: [2030, 2026, 2029],
        Similarity_Score: [1.0, 0.548734223888327, 0.4718192899668719]
    },
    {
        QuestionID: 2036,
        Topics: "Kinematics",
        Question: "A bullet is fired horizontally with a velocity of 400 m/s from a cliff 80 meters high. How far from the base of the cliff does the bullet hit the ground?",
        AnswerChoices: ["800 m", "1000 m", "1200 m", "1400 m"],
        Answer: "800 m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2023, 2038, 2012],
        Similarity_Score: [1.0, 0.46262995500216214, 0.3466296385813073]
    },
    {
        QuestionID: 2037,
        Topics: "Kinematics",
        Question: "A rocket is launched vertically upward from the ground. If its initial velocity is 50 m/s, how high does it go before starting to fall back down?",
        AnswerChoices: ["125 m", "150 m", "175 m", "200 m"],
        Answer: "125 m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2030, 2020, 2035],
        Similarity_Score: [1.0000000000000004, 0.44425487822822884, 0.32221009694539654]
    },
    {
        QuestionID: 2038,
        Topics: "Kinematics",
        Question: "A stone is thrown horizontally from a bridge with a velocity of 15 m/s. How far does it travel horizontally before hitting the ground, if it takes 2 seconds to hit the ground?",
        AnswerChoices: ["20 m", "25 m", "30 m", "35 m"],
        Answer: "30 m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2023, 2036, 2030],
        Similarity_Score: [1.0000000000000002, 0.47629784767242944, 0.3466296385813073]
    },
    {
        QuestionID: 2039,
        Topics: "Kinematics",
        Question: "A car travels at a constant velocity of 20 m/s for 2 minutes. How far does it travel?",
        AnswerChoices: ["2400 m", "24000 m", "240000 m", "2400000 m"],
        Answer: "2400 m",
        Difficulty_Level: "Easy",
        Similar_Question_ID: [2025, 2005, 2031],
        Similarity_Score: [1.0, 0.41864260529852126, 0.3775940460625063]
    },
    {
        QuestionID: 2040,
        Topics: "Kinematics",
        Question: "A parachutist jumps from a plane and falls freely for 10 seconds before opening the parachute. How far does the parachutist fall during this time?",
        AnswerChoices: ["490 m", "500 m", "510 m", "520 m"],
        Answer: "500 m",
        Difficulty_Level: "Difficult",
        Similar_Question_ID: [2025, 2033, 2014],
        Similarity_Score: [1.0000000000000002, 0.29952690023686274, 0.21119939245560787]
    }
   
];

function startQuiz() {
    console.log('Quiz Starting:', askedQuestionIDs);

    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    difficultyElement.style.display = "inline-block";
    shuffleQuestions(questions); // Shuffle questions for randomization
    originalIncorrectQuestion = null; // Reset originalIncorrectQuestion
    similarQuestionsQueue = []; // Reset similar questions queue
    loadQuestion();

    // Reset questionsAnswered
    questionsAnswered = 0;
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    resetState();
    console.log('Loading Question:', currentQuestionIndex, askedQuestionIDs); 

    currentQuestion = questions[currentQuestionIndex];
    
    questionElement.innerHTML = currentQuestion.Question;
    difficultyElement.innerHTML = currentQuestion.Difficulty_Level;

    currentQuestion.AnswerChoices.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
        
        if(answer === currentQuestion.Answer){
            button.dataset.correct = "true";
        }
        
        // Pass currentQuestion as an argument to selectAnswer
        button.addEventListener("click", (e) => selectAnswer(e, currentQuestion));
        answerButtons.appendChild(button);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
    // Remove existing 'correct' and 'incorrect' classes
    Array.from(answerButtons.children).forEach(button => {
    button.classList.remove("correct", "incorrect");
    button.disabled = false; // Re-enable buttons
  });
}
let originalIncorrectQuestion = null; // Make this global
let similarQuestionsLoaded = false; // Flag to track if similar questions are already loaded

function selectAnswer(e, currentQuestion) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    // Check if the question has not been answered before
    if (!selectedBtn.classList.contains("correct") && !selectedBtn.classList.contains("incorrect")) {
        totalQuestionsAnswered++; // Increment the total questions answered

        // Highlight the selected answer
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
            // Set originalIncorrectQuestion if the selected answer is incorrect
            originalIncorrectQuestion = currentQuestion;
            // Set similar question IDs
            similarQuestionIDs = currentQuestion.Similar_Question_ID.slice(0, 3); // Get the first three similar question IDs
            shuffleQuestions(similarQuestionIDs); // Shuffle similar question IDs for randomization
        }

        // Disable all buttons
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });

        // Show the "Next" button
        nextButton.style.display = "block";
    }
}



let similarQuestionsDisplayed = 0; // Variable to track the number of similar questions displayed for the current incorrect question
let similarQuestionIDs = []; // Array to store the similar question IDs for the current incorrect question
let totalQuestionsAnswered = 0; // Variable to track the total number of questions answered

function nextQuestion() {
    if (originalIncorrectQuestion !== null) {
        loadSimilarQuestion(); // Call loadSimilarQuestion if there's an original incorrect question
    } else {
        handleNextButton(); // Otherwise, proceed with handling the next question as usual
    }
}

function loadSimilarQuestion() {
    // Hide the "Next" button initially
    nextButton.style.display = "none";

    // Load similar questions up to a maximum of 3 times
    if (similarQuestionsDisplayed < 3 && similarQuestionIDs.length > 0) {
        const similarQuestionID = similarQuestionIDs.shift();
        const similarQuestion = questions.find(q => q.QuestionID === similarQuestionID);

        if (similarQuestion) {
            // Display the similar question
            questionElement.innerHTML = similarQuestion.Question;
            difficultyElement.innerHTML = `Difficulty: ${similarQuestion.Difficulty_Level}`;

            // Remove existing answer buttons
            while (answerButtons.firstChild) {
                answerButtons.removeChild(answerButtons.firstChild);
            }

            // Create buttons for each answer choice
            similarQuestion.AnswerChoices.forEach(answer => {
                const button = document.createElement("button");
                button.innerHTML = answer;
                button.classList.add("btn");

                if (answer === similarQuestion.Answer) {
                    button.dataset.correct = "true";
                } else {
                    button.dataset.correct = "false"; // Ensure all incorrect choices are marked as such
                }

                button.addEventListener("click", (e) => selectAnswer(e, similarQuestion));
                answerButtons.appendChild(button);
            });
            similarQuestionsDisplayed++;
        }
    } else {
        // If there are no more similar questions to display or the maximum limit is reached, proceed to the next question
        handleSimilarQuestionEnd();
    }
}

function handleSimilarQuestionEnd() {
    // Reset similar questions displayed count and similar question IDs
    similarQuestionsDisplayed = 0;
    similarQuestionIDs = [];
    // Reset originalIncorrectQuestion to continue the quiz normally
    originalIncorrectQuestion = null;
    // Proceed to the next question or show score if 15 questions have been answered
    if (totalQuestionsAnswered < 15) {
        handleNextButton();
    } else {
        showScore();
    }
}
function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${maxQuestions}!`;
    difficultyElement.style.display = "none";
    nextButton.innerHTML = "Try Again";
    nextButton.style.display = "block"; // Make sure the button is displayed
}
  
// Define a variable to track the number of questions answered
let questionsAnswered = 0;

function handleNextButton() {
    const result = document.querySelector(".result");
    if (result) {
        result.remove();
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < maxQuestions) {
        if (originalIncorrectQuestion !== null) {
            loadSimilarQuestion(originalIncorrectQuestion.Similar_Question_ID);
        } else {
            loadQuestion();
        }
    } else {
        showScore();
        currentQuestionIndex = 0;
        originalIncorrectQuestion = null;
        nextButton.innerHTML = "Try Again";
        nextButton.style.display = "block";
        nextButton.addEventListener("click", handleTryAgain);
    }
}

answerButtons.addEventListener("click", function(e) {
    // Pass the event object and currentQuestion to the selectAnswer function
    selectAnswer(e, currentQuestion);
});

// Event listener for the "Next" button
nextButton.addEventListener("click", () => {
    if (questionsAnswered < maxQuestions) {
        handleNextButton();
    }
});

function handleTryAgain() {
    // Reset all relevant variables and states
    originalIncorrectQuestion = null;
    similarQuestionsDisplayed = 0;
    similarQuestionIDs = [];
    totalQuestionsAnswered = 0;
    score = 0;

    // Remove the event listener for "Try Again"
    nextButton.removeEventListener("click", handleTryAgain);

    // Restart the quiz
    startQuiz();
}

startQuiz(); 
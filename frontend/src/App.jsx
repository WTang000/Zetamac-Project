import { useState, useEffect} from "react"

function App(){
	const [correct, setCorrect] = useState(0);
	const [incorrect, setIncorrect] = useState(0);
	const [time, setTime] = useState(60);
	const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+'})
	const [answer, setAnswer] = useState('')
	const [gameStarted, setGameStarted] = useState(false)
	const [timeLimit, setTimeLimit] = useState(60)

	// operations
	const [enabledOps, setEnabledOps] = useState(['+', '-', '*', '/'])

	// generate random problems
	function problemGenerator(){
		const num1 = Math.floor(Math.random() * 25) + 1
		const num2 = Math.floor(Math.random() * 25) + 1
		const operator = enabledOps[Math.floor(Math.random() * enabledOps.length)]

		setProblem({num1, num2, operator})
	}

	// options for operations 
	function toggleOp(op){
		if ( enabledOps.includes(op) ){
			setEnabledOps(enabledOps.filter(o => o !== op))
		}
		else{
			setEnabledOps([...enabledOps, op])
		}
	}

	// check if answer inputted is correct 
	function checkAnswer(){
		let correctAnswer;

		if ( time === 0 ){
			return
		}

		switch (problem.operator) {
			case '+':
				correctAnswer = problem.num1 + problem.num2
				break;
			case '-':
				correctAnswer = problem.num1 - problem.num2
				break;
			case '*':
				correctAnswer = problem.num1 * problem.num2
				break;
			case '/':
				correctAnswer = problem.num1 / problem.num2
				break;
			default:
				break;
		}

		if (correctAnswer == Number(answer)){
			setCorrect(correct + 1)
		}
		else{
			setIncorrect(incorrect + 1)
		}

		problemGenerator()
		setAnswer('')
	}

	// timer going down -1 second 
	useEffect(() => {
		if (!gameStarted) return
		setTime(timeLimit)

		const id = setInterval(() => {
			setTime(t => {
				if (t <= 1) {
					clearInterval(id)
					return 0
				}

				return t - 1
			})
		}, 1000)

		return () => clearInterval(id)
	}, [gameStarted])

	// acutal game ui
	return (
		<>
		{gameStarted ? (
			/* ui */
			<div>
				<h1>Zetamac</h1>
				<h1>{problem.num1} {problem.operator} {problem.num2} =</h1>
				<input 
					value={answer} 
					onChange={(e) => setAnswer(e.target.value)} 
					onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer() }}
					disabled={time === 0}
				/>

				<p>Correct: {correct} | Incorrect: {incorrect}</p>
				<p>Time: {time}</p>
			</div>
		) : (
			/* settings */
			<div>
				{['+', '-', '*', '/'].map(op => (
					<label key={op}>
					<input 
						type="checkbox" 
						checked={enabledOps.includes(op)} 
						onChange={() => toggleOp(op)} 
					/>
					{op}
					</label>
				))}
				<input
					type="number"
					value={timeLimit}
					onChange={(e) => setTimeLimit(Number(e.target.value))}
				/>

				<button onClick={() => {setTime(timeLimit); setGameStarted(true); problemGenerator() }}>Start</button>
			</div>
		)}
		</>
  	)
}

export default App
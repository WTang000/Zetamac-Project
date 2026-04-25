import { useState, useEffect} from "react"

function App(){
	const [correct, setCorrect] = useState(0);
	const [time, setTime] = useState(60);
	const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+'})
	const [answer, setAnswer] = useState('')
	const [gameStarted, setGameStarted] = useState(false)
	const [timeLimit, setTimeLimit] = useState(60)
	const [num1Range, setNum1Range] = useState({ min: 1, max: 25 })
	const [num2Range, setNum2Range] = useState({ min: 1, max: 25 })

	// operations
	const [enabledOps, setEnabledOps] = useState(['+', '-', '*', '/'])

	// generate random problems
	function problemGenerator(){
		let num1 = Math.floor(Math.random() * (num1Range.max - num1Range.min + 1)) + num1Range.min
		let num2 = Math.floor(Math.random() * (num2Range.max - num2Range.min + 1)) + num2Range.min
		const operator = enabledOps[Math.floor(Math.random() * enabledOps.length)]

		if ( operator == '/' ) num1 = num2 * Math.floor(num1 / num2 ) || num2

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

	// auto check answer
	useEffect(() => {
		if ( answer === '' || !gameStarted ) return
		
		let correctAnswer
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
		}

		if (Number(answer) === correctAnswer ){
			setCorrect(correct + 1)
			problemGenerator()
			setAnswer('')
		}
	}, [answer])

	// game
	return (
		<>
		{!gameStarted ? (
			/* settings */
			<div>
				{/* for custom operations */}
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
				
				{/* for custom time */}
				<input
					type="number"
					value={timeLimit}
					onChange={(e) => setTimeLimit(Number(e.target.value))}
				/>

				{/* for custom difficulty ( number of digits )*/}
				<input type="number" value={num1Range.min} 
					onChange={(e) => {
						const val = Number(e.target.value)
						if (e.target.value !== '' && val >= 0)
							setNum1Range({...num1Range, min: val})
					}}
				/>

				<input type="number" value={num1Range.max} 
					onChange={(e) => {
						const val = Number(e.target.value)
						if (e.target.value !== '' && val >= 0)
							setNum1Range({...num1Range, max: val})
					}}
				/>

				<input type="number" value={num2Range.min} 
					onChange={(e) => {
						const val = Number(e.target.value)
						if (e.target.value !== '' && val >= 0)
							setNum2Range({...num2Range, min: val})
					}}
				/>

				<input type="number" value={num2Range.max} 
					onChange={(e) => {
						const val = Number(e.target.value)
						if (e.target.value !== '' && val >= 0)
							setNum2Range({...num2Range, max: val})
					}}
				/>

				{/* start button */}
				<button onClick={() => {setTime(timeLimit); setGameStarted(true); problemGenerator() }}>Start</button>
			</div>
		) : time === 0 ? (
			/* game over */
			<div>
				<h1> Game Over </h1>
				<p> Correct: {correct} </p>
				<button onClick={() => {
					setGameStarted(false)
					setCorrect(0)
					setAnswer('')
				}}> Play Again </button>
			</div>
		) : (
			/* game ui */
			<div>
				<h1>Zetamac</h1>
				<h1>{problem.num1} {problem.operator} {problem.num2} =</h1>
				<input 
					value={answer} 
					onChange={(e) => setAnswer(e.target.value)} 
					disabled={time === 0}
				/>

				<p>Correct: {correct}</p>
				<p>Time: {time}</p>
			</div>
		)}
		</>
  	)
}

export default App
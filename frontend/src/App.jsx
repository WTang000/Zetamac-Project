import { useState, useEffect, useRef} from "react"
import { card, button, input, label } from './styles'

function App(){
	const [correct, setCorrect] = useState(0);
	const [time, setTime] = useState(60);
	const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+'})
	const [answer, setAnswer] = useState('')
	const [gameStarted, setGameStarted] = useState(false)
	const [timeLimit, setTimeLimit] = useState(60)
	const [num1Range, setNum1Range] = useState({ min: 1, max: 25 })
	const [num2Range, setNum2Range] = useState({ min: 1, max: 25 })
	const [sessions, setSessions] = useState([])
	const [view, setView] = useState('settings')
	const correctRef = useRef(0)

	// operations
	const [enabledOps, setEnabledOps] = useState(['+', '-', '*', '/'])

	// generate random problems
	function problemGenerator(){
		const min1 = num1Range.min || 1
		const max1 = num1Range.max || 25
		const min2 = num2Range.min || 1
		const max2 = num2Range.max || 25

		let num1 = Math.floor(Math.random() * (max1 - min1 + 1)) + num1Range.min
		let num2 = Math.floor(Math.random() * (max2 - min2 + 1)) + num2Range.min
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
					fetch('http://localhost:8000/sessions/', {
						method: 'POST',
						headers: { 'Content-Type' : 'application/json' },
						body: JSON.stringify({
							correct: correctRef.current,
							incorrect: 0,
							avg_time_per_problem: correctRef.current > 0 ? timeLimit / correctRef.current : 0
						})
					})
					fetch('http://localhost:8000/sessions/')
					.then(res => res.json())
					.then(data => setSessions(data))
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
			setCorrect(c => {
				correctRef.current = c + 1
				return c + 1
			})
			problemGenerator()
			setAnswer('')
		}
	}, [answer])

	// game
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">

		{!gameStarted ? (
			<div className={card}>
				<h1 className="text-2xl font-semibold text-gray-800 text-center">Zetamac</h1>

				{view === 'settings' ? (
					<>
						{/* operations */}
						<div className="flex gap-4 justify-center">
							{['+', '-', '*', '/'].map(op => (
								<button
									key={op}
									onClick={() => toggleOp(op)}
									className={enabledOps.includes(op)
									? 'bg-gray-800 text-white rounded-full px-4 py-1 text-sm transition-colors'
									: 'border border-gray-200 text-gray-400 rounded-full px-4 py-1 text-sm hover:border-gray-400 transition-colors'
									}
								>
									{op}
								</button>
							))}
						</div>

						{/* time limit */}
						<div className="flex flex-col gap-1">
							<label className={label}>Time limit (seconds)</label>
							<input
								type="text"
								value={timeLimit}
								onChange={(e) => {
								const val = parseInt(e.target.value)
								if (e.target.value === '') {
									setTimeLimit('')
								} else if (Number.isInteger(val) && val > 0) {
									setTimeLimit(val)
								}
								}}
								className={input}
							/>
						</div>

						{/* number ranges */}
						<div className="flex flex-col gap-1">
							<label className={label}>Number 1 range</label>
							<div className="flex gap-2">

								<input type="text" value={num1Range.min}
									onChange={(e) => {
										const val = parseInt(e.target.value)
										if (e.target.value === '') {
											setNum1Range({...num1Range, min: ''})
										} else if (Number.isInteger(val) && val > 0) {
											setNum1Range({...num1Range, min: val})
										}
									}}
									className={input}
								/>
								<input type="text" value={num1Range.max}
									onChange={(e) => {
										const val = parseInt(e.target.value)
										if (e.target.value === '') {
											setNum1Range({...num1Range, max: ''})
										} else if (Number.isInteger(val) && val > 0) {
											setNum1Range({...num1Range, max: val})
										}
									}}
									className={input}
								/>

							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label className={label}>Number 2 range</label>
							<div className="flex gap-2">

								<input type="text" value={num2Range.min}
									onChange={(e) => {
										const val = parseInt(e.target.value)
										if (e.target.value === '') {
											setNum2Range({...num2Range, min: ''})
										} else if (Number.isInteger(val) && val > 0) {
											setNum2Range({...num2Range, min: val})
										}
									}}
									className={input}
								/>
								<input type="text" value={num2Range.max}
									onChange={(e) => {
										const val = parseInt(e.target.value)
										if (e.target.value === '') {
											setNum2Range({...num2Range, max: ''})
										} else if (Number.isInteger(val) && val > 0) {
											setNum2Range({...num2Range, max: val})
										}
									}}
									className={input}
								/>

							</div>
						</div>

						<div className="flex gap-2">
							<button
								className={button + " flex-1"}
								onClick={() => {
								const tl = timeLimit || 60
								setTime(tl)
								setTimeLimit(tl)
								setNum1Range({ min: num1Range.min || 1, max: num1Range.max || 25 })
								setNum2Range({ min: num2Range.min || 1, max: num2Range.max || 25 })
								setGameStarted(true)
								problemGenerator()
								}}
							>Start</button>
							<button
								className="border border-gray-200 text-gray-500 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors"
								onClick={() => setView('history')}
							>History</button>
						</div>
					</>
				) : (
					<>
						<button
							className="text-sm text-gray-400 hover:text-gray-600 text-left"
							onClick={() => setView('settings')}
						>← Back</button>
						<div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
							{sessions.length === 0 ? (
								<p className={label + " text-center"}>No sessions yet.</p>
							) : (
								sessions.map(s => (
									<div key={s.id} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-1">
										<p className="text-gray-800 font-medium">{s.correct} correct</p>
										<p className={label}>Avg: {s.avg_time_per_problem?.toFixed(2)}s per problem</p>
										<p className={label}>{new Date(s.created_at).toLocaleString()}</p>
									</div>
								))
							)}
						</div>
					</>
				)}
			</div>

		) : time === 0 ? (

			/* game over */
			<div className={card + " items-center"}>
				<h1 className="text-2xl font-semibold text-gray-800">Game Over</h1>
				<p className="text-6xl font-light text-gray-800">{correct}</p>
				<p className={label}>correct answers</p>
				{correct > 0 && (
					<p className={label}>{(timeLimit / correct).toFixed(2)}s per problem</p>
				)}
				<div className="flex gap-2 w-full">
					<button
						className={button + " flex-1"}
						onClick={() => { setGameStarted(false); setCorrect(0); correctRef.current = 0; setAnswer(''); setView('settings') }}
					>Play Again</button>
					<button
						className="border border-gray-200 text-gray-500 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors"
						onClick={() => { setGameStarted(false); setCorrect(0); correctRef.current = 0; setAnswer(''); setView('history') }}
					>History</button>
				</div>
			</div>

		) : (

			/* game ui */
			<div className={card + " items-center"}>
				<h1 className="text-2xl font-semibold text-gray-800">Zetamac</h1>
				<p className="text-4xl font-light text-gray-800">
					{problem.num1} {problem.operator} {problem.num2} =
				</p>
				<input
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					disabled={time === 0}
					className="border border-gray-200 rounded-lg px-3 py-2 text-center text-2xl w-full focus:outline-none focus:border-gray-400"
				/>
				<div className="flex justify-between w-full text-gray-500 text-sm">
					<p>Correct: {correct}</p>
					<p>Time: {time}</p>
				</div>
			</div>
		)}

		</div>
	)
}

export default App

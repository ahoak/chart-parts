import React from 'react'
import ReactDOM from 'react-dom'
import Example from './area-chart'

function App() {
	return (
		<div className="App">
			<Example />
		</div>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

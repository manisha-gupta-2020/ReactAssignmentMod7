function FavoriteColor() {
	const [color, setColor] = React.useState("red")

	return (
		<>
			<h1>My favorite color is {color}!</h1>
			<button type="button" onClick={() => setColor("blue")}>Blue</button>
		</>
	)
}
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<FavoriteColor />)
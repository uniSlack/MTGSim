import React from "react";
import "./App.css";
import PlaySpace from "./components/PlaySpace";

function App() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("http://localhost:3001/api")
            .then((res) => res.json())
            .then((data) => setData(data.message))
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <PlaySpace />
                <p>{!data ? "Loading..." : data}</p>
            </header>
        </div>
    );
}

export default App;
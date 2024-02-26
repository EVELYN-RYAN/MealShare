import './App.css';
import book from './svg/book.svg';
import lightbulb from './svg/lightbulb-solid.svg'
import pot from './img/Pot.png'

function App() {
  return (
    <div className="App">
      <div className="Phone">
        <div className="Navbar">
          <div className="Pot">
            <img src={pot} className="NavIconCenter"/>
          </div>
          <div className="Book">
            <img src={book} className="NavIcon"/>
          </div>
          <div className="Lightbulb">
            <img src={lightbulb} className="NavIcon"></img>
          </div>
          <div className="PageIndicator" style={{}} />
        </div>
      </div>
    </div>
  );
}

export default App;
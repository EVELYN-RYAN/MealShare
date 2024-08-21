import './App.css';
import PageNav from './components/PageNav';
import book from './svg/book.svg';
import lightbulb from './svg/lightbulb-solid.svg'
import pot from './img/Pot.png'
import { connect } from 'react-redux'

function App(props) {
  let page = props.page
  return (
    <div className="App">
      <div className="Phone">
        <PageNav page={page}/>
        <div className="Navbar">
          <button className="Pot" onClick={() => props.changePage('meals')}>
            <img src={pot} className="NavIconCenter"/>
          </button>
          <button className="Book" onClick={() => props.changePage('bookings')}>
            <img src={book} className="NavIcon"/>
          </button>
          <button className="Lightbulb" onClick={() => props.changePage('plan')}>
            <img src={lightbulb} className="NavIcon"></img>
          </button>
          <div className={"PageIndicator " + page} style={{}} />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    page: state.page
  }
};
const mapDispatchToProps = (dispatch) => {
  return{
    changePage: (page) => { dispatch({type: 'CHANGE_PAGE', page: page}) }
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(App);
import './App.css';
import Meals from './pages/Meals';
import book from './svg/book.svg';
import lightbulb from './svg/lightbulb-solid.svg'
import pot from './img/Pot.png'

const person = {
  "personId": 1,
  "firstName": "Ryan",
  "lastName": "Evelyn",
  "family": {
      "familyId": 1,
      "familyName": "The Juice Es",
      "familyMembers": [
          1,
          {
              "personId": 2,
              "firstName": "Heather",
              "lastName": "Evelyn",
              "family": 1,
              "email": "heatehr@rrevelyn.com",
              "password": "hehehe",
              "allergy": [
                  "mushrooms"
              ]
          }
      ],
      "address": "567 S 560 E",
      "city": "Orem",
      "state": "UT",
      "zip": 84097,
      "group": {
          "groupId": 2,
          "groupName": "CVP",
          "families": [
              1,
              {
                  "familyId": 3,
                  "familyName": "The Preece's",
                  "familyMembers": [
                      {
                          "personId": 4,
                          "firstName": "Weston",
                          "lastName": "Evelyn",
                          "family": 3,
                          "email": "weston@rrevelyn.com",
                          "password": "hehehe",
                          "allergy": [
                              "pie"
                          ]
                      }
                  ],
                  "address": "1062 S 200 W",
                  "city": "Orem",
                  "state": "UT",
                  "zip": 84058,
                  "group": 2,
                  "isLeadFamily": true
              }
          ]
      },
      "isLeadFamily": true
  },
  "email": "ryan.evelynd@gmail.com",
  "password": "hehehe",
  "allergy": [
      "Bees"
  ]
}
function App() {
  localStorage.setItem("person", JSON.stringify(person));
  return (
    <div className="App">
      <div className="Phone">
        <Meals/>
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
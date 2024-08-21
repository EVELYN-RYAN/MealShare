const initState = {
   page: "meals",
   person: {
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
                "firstName": "H",
                "lastName": "Evelyn",
                "family": 1,
                "email": "Hevelyn@email.com",
                "password": "hehehe",
                "allergy": [
                    "mushrooms"
                ]
            }
        ],
        "address": "589 W 40 E",
        "city": "American Fork",
        "state": "UT",
        "zip": 84002,
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
                            "email": "weston@email.com",
                            "password": "hehehe",
                            "allergy": [
                                "pie"
                            ]
                        }
                    ],
                    "address": "111 E 205 N",
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
    "email": "ryan@email.com",
    "password": "hehehe",
    "allergy": [
        "Bees"
    ]
  }
}
const rootReducer = (state = initState, action) => {
    if(action.type == "CHANGE_PAGE"){
        return {
            ...state,
            page: action.page
        }
    };

    return state
};

export default rootReducer
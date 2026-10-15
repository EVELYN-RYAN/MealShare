const initState = {
   page: "meals",
   person: {
    "personId": 1,
    "firstName": "Alex",
    "lastName": "Sample",
    "family": {
        "familyId": 1,
        "familyName": "The Samples",
        "familyMembers": [
            1,
            {
                "personId": 2,
                "firstName": "Jordan",
                "lastName": "Sample",
                "family": 1,
                "email": "jordan@example.com",
                "allergy": [
                    "mushrooms"
                ]
            }
        ],
        "address": "123 Example St",
        "city": "Springfield",
        "state": "UT",
        "zip": 84000,
        "group": {
            "groupId": 2,
            "groupName": "Demo Group",
            "families": [
                1,
                {
                    "familyId": 3,
                    "familyName": "The Demos",
                    "familyMembers": [
                        {
                            "personId": 4,
                            "firstName": "Casey",
                            "lastName": "Demo",
                            "family": 3,
                            "email": "casey@example.com",
                            "allergy": [
                                "peanuts"
                            ]
                        }
                    ],
                    "address": "456 Sample Ave",
                    "city": "Springfield",
                    "state": "UT",
                    "zip": 84000,
                    "group": 2,
                    "isLeadFamily": true
                }
            ]
        },
        "isLeadFamily": true
    },
    "email": "alex@example.com",
    "allergy": [
        "bees"
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
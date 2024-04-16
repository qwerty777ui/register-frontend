import React from 'react';
import {ACTIONS} from "@/utils/constants";

const StateContext = React.createContext(undefined);

const initialState = {
    authUser: null,
    access_token: ''
};

const stateReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_ACCESS_TOKEN: {
            return {
                ...state,
                access_token: action.payload,
            }
        }
        case ACTIONS.SET_USER: {
            return {
                ...state,
                authUser: action.payload,
            };
        }
        case ACTIONS.LOGIN: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case ACTIONS.LOGOUT: {
            return {
                ...initialState,
            }
        }
        default: {
            throw new Error(`Unhandled action type`);
        }
    }
};

const StateContextProvider = ({children}) => {
    const [state, dispatch] = React.useReducer(stateReducer, initialState);
    return (
        <StateContext.Provider value={{state, dispatch}}>{children}</StateContext.Provider>
    );
};

export {StateContextProvider, StateContext};

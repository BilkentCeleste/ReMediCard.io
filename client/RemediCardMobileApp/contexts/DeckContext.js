import React, { createContext, useContext, useState } from 'react';
import {getDeckById as getDeckByIdHelper, createDeck as createDeckHelper, getDeckById} from '../apiHelper/backendHelper';

const AuthContext = createContext({
    getDeckById: (body) => {},
    createDeck: (body) => {},
});

export const DeckProvider = ({ children }) => {
    const [deck, setDeck] = useState({});

    const getDeckById = async (body) => {
        getDeckByIdHelper(body)
            .then((res) => {
                setIsLoggedIn( true);
            })
            .catch((err) => {
                console.log(err);
            }) };

    const createDeck = async (body) => {
        createDeckHelper(body)
            .then((res) => {
                set
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <AuthContext.Provider value={{ Deck }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

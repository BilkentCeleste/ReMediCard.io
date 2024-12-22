import React, { createContext, useContext, useState } from 'react';
import {getDeckByDeckId, getDeckById} from '../apiHelper/backendHelper';

const DeckContext = createContext({
    deck: {},
    setDeck: () => {},
    getDeckById: (id) => {},
});

export const DeckProvider = ({ children }) => {
    const [deck, setDeck] = useState({});

    const getDeckById = async (id) => {
        getDeckByDeckId(id)
            .then((res) => {
                console.log(res.data);
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            }) };

    return (
        <DeckContext.Provider value={{ getDeckById, deck, setDeck }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDeck = () => useContext(DeckContext);

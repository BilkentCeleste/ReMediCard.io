import { BASE_URL } from "@/constants/config";

/**
 * @author Faruk Uçgun
 * @date @date 18.12.2024
 * @abstract: This is a helper file to create the url paths for the backend api calls.
 */

// auth
export const LOGIN_PATH = () => `${BASE_URL}/auth/login`;
export const REGISTER_PATH = () => `${BASE_URL}/auth/register`;

// deck
export const CREATE_DECK_PATH = () => `${BASE_URL}/deck/create`;
export const GET_DECKS_BY_CURRENT_USER = () => `${BASE_URL}/deck/getByCurrentUser`;
export const GET_DECKS_BY_USER_ID_PATH = (id) => `${BASE_URL}/deck/getByUserId/{id}`;
export const GET_DECK_BY_DECK_ID_PATH = (id) => `${BASE_URL}/deck/getByDeckId/{id}`;
export const GENERATE_DECK_PATH = () => `${BASE_URL}/deck/generate`;
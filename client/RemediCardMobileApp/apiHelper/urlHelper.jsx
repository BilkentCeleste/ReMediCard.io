import { BASE_URL } from "@/constants/config";

/**
 * @author Faruk Uçgun
 * @date @date 18.12.2024
 * @abstract: This is a helper file to create the url paths for the backend api calls.
 */

// auth
export const LOGIN_PATH = () => `${BASE_URL}/auth/login`;
export const REGISTER_PATH = () => `${BASE_URL}/auth/register`;
export const FORGOT_PASSWORD_PATH = () => `${BASE_URL}/auth/forgot_password`;
export const VERIFY_RESET_PASSWORD_CODE_PATH = () => `${BASE_URL}/auth/verify_reset_passwordcode`;
export const RESET_PASSWORD_PATH = () => `${BASE_URL}/auth/reset_password`;

// deck
export const CREATE_DECK_PATH = () => `${BASE_URL}/deck/create`;
export const DELETE_DECK_PATH = (id) => `${BASE_URL}/deck/delete/${id}`
export const GET_DECKS_BY_CURRENT_USER = () => `${BASE_URL}/deck/getByCurrentUser`;
export const GET_DECKS_BY_USER_ID_PATH = (id) => `${BASE_URL}/deck/getByUserId/${id}`;
export const GET_DECK_BY_DECK_ID_PATH = (id) => `${BASE_URL}/deck/getByDeckId/${id}`;
export const GENERATE_DECK_PATH = () => `${BASE_URL}/deck/generate`;

// flashcard
export const CREATE_FLASHCARD_PATH = () => `${BASE_URL}/flashcard/create`;
export const UPDATE_FLASHCARD_PATH = (id) => `${BASE_URL}/flashcard/update/${id}`;
export const DELETE_FLASHCARD_PATH = (id) => `${BASE_URL}/flashcard/delete/${id}`;

// support
export const CREATE_FEEDBACK_PATH = (id) => `${BASE_URL}/support/feedback`;

// auto generation
export const AUTO_GENERATE_DECK_PATH = () => `${BASE_URL}/auto_generation/generate`

// quiz
export const GET_QUIZZES_BY_CURRENT_USER_PATH = () => `${BASE_URL}/quiz/getByCurrentUser`;
export const DELETE_QUIZ_PATH = (id) => `${BASE_URL}/quiz/delete/${id}`;
export const CREATE_QUIZ_PATH = () => `${BASE_URL}/quiz/create`;

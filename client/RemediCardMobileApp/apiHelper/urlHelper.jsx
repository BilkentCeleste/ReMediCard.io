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
export const SHARE_DECK_PATH = (id) => `${BASE_URL}/deck/share/${id}`;
export const GET_SHARED_DECK_PATH = (shareToken) => `${BASE_URL}/deck/shared/${shareToken}`;
export const COPY_SHARED_DECK_PATH = (shareToken) => `${BASE_URL}/deck/shared/${shareToken}/copy`;

// deck statistics
export const CREATE_DECK_STATS_PATH = () => `${BASE_URL}/deckStats/create`;

// flashcard
export const CREATE_FLASHCARD_PATH = () => `${BASE_URL}/flashcard/create`;
export const UPDATE_FLASHCARD_PATH = (id) => `${BASE_URL}/flashcard/update/${id}`;
export const DELETE_FLASHCARD_PATH = (id) => `${BASE_URL}/flashcard/delete/${id}`;
export const GET_FLASHCARDS_IN_BATCH_PATH = (deckId) => `${BASE_URL}/flashcard/getFlashcardsInBatch/${deckId}`;
export const UPDATE_FLASHCARD_REVIEWS_PATH = () => `${BASE_URL}/flashcard/updateFlashcardReviews`;

// support
export const CREATE_FEEDBACK_PATH = (id) => `${BASE_URL}/support/feedback`;

// auto generation
export const AUTO_GENERATE_DECK_PATH = () => `${BASE_URL}/auto_generation/deck/generate`
export const AUTO_GENERATE_QUIZ_PATH = () => `${BASE_URL}/auto_generation/quiz/generate`

// quiz
export const GET_QUIZZES_BY_CURRENT_USER_PATH = () => `${BASE_URL}/quiz/getByCurrentUser`;
export const DELETE_QUIZ_PATH = (id) => `${BASE_URL}/quiz/delete/${id}`;
export const CREATE_QUIZ_PATH = () => `${BASE_URL}/quiz/create`;
export const GET_QUIZ_BY_QUIZ_ID_PATH = (id) => `${BASE_URL}/quiz/get/${id}`;
export const REMOVE_QUESTION_PATH = (id) => `${BASE_URL}/quiz/removeQuestion/${id}`;
export const CREATE_QUESTION_PATH = () => `${BASE_URL}/question/create`;
export const EDIT_QUESTION_PATH = (id) => `${BASE_URL}/question/update/${id}`;
export const GENERATE_SHARE_TOKEN_PATH = (id) => `${BASE_URL}/quiz/generateShareToken/${id}`;
export const GET_QUIZ_BY_SHARE_TOKEN_PATH = (shareToken) => `${BASE_URL}/quiz/getByShareToken/${shareToken}`;
export const ADD_USER_QUIZ_PATH = (id) => `${BASE_URL}/quiz/addUserQuiz/${id}`;

// profile
export const GET_USER_PROFILE = () => `${BASE_URL}/auth/get_current_user_profile`;


// search 
export const SEARCH_PATH = (searchText) => `${BASE_URL}/search?searchtext=${searchText}`;
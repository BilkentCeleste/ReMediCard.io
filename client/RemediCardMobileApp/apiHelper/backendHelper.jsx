import {
  getFetcher,
  postFetcher,
  putFetcher,
  patchFetcher,
  deleteFetcher,
} from "./apiHelper";
import * as url from "./urlHelper";

/**
 * @author Faruk Uçgun
 * @date 18.12.2024
 * @abstract: This file is responsible for making requests to backend
 */

// auth
export const login = async (data) => {
  return await postFetcher(url.LOGIN_PATH(), data);
}

export const register = async (data) => {
  return await postFetcher(url.REGISTER_PATH(), data);
}

// deck
export const createDeck = async (data) => {
  return await postFetcher(url.CREATE_DECK_PATH(), data);
}

export const getDecksByCurrentUser = async () => {
  return await getFetcher(url.GET_DECKS_BY_CURRENT_USER());
}

export const getDeckByDeckId = async (id) => {
  return await getFetcher(url.GET_DECK_BY_DECK_ID_PATH(id));
}

export const getDecksByUserId = async (id) => {
  return await getFetcher(url.GET_DECKS_BY_USER_ID_PATH(id));
}

export const generateDeck = async (data) => {
  return await postFetcher(url.GENERATE_DECK_PATH(), data, "multipart/form-data");
}
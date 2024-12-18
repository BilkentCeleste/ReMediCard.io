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
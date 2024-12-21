

/**
 * @author Faruk Uçgun
 * @date @date 18.12.2024
 * @abstract: This is a helper file to create the url paths for the backend api calls.
 */

// auth
BASE_URL = "http://localhost:8000";
export const LOGIN_PATH = () => `${BASE_URL}/auth/login`;
export const REGISTER_PATH = () => `${BASE_URL}/auth/register`;


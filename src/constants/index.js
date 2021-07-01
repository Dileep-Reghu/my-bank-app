const webAPIKey = 'AIzaSyAlUjDjAX5fZDqKZTvcw-09jj7OevnXSK4';

export const signUpAPI = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+webAPIKey;
export const signInAPI = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+webAPIKey;
export const updateAPI = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key='+webAPIKey;

export const homePath = '/';
export const signInPath = '/login';
export const signUpPath = '/signup';
export const profilePath = '/profile';
export const loanPath = '/applyloan';
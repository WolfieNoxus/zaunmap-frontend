import * as action from './actionTypes';

export const setUser = (userData: UserData) => ({
    type: action.SET_USER,
    payload: userData,
});

export interface UserData {
    id: string | number;
    username: string;
    email: string;
    displayName: string;
    profilePictureUrl: string;
    role: 'admin' | 'user' | 'guest';
    creationDate: Date;
}

export type UserAction = ReturnType<typeof setUser>;
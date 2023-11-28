import { SET_USER } from './actionTypes';

export const setUser = (userData: UserData) => ({
    type: SET_USER,
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
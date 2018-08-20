import Axios, { AxiosInstance } from 'axios';
import { promises } from 'fs';
import * as shajs from 'sha.js';

export default class SnapClient {
    private client: AxiosInstance;

    constructor() {
        this.client = Axios.create({
            baseURL: 'https://cloud.snap.berkeley.edu/',
        });
    }

    public createUser(username: string, email: string, password: string) {
        password = shajs('sha512').update(password).digest('hex');

        return this.client.post(
            `users/${username}`,
            {},
            {
                params: {
                    email,
                    password,
                    password_repeat: password,
                },
            },
        );
    }
}

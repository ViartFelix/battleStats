type serverResponse = {
	token: string;
	expiresIn: number;
	user: object;
};

type cookieCredidentials = {
	username: string;
	password: string;
};

export { serverResponse, cookieCredidentials };

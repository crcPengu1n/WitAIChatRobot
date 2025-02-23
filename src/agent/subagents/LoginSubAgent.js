import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createLoginSubAgent = (end) => { 
    let stage = 0;
    let username = "";
    let pin = "";

    const handleInitialize = async () => {
        const isLoggedIn = await checkLoginStatus();
        if (isLoggedIn) {
            end();
            return { 
                msg: "You are already logged in. Please log out first before attempting to log in again.",
                emote: AIEmoteType.ERROR
            };
        }
        stage = 1;
        return { msg: "Please provide your username to log in.", emote: AIEmoteType.NORMAL };
    };

    const handleReceive = async (prompt) => {
        if (stage === 1) {
            username = prompt;
            stage = 2;
            return { 
                msg: "Got it! Now, please provide your PIN.", 
                emote: AIEmoteType.NORMAL,
                nextIsSensitive: true
            };
        } else if (stage === 2) {
            pin = prompt; 
            return await attemptLogin(username, pin);
        }
    };

    const checkLoginStatus = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/whoami", {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_9568c27c3a6a527b9724a52eee766af939db28eacd852da1a7bc36a99d014afd"
            },
            credentials: "include"
        });
        const data = await resp.json();
        return data && data.username ? true : false;
    };

    const attemptLogin = async (username, pin) => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_9568c27c3a6a527b9724a52eee766af939db28eacd852da1a7bc36a99d014afd"
            },
            credentials: "include",
            body: JSON.stringify({ username, pin }) 
        });

        if (resp.status === 200) {
            stage = 0;
            end();
            return {
                msg: `You are now successfully logged in as ${username}!`,
                emote: AIEmoteType.SUCCESS
            };
        } else {
            stage = 1;
            return {
                msg: "Incorrect username or PIN. Let's try again! Please provide your username.",
                emote: AIEmoteType.ERROR
            };
        }
    };

    return { handleInitialize, handleReceive };
};

export default createLoginSubAgent;

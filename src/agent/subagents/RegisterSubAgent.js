import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createRegisterSubAgent = (end) => {
    let stage = 0; 
    let username = "";
    let pin = "";
    let confirmPin = "";

    const handleInitialize = async () => {
        stage = 1;
        return { 
            msg: "Let's get you registered! Please provide a username.",
            emote: AIEmoteType.NORMAL
        };
    };

    const handleReceive = async (prompt) => {
        switch (stage) {
            case 1: 
                username = prompt;
                stage = 2;
                return { 
                    msg: "Got it! Now, please provide a 7-digit PIN.", 
                    emote: AIEmoteType.NORMAL,
                    nextIsSensitive: true 
                };

            case 2: 
                if (!isValidPin(prompt)) {
                    return { 
                        msg: "The PIN must be exactly 7 digits. Please provide a valid PIN.",
                        emote: AIEmoteType.ERROR
                    };
                }
                pin = prompt;
                stage = 3;
                return { 
                    msg: "Please confirm your PIN by entering it again.", 
                    emote: AIEmoteType.NORMAL,
                    nextIsSensitive: true
                };

            case 3: 
                if (!isValidPin(prompt)) {
                    stage = 2;
                    return { 
                        msg: "The PIN must be exactly 7 digits. Let's try again. Please provide a valid PIN.",
                        emote: AIEmoteType.ERROR
                    };
                }
                confirmPin = prompt;

                if (pin !== confirmPin) {
                    stage = 2;
                    return { 
                        msg: "The two PINs do not match. Let's start over. Please provide your PIN.",
                        emote: AIEmoteType.ERROR
                    };
                }
                return await attemptRegister(username, pin); 

            default:
                return { 
                    msg: "Unexpected input. Please try again.",
                    emote: AIEmoteType.ERROR
                };
        }
    };


    const isValidPin = (input) => {
        return /^\d{7}$/.test(input); 
    };

 
    const attemptRegister = async (username, pin) => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/register", {
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
                msg: `Successfully registered and logged in as ${username}! Welcome aboard.`,
                emote: AIEmoteType.SUCCESS
            };
        } else if (resp.status === 409) {
            stage = 1; 
            return { 
                msg: "That username is already taken. Please provide a different username.",
                emote: AIEmoteType.ERROR
            };
        } else {
            stage = 1;
            return { 
                msg: "Registration failed due to an error. Please provide a different username.",
                emote: AIEmoteType.ERROR
            };
        }
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createRegisterSubAgent;

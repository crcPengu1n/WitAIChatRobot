import createChatDelegator from "./ChatDelegator";

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "KELEB5THGNMOCPMDYC3XF44KJ76UDIGN"; // Updated CLIENT access token
    const CS571_ID = "bid_9568c27c3a6a527b9724a52eee766af939db28eacd852da1a7bc36a99d014afd";

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571_ID
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleGetHelp = async () => {
        const helpMessages = [
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "You can ask me to 'log in', 'log out', or 'post a message'.",
            "Need help? Try 'show me the latest posts' or 'who am I logged in as'!",
            "Ask me to 'create a post' or 'list chatrooms' for more guidance."
        ];
    
        return { 
            msg: ofRandom(helpMessages),
        };
    };

    const handleGetChatrooms = async () => {
        if (chatrooms.length === 0) {
            return "I don't have any chatrooms right now. Try initializing me first!";
        }
        const chatroomList = chatrooms.map(room => `- ${room}`).join("\n");
        return `Here are the available chatrooms:\n${chatroomList}`;
    }

    const handleGetMessages = async (data) => {
        let numberOfMessages = 1; 
        let chatroom = null; 

 
        if (data.entities) {
            if (data.entities["wit$number:number"] && data.entities["wit$number:number"].length > 0) {
                numberOfMessages = Math.min(10, parseInt(data.entities["wit$number:number"][0].value));
            }
            if (data.entities["chatroom_name:chatroom_name"] && data.entities["chatroom_name:chatroom_name"].length > 0) {
                chatroom = data.entities["chatroom_name:chatroom_name"][0].value;
            }
        }

   
        const url = chatroom
            ? `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${encodeURIComponent(chatroom)}&num=${numberOfMessages}`
            : `https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?num=${numberOfMessages}`;

        const resp = await fetch(url, {
            headers: {
                "X-CS571-ID": CS571_ID
            }
        });

        const response = await resp.json();

    
        if (!response || !response.messages || response.messages.length === 0) {
            return "There are no messages to show!";
        }

        const formattedMessages = response.messages.map(msg => 
            `In ${msg.chatroom}, ${msg.poster} created a post titled '${msg.title}' saying '${msg.content}'`
        ).join("\n");

        return `Here are the latest ${numberOfMessages} message(s):\n${formattedMessages}`;
    }

    const handleLogin = async () => {
        const isLoggedIn = await checkLoginStatus();
        if (isLoggedIn) {
            return "You are already logged in. Please log out first before attempting to log in again.";
        }
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        const isLoggedIn = await checkLoginStatus();
        if (isLoggedIn) {
            return "You are already logged in. Please log out first before attempting to register a new account.";
        }
        return await delegator.beginDelegation("REGISTER");
    }

    const handleWhoAmI = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/whoami", {
            method: "GET",
            headers: {
                "X-CS571-ID": CS571_ID
            },
            credentials: "include"
        });

        const data = await resp.json();
        if (data && data.isLoggedIn && data.user && data.user.username) {
            return `You are currently logged in as ${data.user.username}.`;
        } else {
            return "You are not currently logged in.";
        }
    }

    const checkLoginStatus = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/whoami", {
            headers: {
                "X-CS571-ID": CS571_ID
            },
            credentials: "include"
        });
        const data = await resp.json();
        return data && data.isLoggedIn ? true : false;
    }

    const handleCreateMessage = async (data) => {
        const isLoggedIn = await checkLoginStatus();
        if (!isLoggedIn) {
            return "You must be logged in to create a post.";
        }

        let chatroom = null;
        if (data.entities && data.entities["chatroom_name:chatroom_name"] && data.entities["chatroom_name:chatroom_name"].length > 0) {
            chatroom = data.entities["chatroom_name:chatroom_name"][0].value;
        }

        if (!chatroom) {
            return "You must specify a chatroom to create a post.";
        }

        return await delegator.beginDelegation("CREATE", { chatroom });
    }

    const handleLogout = async () => {
        const isLoggedIn = await checkLoginStatus();
        if (!isLoggedIn) {
            return "You are not currently logged in. Please log in first before attempting to log out.";
        }
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/logout", {
            method: "POST",
            headers: {
                "X-CS571-ID": CS571_ID
            },
            credentials: "include"
        });
        if (resp.status === 200) {
            return "You have been successfully logged out.";
        } else {
            return "Something went wrong while logging out. Please try again later.";
        }
    }

    const ofRandom = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;

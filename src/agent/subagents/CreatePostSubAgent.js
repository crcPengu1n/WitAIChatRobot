const createPostSubAgent = (end) => {
    let stage = 0; 
    let chatroom = "";
    let title = "";
    let content = "";

    const handleInitialize = async (promptData) => {
        if (promptData && promptData.chatroom) {
            chatroom = promptData.chatroom;
            stage = 1;
            return `Let's create a post in ${chatroom}. What would you like the title of the post to be?`;
        } else {
            end();
            return "I need a chatroom to post in. Operation cancelled.";
        }
    };

    const handleReceive = async (prompt) => {
        if (stage === 1) {
            title = prompt;
            stage = 2;
            return `Got it! The title is '${title}'. What would you like the content of the post to be?`;
        } else if (stage === 2) {
            content = prompt;
            stage = 3;
            return `Please confirm: You want to post in '${chatroom}' with title '${title}' and content '${content}'. Type 'yes' to confirm or 'no' to cancel.`;
        } else if (stage === 3) {
            if (prompt.toLowerCase() === "yes") {
                const result = await attemptCreatePost(chatroom, title, content);
                end();
                return result;
            } else {
                end();
                return "The post has been cancelled. Let me know if you need anything else!";
            }
        }
    };

    const attemptCreatePost = async (chatroom, title, content) => {
        const resp = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${encodeURIComponent(chatroom)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_9568c27c3a6a527b9724a52eee766af939db28eacd852da1a7bc36a99d014afd"
            },
            credentials: "include", 
            body: JSON.stringify({ title, content })
        });

        if (resp.status === 200) {
            return `Your post titled '${title}' has been successfully created in '${chatroom}'.`;
        } else {
            return "Something went wrong while creating your post. Please try again later.";
        }
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createPostSubAgent;

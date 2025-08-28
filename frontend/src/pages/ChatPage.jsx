// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router";
// import { getMessages, sendMessage } from "../lib/api";

// const ChatPage = () => {
//   const { id: chatId } = useParams();          // ✅ read chatId from route
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const bottomRef = useRef(null);

//   // Load messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!chatId) return;
//       try {
//         setLoading(true);
//         const data = await getMessages(chatId); // expects array
//         setMessages(data || []);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();
//   }, [chatId]);

//   // Auto-scroll to newest message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     const text = newMessage.trim();
//     if (!text) return;

//     try {
//       // backend should return the saved message (with _id, sender, text)
//       const saved = await sendMessage(chatId, text);
//       setMessages((prev) => [...prev, saved]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (loading) {
//     return <div className="p-4">Loading chat…</div>;
//   }

//   return (
//     <div className="h-[93vh] flex flex-col">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-200">
//         {messages?.length ? (
//           messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`max-w-[70%] rounded-lg px-3 py-2 ${
//                 msg?.isMine || msg?.sender?._id === (msg?.meId || "") // defensive
//                   ? "ml-auto bg-primary text-primary-content"
//                   : "mr-auto bg-base-100"
//               }`}
//             >
//               <div className="text-sm opacity-70 mb-1">
//                 {msg?.sender?.fullName ?? "User"}
//               </div>
//               <div>{msg?.text}</div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-sm opacity-70">No messages yet</div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Composer */}
//       <div className="p-3 border-t bg-base-100">
//         <div className="flex gap-2">
//           <textarea
//             className="textarea textarea-bordered flex-1"
//             rows={1}
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={onKeyDown}
//             placeholder="Type a message…"
//           />
//           <button className="btn btn-primary" onClick={handleSendMessage}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
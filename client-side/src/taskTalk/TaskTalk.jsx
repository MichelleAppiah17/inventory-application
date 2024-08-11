// 
import { useState, useEffect, useContext, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { AuthContext } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
} from "firebase/database";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:5000");

function TaskTalk() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [TaskTalk, setTaskTalk] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const dbRealtime = getDatabase();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userStatusRef = ref(dbRealtime, `status/${user.uid}`);

    const isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: "online",
      last_changed: serverTimestamp(),
    };

    set(userStatusRef, isOnlineForDatabase);

    onDisconnect(userStatusRef).set(isOfflineForDatabase);

    socket.emit("newUser", userName);

    // Listen for incoming messages
    socket.on("chatMessage", (msg) => {
      if (selectedChat && msg.chatId === selectedChat.id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    });

    socket.on("typing", (status) => {
      setTypingStatus(status);
    });

    const q = query(
      collection(db, "TaskTalk"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userTaskTalk = [];
      querySnapshot.forEach((doc) => {
        userTaskTalk.push({ id: doc.id, ...doc.data() });
      });
      setTaskTalk(userTaskTalk);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("typing");
      unsubscribe();
      set(userStatusRef, isOfflineForDatabase);
    };
  }, [user, navigate, userName, selectedChat]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const usersSnapshot = collection(db, "users");
      const querySnapshot = await getDocs(usersSnapshot);
      const foundUsers = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((user) =>
          user.userName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      setUsers(foundUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allUsers = usersSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSelectChat = async (selectedUser) => {
    const chatId =
      user.uid > selectedUser.uid
        ? `${user.uid}_${selectedUser.uid}`
        : `${selectedUser.uid}_${user.uid}`;
    const chatDocRef = doc(db, "TaskTalk", chatId);
    const chatSnapshot = await getDoc(chatDocRef);

    if (!chatSnapshot.exists()) {
      await setDoc(chatDocRef, {
        participants: [user.uid, selectedUser.uid],
        lastMessage: "",
        timestamp: serverTimestamp(),
      });
    }

    setSelectedChat({ id: chatId, ...chatSnapshot.data() });

    // Fetch messages from the messages subcollection
    const messagesRef = collection(
      db,
      "TaskTalk",
      chatId,
      "messages"
    );
    const messagesSnapshot = await getDocs(messagesRef);
    const chatMessages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages(chatMessages);
  };

  useEffect(()=>{

  })


  const handleTyping = () => {
    socket.emit("typing", `${userName} is typing...`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && user && selectedChat) {
      const timestamp = new Date();
      const messageId = timestamp.getTime().toString();

      const chatMessage = {
        id: messageId,
        userId: user.uid,
        userName: userName,
        text: message,
        timestamp,
        chatId: selectedChat.id,
      };

      try {
        const messagesRef = collection(
          db,
          "TaskTalk",
          selectedChat.id,
          "messages"
        );
        await setDoc(doc(messagesRef, messageId), chatMessage);

        const chatDocRef = doc(db, "TaskTalk", selectedChat.id);
        await updateDoc(chatDocRef, {
          lastMessage: chatMessage.text,
          timestamp: chatMessage.timestamp,
        });

        socket.emit("chatMessage", chatMessage);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("Message can't be empty.");
    }
  };

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className='flex h-screen p-20'>
      <div className='sidebar p-4 w-1/4 border-r border-gray-300'>
        <h2 className='text-xl mb-4'>TaskTalk</h2>
        <form onSubmit={handleSearch} className='mb-4'>
          <input
            type='text'
            placeholder='Search users'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full p-2 border rounded'
          />
          <button
            type='submit'
            className='w-full p-2 mt-2 bg-blue-500 text-white rounded'>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
        <ul>
          Recent Chats
          {TaskTalk.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`p-2 cursor-pointer ${
                selectedChat && selectedChat.id === chat.chatId
                  ? "bg-gray-200 rounded-lg"
                  : "border"
              }`}>
              {chat.participants
                .filter((participant) => participant !== user.uid)
                .join(", ")}
              <br />
              <small>{chat.lastMessage}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className='chat-container p-4 w-3/4 flex flex-col'>
        {selectedChat ? (
          <>
            <div className='messages flex-1 overflow-y-auto p-4'>
              {/* Chat Dialog Header */}
              <div className='chat-header mb-4'>
                <h2 className='text-2xl font-semibold'>
                  Chat Dialog
                </h2>
              </div>
              {/* Message List */}
              <div className='message-list'>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message p-3 mb-2 rounded-lg max-w-xs ${
                      msg.userId === user.uid
                        ? "bg-blue-100 self-end ml-auto text-right border border-blue-500"
                        : "bg-gray-100 border border-gray-500"
                    }`}>
                    <div className='message-content'>
                      <strong>{msg.userName}:</strong> {msg.text}
                    </div>
                    <div className='message-timestamp text-xs text-gray-500'>
                      {new Date(
                        msg.timestamp?.toDate()
                      ).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={lastMessageRef} />
              </div>
            </div>
            <form
              onSubmit={handleSendMessage}
              className='chat-form flex'>
              <input
                type='text'
                placeholder='Type a message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
                className='flex-1 p-2 border rounded'
              />
              <button
                type='submit'
                className='ml-2 p-2 bg-blue-500 text-white rounded'>
                Send
              </button>
            </form>
            <div className='message__status mt-2'>
              <p className='text-gray-500 text-sm'>{typingStatus}</p>
            </div>
            <button
              onClick={handleLeaveChat}
              className='mt-4 bg-blue-500 text-white p-2 rounded'>
              Leave Chat
            </button>
            <button
              onClick={logout}
              className='mt-4 bg-slate-500 text-white p-2 rounded'>
              Logout
            </button>
          </>
        ) : (
          <div>
            <h3 className='mb-4 text-xl'>Users</h3>
            {users.length > 0 ? (
              users.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectChat(item)}
                  className='p-2 border-b cursor-pointer'>
                  {item.userName} ({item.email})
                  <span
                    className={`ml-2 inline-block w-2 h-2 rounded-full ${
                      item.status?.state === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}></span>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTalk;

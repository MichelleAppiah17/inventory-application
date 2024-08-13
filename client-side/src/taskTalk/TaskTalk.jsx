/* eslint-disable no-unused-vars */
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
// the realtime database doesnt matter now I'm using cloud firestore but dont remove it 
// for future use only
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
} from "firebase/database";
import { signOut } from "firebase/auth";
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
  const [showChat, setShowChat] = useState(false);

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
    setShowChat(true);
    const chatId = selectedUser.chatId
      ? selectedUser.chatId
      : `${user.uid}_${selectedUser.uid}`;
    const chatDocRef = doc(db, "TaskTalk", chatId);
    const chatSnapshot = await getDoc(chatDocRef);

    if (!chatSnapshot.exists()) {
      await setDoc(chatDocRef, {
        participants: [user.uid, selectedUser.uid],
        chatId: selectedChat.id,
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

  useEffect(() => {});

  const handleTyping = () => {
    socket.emit("typing", `${userName} is typing...`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.length > 0 && user && selectedChat) {
      const timestamp = new Date();
      const messageId = timestamp.getTime().toString();

      const chatMessage = {
        id: messageId,
        userId: user.uid,
        userName: userName,
        text: message,
        // date
        timestamp,
        chatId: selectedChat.id,
        participants: [
          user.uid,
          selectedChat.participants[1] !== user.uid
            ? selectedChat.participants[1]
            : selectedChat.participants[0],
        ],
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
          chatId: selectedChat.id,
          participants: [
            user.uid,
            selectedChat.participants[1] !== user.uid
              ? selectedChat.participants[1]
              : selectedChat.participants[0],
          ],
        });

        socket.emit("chatMessage", chatMessage);
        setMessage("");
        handleSelectChat(selectedChat);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("Message can't be empty.");
    }
  };

  const handleLeaveChat = () => {
    setShowChat(false);
  };

  // useEffect(()=>{

  // })

  return (
    <div className='flex h-screen p-20'>
      <div className='sidebar sticky p-4 w-1/4 border-r border-gray-300'>
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
        <ul className='flex flex-col gap-2'>
          Recent Chats
          {TaskTalk.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`p-2 cursor-pointer hover:bg-slate-300 ${
                selectedChat && selectedChat.id === chat.chatId
                  ? "bg-gray-200 rounded-lg"
                  : "border"
              } ${
                chat.participants[0] === chat.participants[1]
                  ? "hidden"
                  : "block"
              }`}>
              {chat.participants
                .filter((participantId) => participantId !== user.uid)
                .map((participantId) => {
                  const participant = users.find(
                    (user) => user.uid === participantId
                  );
                  return (
                    <div key={participantId} className=''>
                      <p>
                        {participant
                          ? participant.name
                          : "Unknown User"}
                      </p>
                      <small>
                        recent message: {chat.lastMessage}
                      </small>
                    </div>
                  );
                })}
            </li>
          ))}
        </ul>
      </div>
      <div className=' p-4 w-3/4 flex flex-col'>
        <div>
          {showChat === true ? (
            <div>
              <div className='mb-2'>
                <h2 className='text-2xl font-semibold'>
                  Chat Dialog
                </h2>
              </div>
              <div className=' flex-1 overflow-y-auto mb-2  border-2 border-dotted rounded-l p-4 h-[18.5em] scrollbar-none scrollbar-thumb-sky-700 scrollbar-track-sky-300'>
                {/* Message List */}
                <div className='message-list '>
                  {messages.map((msg) => {
                    const participant = users.find(
                      (user) => user.uid === messages.userId
                    );
                    return (
                      <div
                        key={msg.id}
                        className={`message p-2 mb-2 rounded-lg max-w-xs ${
                          msg.userId === user.uid
                            ? "bg-blue-100 self-end ml-auto text-right border border-blue-500"
                            : "bg-gray-100 border border-gray-500"
                        }`}>
                        <div className='message-content'>
                          <strong>
                            {msg.userId === user.uid
                              ? "You"
                              : `{Participant}`}
                          </strong>
                          <p>{msg.text}</p>
                        </div>
                        <div className='message-timestamp text-xs text-gray-500'>
                          {new Date(
                              msg.timestamp?.toDate()
                            ).toLocaleTimeString() +" "+new Date(
                            msg.timestamp?.toDate()
                          ).toDateString()
                            }
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div ref={lastMessageRef} />
                <div className='message__status mt-2'>
                  <p className='text-gray-500 text-sm'>
                    {typingStatus}
                  </p>
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
                  onKeyDown={handleTyping}
                  className='flex-1 p-2 border rounded'
                />
                <button
                  type='submit'
                  className='ml-2 p-2 bg-blue-500 text-white rounded'>
                  Send
                </button>
              </form>

              <div className='flex flex-col'>
                <button
                  onClick={handleLeaveChat}
                  className='mt-2 bg-blue-500 text-white p-2 rounded'>
                  Leave Chat
                </button>
                <button
                  onClick={logout}
                  className='mt-2 bg-slate-500 text-white p-2 rounded'>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className='mb-4 text-xl'>Users</h3>
              {users.length > 0 ? (
                users.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectChat(item)}
                    className={`p-2 border-b cursor-pointer ${
                      item.userId === user.uid ? "hidden" : "block"
                    }`}>
                    {item.name} ({item.role})
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
    </div>
  );
}

export default TaskTalk;
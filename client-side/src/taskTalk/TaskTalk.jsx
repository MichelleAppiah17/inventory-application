import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config"; // Adjust the import path as needed
import { AuthContext } from "../contexts/AuthProvider"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000"); // Update to your server URL

function TaskTalk() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user, logout } = useContext(AuthContext); // Assuming user context provides user info
  const navigate = useNavigate();
  const chatRef = collection(db, "TaskTalk"); // Firestore collection

  useEffect(() => {
    if (user === null) {
      // Redirect to login if user is not authenticated
      navigate("/login");
      return;
    }

    // Listen for incoming messages
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Fetch and listen for chats from Firestore
    const q = query(
      chatRef,
      where("userIds", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push(doc.data());
      });
      setMessages(chats);
    });

    // Cleanup on unmount
    return () => {
      socket.off("chatMessage");
      unsubscribe();
    };
  }, [user, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message && user) {
      const chatMessage = {
        userId: user.uid,
        text: message,
        timestamp: new Date(),
      };

      // Save message to Firestore
      try {
        await addDoc(chatRef, {
          ...chatMessage,
          userIds: [user.uid], // Save user ID to filter chats
        });

        // Emit message to other users via Socket.IO
        socket.emit("chatMessage", chatMessage);
        setMessage("");
      } catch (error) {
        console.error("Error adding message to Firestore:", error);
      }
    } else {
      alert("Message can't be empty.");
    }
  };

  return (
    <div className='p-20 flex flex-col items-center'>
      <h1>Inventory TaskTalk</h1>
      <p>
        A place where you can connect with your book seller or buyer
      </p>
      <p>Chat with vendor</p>
      {user ? (
        <div className='chat-window'>
          <div className='messages'>
            {messages.map((msg, index) => (
              <div key={index} className='message'>
                <strong>User {msg.userId}:</strong> {msg.text}{" "}
                <span>
                  {new Date(
                    msg.timestamp.toDate()
                  ).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className='chat-form'>
            <input
              type='text'
              placeholder='Type a message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit'>Send</button>
          </form>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access the chat feature.</p>
      )}
    </div>
  );
}

export default TaskTalk;

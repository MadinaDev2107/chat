import { useEffect, useState } from "react";
import { ref, onValue, set, remove, push } from "firebase/database";
import { database } from "../utils/firebase.config";
import { Edit, Trash } from "lucide-react";

interface Message {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  recievedId: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [SelectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });
  const userId = localStorage.getItem("token") || "Anonymous";

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (SelectedUser.id) {
      getMessages(SelectedUser.id);
    } else {
      setMessages([]);
    }
  }, [SelectedUser]);

  function getUsers() {
    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userArr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(userArr);
      } else {
        setUsers([]);
      }
    });
  }

  function getMessages(selectedUserId: string) {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArr = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter(
            (msg) =>
              (msg.senderId === userId && msg.recievedId === selectedUserId) ||
              (msg.senderId === selectedUserId && msg.recievedId === userId)
          );
        setMessages(messagesArr);
      } else {
        setMessages([]);
      }
    });
  }

  function sendMessage() {
    if (!newMessage || !SelectedUser.id || !userId) return;

    const foundUser = users.find((user) => user.id === userId);
    const senderName = foundUser ? foundUser.name : "Unknown";

    push(ref(database, "messages"), {
      senderId: userId,
      senderName,
      recievedId: SelectedUser.id,
      text: newMessage,
    });

    setNewMessage("");
  }

  function deleteMessage(id: string) {
    remove(ref(database, `messages/${id}`));
  }

  function editMessage(msg: Message) {
    setEditingMessage(msg.id!);
    setEditedMessage(msg.text);
  }

  function saveEdit(id: string) {
    set(ref(database, `messages/${id}/text`), editedMessage);
    setEditingMessage(null);
    setEditedMessage("");
  }

  return (
    <div className="chat-container w-100 mx-auto mt-4 d-flex">
      <div className="users-list border p-3" style={{ width: "25%" }}>
        <h5>Users</h5>
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className={`p-2 border-bottom ${
                SelectedUser.id === user.id ? "bg-secondary text-white" : ""
              }`}
              onClick={() => setSelectedUser({ id: user.id, name: user.name })}
              style={{ cursor: "pointer" }}
            >
              {user.name}
            </div>
          );
        })}
      </div>

      <div className="users-list border p-3" style={{ width: "75%" }}>
        <h4> {SelectedUser?.name ? SelectedUser.name : "Chat"}</h4>
        <div
          className="chat-box border p-3 d-flex flex-column overflow-auto"
          style={{ height: "80vh" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex ${
                msg.senderId === userId
                  ? "justify-content-start"
                  : "justify-content-end"
              } mb-2`}
              onDoubleClick={() => setSelectedMessage(msg.id!)}
            >
              {editingMessage === msg.id ? (
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  onBlur={() => saveEdit(msg.id!)}
                  autoFocus
                  className="form-control"
                />
              ) : (
                <div
                  className={`p-3 rounded shadow-sm text-wrap ${
                    msg.senderId === userId
                      ?  "bg-light text-dark"
                      : "bg-primary text-white"
                  }`}
                  style={{
                    maxWidth: "60%",
                    borderRadius: "15px",
                  }}
                >
                  <small className="d-block text-muted">{msg.senderName}</small>
                  {msg.text}
                </div>
              )}

              {selectedMessage === msg.id && msg.senderId === userId && (
                <div className="ms-2">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => editMessage(msg)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteMessage(msg.id!)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

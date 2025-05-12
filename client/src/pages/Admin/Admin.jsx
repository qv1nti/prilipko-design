import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.scss";

const Admin = () => {
  const [section, setSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (section === "users") {
      axios
        .get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Помилка завантаження:", err));
    }
  }, [section]);

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await axios.put(
      `/api/admin/users/${id}`,
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
    );
  };

  const handleBlockToggle = async (id, isBlocked) => {
    await axios.put(
      `/api/admin/users/${id}`,
      { isBlocked: !isBlocked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isBlocked: !isBlocked } : u))
    );
  };

  const handleSaveEdit = async () => {
    try {
      const { _id, firstName, lastName, phone, email } = editingUser;
      await axios.put(
        `/api/admin/users/${_id}`,
        { firstName, lastName, phone, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === _id ? { ...u, firstName, lastName, phone, email } : u
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Помилка редагування користувача:", err);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <button onClick={() => setSection("users")}>Користувачі</button>
        <button onClick={() => setSection("products")}>Товари</button>
        <button onClick={() => setSection("orders")}>Замовлення</button>
      </aside>

      <main className="content">
        {section === "users" && (
          <div>
            <h2>Список користувачів</h2>
            <table>
              <thead>
                <tr>
                  <th>Ім’я</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className={editingUser?._id === u._id ? "name-editing" : ""}>
                      {editingUser?._id === u._id ? (
                        <div className="name-inputs">
                          <input
                            placeholder="Ім’я"
                            value={editingUser.firstName}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, firstName: e.target.value })
                            }
                          />
                          <input
                            placeholder="Прізвище"
                            value={editingUser.lastName}
                            onChange={(e) =>
                              setEditingUser({ ...editingUser, lastName: e.target.value })
                            }
                          />
                        </div>
                      ) : (
                        `${u.firstName} ${u.lastName}`
                      )}
                    </td>
                    <td>
                      {editingUser?._id === u._id ? (
                        <input
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                        />
                      ) : (
                        u.email
                      )}
                    </td>

                    <td>
                      {editingUser?._id === u._id ? (
                        <input
                          value={editingUser.phone}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              phone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        u.phone
                      )}
                    </td>
                    <td>{u.role}</td>
                    <td>{u.isBlocked ? "Заблокований" : "Активний"}</td>
                    <td>
                      {editingUser?._id === u._id ? (
                        <>
                          <button onClick={handleSaveEdit}>💾 Зберегти</button>
                          <button onClick={() => setEditingUser(null)}>❌</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingUser(u)}>✏️</button>
                          <button onClick={() => handleRoleChange(u._id, u.role)}>
                            {u.role === "admin" ? "→ User" : "→ Admin"}
                          </button>
                          <button
                            onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                          >
                            {u.isBlocked ? "Розблокувати" : "Заблокувати"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section === "products" && (
          <div>
            <h2>Управління товарами</h2>
            <p>Тут буде реалізація товарів...</p>
          </div>
        )}

        {section === "orders" && (
          <div>
            <h2>Замовлення</h2>
            <p>Тут буде реалізація замовлень...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

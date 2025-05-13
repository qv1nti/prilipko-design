import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import "./Admin.scss";

const Admin = () => {
  const [section, setSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dragImage, setDragImage] = useState(null);
  const fileInputRef = useRef(null);
  // === USERS ===
  useEffect(() => {
  const token = localStorage.getItem("token");

    if (section === "users") {
      axios
        .get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Помилка завантаження:", err));
    }

    if (section === "products") {
      axios
        .get("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Помилка товарів:", err));
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

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.imagePath;
      setDragImage(imageUrl);
      setEditingProduct({ ...editingProduct, image: imageUrl });
    } catch (err) {
      console.error("Помилка завантаження зображення:", err);
      alert("Помилка при завантаженні зображення");
    }
  };

  // === PRODUCTS ===

  const updateProductField = (index, field, value) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const saveNewProduct = async (index) => {
    try {
      const product = products[index];
      const { data } = await axios.post("/api/admin/products", product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...data, isNew: false } : p))
      );
    } catch (err) {
      console.error("Помилка додавання товару:", err);
    }
  };

  const saveProduct = async (id, index, updated = null) => {
  try {
    const product = updated || products[index];

    const res = product.isNew
      ? await axios.post("/api/admin/products", product, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : await axios.put(`/api/admin/products/${id}`, product, {
          headers: { Authorization: `Bearer ${token}` },
        });

    const newProduct = res.data;

    if (product.isNew) {
      setProducts((prev) => [...prev, { ...newProduct, isNew: false }]);
    } else {
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...newProduct, isNew: false } : p))
      );
    }

    setEditingProduct(null);
    setDragImage(null);
  } catch (err) {
    console.error("Помилка збереження товару:", err);
  }
};



  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Помилка видалення товару:", err);
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
        {/* === КОРИСТУВАЧІ === */}
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
                            setEditingUser({ ...editingUser, phone: e.target.value })
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
                          <button onClick={() => handleBlockToggle(u._id, u.isBlocked)}>
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

        {/* === ТОВАРИ === */}
        {section === "products" && (
          <div>
            <h2>🛍 Список товарів</h2>
            <button
              onClick={() =>
                setEditingProduct({
                  _id: Date.now(),
                  name: "",
                  description: "",
                  price: 0,
                  category: "",
                  image: "",
                  inStock: true,
                  isNew: true,
                })
              }
            >
              ➕ Додати товар
            </button>
            <table>
              <thead>
                <tr>
                  <th>Назва</th>
                  <th>Ціна</th>
                  <th>Категорія</th>
                  <th>Фото</th>
                  <th>Наявність</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <input
                        value={p.name}
                        disabled={!p.isNew && editingProductIndex !== i}
                        onChange={(e) =>
                          updateProductField(i, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={p.price}
                        disabled={!p.isNew && editingProductIndex !== i}
                        onChange={(e) =>
                          updateProductField(i, "price", Number(e.target.value))
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={p.category}
                        disabled={!p.isNew && editingProductIndex !== i}
                        onChange={(e) =>
                          updateProductField(i, "category", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={p.image}
                        disabled={!p.isNew && editingProductIndex !== i}
                        onChange={(e) =>
                          updateProductField(i, "image", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={p.inStock}
                        disabled={!p.isNew && editingProductIndex !== i}
                        onChange={(e) =>
                          updateProductField(i, "inStock", e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      {p.isNew ? (
                        <button onClick={() => saveNewProduct(i)}>💾 Зберегти</button>
                      ) : (
                        <>
                          {editingProductIndex === i ? (
                          <>
                            <button onClick={() => saveProduct(p._id, i)}>💾 Зберегти</button>
                            <button
                              onClick={() => {
                                setProducts((prev) =>
                                  prev.map((item, idx) =>
                                    idx === i ? originalProduct : item
                                  )
                                );
                                setEditingProductIndex(null);
                                setOriginalProduct(null);
                              }}
                            >
                              ❌ Скасувати
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProduct({ ...products[i] });
                            }}
                          >
                            ✏️ Редагувати
                          </button>
                        )}
                          <button onClick={() => deleteProduct(p._id)}>🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === ЗАМОВЛЕННЯ === */}
        {section === "orders" && (
          <div>
            <h2>Замовлення</h2>
            <p>Тут буде реалізація замовлень...</p>
          </div>
        )}

        {editingProduct && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Редагування товару</h3>
              <label>Назва:</label>
              <input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />

              <label>Ціна:</label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              />

              <label>Категорія:</label>
              <input
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              />

              <label>Опис:</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />

              <label>Стать:</label>
              <select
                value={editingProduct.gender || ""}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, gender: e.target.value })
                }
              >
                <option value="">Оберіть стать</option>
                <option value="him">Для нього</option>
                <option value="her">Для неї</option>
              </select>

              <label>Фото:</label>
              <div
                className="drop-zone"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleImageUpload(file);
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {dragImage || editingProduct.image ? (
                  <img src={dragImage || editingProduct.image} alt="prev" />
                ) : (
                  <p>Перетягніть зображення сюди</p>
                )}
              </div>

              <div className="checkbox-row">
                <span>В наявності</span>
                <input
                  type="checkbox"
                  checked={editingProduct.inStock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button
                  onClick={() => {
                    const index = products.findIndex(p => p._id === editingProduct._id);
                    saveProduct(editingProduct._id, index, editingProduct);
                    setEditingProduct(null);
                    setDragImage(null);
                  }}
                >
                  💾 Зберегти
                </button>
                <button onClick={() => { setEditingProduct(null); setDragImage(null); }}>
                  ❌ Скасувати
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

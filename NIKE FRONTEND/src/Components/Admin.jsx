import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaCopy } from "react-icons/fa";
import shoe1 from "../assets/NewArrival_shoe1.png";
import axios from "axios"; // Add axios import

function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Add state for products
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the form
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    stock: "",
  });
  const [showEditForm, setShowEditForm] = useState(false); // Control edit form visibility
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]); // Add state for categories
  const [newCategory, setNewCategory] = useState({
    name: "",
    men: false,
    women: false,
    kid: false,
  }); // State for new category
  const [editTrigger, setEditTrigger] = useState(false); // State to trigger useEffect

  const handleEditProduct = (product) => {
    setEditProduct({
      ...product,
      categoryId: product.categoryId?._id || product.categoryId, // Handle category field
    });
    setShowEditForm(true);
  };
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editProduct).forEach((key) => {
      formData.append(key, editProduct[key]);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]); // Log the form data entries
    }

    axios
      .put(
        `http://localhost:5001/admin/update/product/${editProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Product updated:", response.data);
        // Update the product list with the edited product
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editProduct._id ? response.data.product : product
          )
        );
        setShowEditForm(false); // Close the form
        setEditTrigger(!editTrigger); // Trigger useEffect
      })
      .catch((error) => {
        console.error("There was an error updating the product!", error);
      });
  };
  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  // Handle adding a new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });

    console.log("Form data:", formData); // Log the form data

    axios
      .post("http://localhost:5001/admin/create/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product added:", response.data);
        const addedProduct = response.data.product;
        // Fetch the category name for the added product
        axios
          .get(`http://localhost:5001/categories/${addedProduct.categoryId}`)
          .then((categoryResponse) => {
            addedProduct.categoryId = categoryResponse.data.category.name; // Set the category name
            setProducts((prevProducts) => [...prevProducts, addedProduct]); // Add the new product to the products list
            setShowForm(false); // Close the form
            setNewProduct({
              name: "",
              description: "",
              price: "",
              image: "",
              categoryId: "",
              stock: "",
            });
          })
          .catch((error) => {
            console.error("There was an error fetching the category!", error);
            setShowForm(false); // Close the form even if fetching category fails
          });
      })
      .catch((error) => {
        console.error("There was an error adding the product!", error);
        setShowForm(false); // Close the form even if adding product fails
      });
  };

  //handle product input change
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  // Fetch users data from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);
  // Remove user function
  const handleRemoveUser = (userId) => {
    axios
      .delete(`http://localhost:5001/users/delete/${userId}`)
      .then((response) => {
        console.log("User removed:", response.data);
        // Filter out the removed user from the users list
        setUsers(users.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.error("There was an error removing the user!", error);
      });
  };
  // create admin
  const handleCreateAdmin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5001/api/auth/admin/register", newAdmin) // Ensure this matches your backend route
      .then((response) => {
        console.log("Admin created successfully:", response.data);
        alert("Admin registered successfully!");
        setNewAdmin({ name: "", email: "", password: "", role: "" });
      })
      .catch((error) => {
        console.error(
          "Error creating admin:",
          error.response?.data || error.message
        );
        alert("Failed to register admin. Please try again.");
      });
  };

  // Fetch products from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/products") // Updated API endpoint
      .then((response) => {
        console.log(response.data); // Log the response to check the data
        const productsWithCategoryNames = response.data.products.map((product) => {
          return {
            ...product,
            categoryName: product.categoryId.name, // Use the category name directly
            categoryId: product.categoryId._id, // Use the category ID
          };
        });
        setProducts(productsWithCategoryNames);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, [editTrigger]); // Add editTrigger to dependency array

  // handle remove product
  const handleRemoveProduct = (productId) => {
    axios
      .delete(`http://localhost:5001/admin/delete/product/${productId}`)
      .then((response) => {
        console.log("Product removed:", response.data);
        // Filter out the removed product from the products list
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error("There was an error removing the product!", error);
      });
  };

  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  // Handle adding a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/admin/create/category", newCategory)
      .then((response) => {
        console.log("Category added:", response.data);
        setCategories([...categories, response.data.category]); // Add the new category to the categories list
        setNewCategory({ name: "", men: false, women: false, kid: false }); // Reset the form
      })
      .catch((error) => {
        console.error("There was an error adding the category!", error);
      });
  };

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Function to copy category ID to clipboard
  const handleCopyCategoryId = (id) => {
    navigator.clipboard.writeText(id);
    alert("Category ID copied to clipboard!");
  };

  const orders = [
    { id: 12345, customer: "John Doe", total: "$299.99", status: "Pending" },
    { id: 67890, customer: "Jane Smith", total: "$199.99", status: "Shipped" },
  ];

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen px-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs for different management sections */}
      <nav className="mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 mr-4 font-semibold ${
            activeTab === "products"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 mr-4 font-semibold ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 mr-4 font-semibold ${
            activeTab === "users"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("addAdmin")}
          className={`px-4 py-2 mr-4 font-semibold ${
            activeTab === "addAdmin"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Add Admin
        </button>
        <button
          onClick={() => setActiveTab("addCategory")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "addCategory"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Add Category
        </button>
      </nav>

      {/* Add New Product Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileInputChange}
                  className="w-full p-2 border border-gray-300 rounded-full bg-gray-300 text-black hover:bg-gray-400 transition duration-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium"
                >
                  Category ID
                </label>
                <input
                  type="text"
                  id="categoryId"
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md"
              >
                Add Product
              </button>
            </form>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editProduct.description}
                  onChange={handleEditProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.files[0] })
                  }
                  className="w-full p-2 border border-gray-300 rounded-full bg-gray-300 text-black hover:bg-gray-400 transition duration-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium"
                >
                  Category ID
                </label>
                <input
                  type="text"
                  id="categoryId"
                  name="categoryId"
                  value={editProduct.categoryId}
                  onChange={handleEditProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditProductInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md"
              >
                Update Product
              </button>
            </form>

            <button
              onClick={() => setShowEditForm(false)}
              className="mt-4 text-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Product Management */}
      {activeTab === "products" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Product
          </button>
          <div className="overflow-auto">
            <table className="w-full text-left table-auto bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-t">
                      <td className="px-4 py-2">
                        <img
                          src={`http://localhost:5001/${product.image}`} // Ensure the correct URL for the image
                          alt={product.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.categoryName}</td> {/* Display category name */}
                      <td className="px-4 py-2">{`$${product.price}`}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(product._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Management */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
          <div className="overflow-auto">
            <table className="w-full text-left table-auto bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Total Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.customer}</td>
                    <td className="px-4 py-2">{order.total}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      <button className="px-2 py-1 bg-blue-500 text-white rounded">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="overflow-auto">
            <table className="w-full text-left table-auto bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.gender}</td>
                    <td className="px-4 py-2">{user.telephone}</td>
                    <td className="px-4 py-2">{user.address}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Remove User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Admin Management */}
      {activeTab === "addAdmin" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Admin</h2>
          <form
            onSubmit={handleCreateAdmin}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            <div className="mb-4">
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Role</label>
              <select
                name="role"
                value={newAdmin.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Add Admin
            </button>
          </form>
        </div>
      )}

      {/* Add Category Management */}
      {activeTab === "addCategory" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
          <form
            onSubmit={handleAddCategory}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            <div className="mb-4">
              <label className="block font-semibold mb-2">Category Name</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleCategoryInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Men</label>
              <input
                type="checkbox"
                name="men"
                checked={newCategory.men}
                onChange={handleCategoryInputChange}
                className="mr-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Women</label>
              <input
                type="checkbox"
                name="women"
                checked={newCategory.women}
                onChange={handleCategoryInputChange}
                className="mr-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Kid</label>
              <input
                type="checkbox"
                name="kid"
                checked={newCategory.kid}
                onChange={handleCategoryInputChange}
                className="mr-2"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Add Category
            </button>
          </form>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Categories</h2>
          <div className="overflow-auto">
            <table className="w-full text-left table-auto bg-white shadow-lg rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Category ID</th>
                  <th className="px-4 py-2">Category Name</th>
                  <th className="px-4 py-2">Men</th>
                  <th className="px-4 py-2">Women</th>
                  <th className="px-4 py-2">Kid</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id} className="border-t">
                      <td className="px-4 py-2">{category._id}</td>
                      <td className="px-4 py-2">{category.name}</td>
                      <td className="px-4 py-2">{category.men ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">{category.women ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">{category.kid ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleCopyCategoryId(category._id)}
                          className="px-2 py-1 bg-blue-500 text-white rounded flex items-center"
                        >
                          <FaCopy className="mr-1" /> Copy ID
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center">
                      No categories available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
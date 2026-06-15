require("dotenv").config();
const express = require("express");

// Added Item to the imports from your models
const { sequelize, connectDB } = require("./models");
const User = require("./models/user");
const Item = require("./models/item"); // Adjust this path if your model file name is different
const Subscription = require("./models/subscription");

const app = express();

app.use(express.json());
app.use(require("cors")());

connectDB();

sequelize.sync({ alter: true })

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ==========================================================================
   USER ENDPOINTS
   ========================================================================== */

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================================
   ITEM ENDPOINTS (CRUD for your JSON form data)
   ========================================================================== */

// 1. CREATE: Post a new item (receives the imageUrl string in req.body)
app.post("/items", async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. GET ALL: Retrieve all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET SINGLE: Retrieve a specific item by ID
app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE: Update item details or the image link by ID
app.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE: Remove an item by ID
app.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await item.destroy();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// make login api
app.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Find user by email and password (plain text comparison)
    const user = await User.findOne({
      where: {
        user_id: user_id,
        password: password, // Direct comparison - NOT SECURE!
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Login successful
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ==========================================================================
   SUBSCRIPTION ENDPOINTS
   ========================================================================== */

// 1. CREATE: Post a new subscription
app.post("/subscriptions", async (req, res) => {
  try {
    const newSubscription = await Subscription.create(req.body);
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. GET ALL: Retrieve all subscriptions
app.get("/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET SINGLE: Retrieve a specific subscription by ID
app.get("/subscriptions/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE: Update subscription details by ID
app.put("/subscriptions/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await subscription.update(req.body);
    res.json(subscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE: Remove a subscription by ID
app.delete("/subscriptions/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await subscription.destroy();
    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

// Load environment variables
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME || "bibliodrop";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db: any = null;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB");
  return db;
}

// ==================== BOOKS ROUTES ====================

// GET /api/books - Get all books with filters
app.get("/api/books", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("books");

    const { search, category, status, sort } = req.query;

    let query: any = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { title: regex },
        { author: regex },
        { category: regex },
        { description: regex },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    let sortOption: any = {};
    switch (sort) {
      case "newest":
        sortOption = { publishedYear: -1 };
        break;
      case "oldest":
        sortOption = { publishedYear: 1 };
        break;
      case "price_low":
        sortOption = { deliveryFee: 1 };
        break;
      case "price_high":
        sortOption = { deliveryFee: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "title_az":
        sortOption = { title: 1 };
        break;
      case "title_za":
        sortOption = { title: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const books = await collection.find(query).sort(sortOption).toArray();

    // Map _id to id
    const mapped = books.map((book: any) => ({
      ...book,
      id: book._id?.toString() || "",
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET /api/books/:id - Get single book
app.get("/api/books/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("books");
    const { id } = req.params;

    let book;
    if (ObjectId.isValid(id)) {
      book = await collection.findOne({ _id: new ObjectId(id) });
    } else {
      book = await collection.findOne({ id });
    }

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ ...book, id: book._id?.toString() || "" });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// POST /api/books - Create a book
app.post("/api/books", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("books");

    const {
      title,
      author,
      category,
      description,
      deliveryFee,
      coverImage,
      isbn,
      publishedYear,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const now = new Date();
    const book = {
      title,
      author,
      category: category || "Fiction",
      description: description || "",
      deliveryFee: deliveryFee || 0,
      coverImage: coverImage || "",
      status: "pending",
      rating: 0,
      totalReviews: 0,
      isbn: isbn || "",
      publishedYear: publishedYear || now.getFullYear(),
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(book);

    res.status(201).json({ ...book, _id: result.insertedId, id: result.insertedId.toString() });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// PUT /api/books/:id - Update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("books");
    const { id } = req.params;
    const updates = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE /api/books/:id - Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("books");
    const { id } = req.params;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// ==================== DELIVERIES ROUTES ====================

// GET /api/deliveries - Get all deliveries
app.get("/api/deliveries", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("deliveries");

    const { userId } = req.query;

    let query: any = {};
    if (userId) {
      query.userId = userId;
    }

    const deliveries = await collection.find(query).sort({ requestDate: -1 }).toArray();

    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

// POST /api/deliveries - Create a delivery
app.post("/api/deliveries", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("deliveries");

    const {
      userId,
      userName,
      userEmail,
      bookId,
      bookTitle,
      bookAuthor,
      bookCover,
      deliveryFee,
    } = req.body;

    if (!bookId || !bookTitle) {
      return res.status(400).json({ error: "Book ID and title are required" });
    }

    const now = new Date();
    const delivery = {
      userId: userId || "anonymous",
      userName: userName || "Anonymous",
      userEmail: userEmail || "",
      bookId,
      bookTitle,
      bookAuthor: bookAuthor || "",
      bookCover: bookCover || "",
      deliveryFee: deliveryFee || 0,
      status: "Pending",
      requestDate: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(delivery);

    res.status(201).json({ ...delivery, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating delivery:", error);
    res.status(500).json({ error: "Failed to create delivery" });
  }
});

// PATCH /api/deliveries/:id - Update delivery status
app.patch("/api/deliveries/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("deliveries");
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Dispatched", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating delivery:", error);
    res.status(500).json({ error: "Failed to update delivery" });
  }
});

// ==================== REVIEWS ROUTES ====================

// GET /api/reviews - Get reviews for a book
app.get("/api/reviews", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("reviews");

    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({ error: "bookId is required" });
    }

    const reviews = await collection.find({ bookId }).sort({ createdAt: -1 }).toArray();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating, totalReviews: reviews.length });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews - Create a review
app.post("/api/reviews", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("reviews");

    const {
      userId,
      userName,
      userEmail,
      userImage,
      bookId,
      bookTitle,
      rating,
      comment,
    } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ error: "Book ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const now = new Date();
    const review = {
      userId: userId || "anonymous",
      userName: userName || "Anonymous",
      userEmail: userEmail || "",
      userImage: userImage || "",
      bookId,
      bookTitle: bookTitle || "",
      rating,
      comment: comment || "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(review);

    res.status(201).json({ ...review, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// DELETE /api/reviews/:id - Delete a review
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("reviews");
    const { id } = req.params;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log("API Routes:");
  console.log("  GET    /api/books");
  console.log("  GET    /api/books/:id");
  console.log("  POST   /api/books");
  console.log("  PUT    /api/books/:id");
  console.log("  DELETE /api/books/:id");
  console.log("  GET    /api/deliveries");
  console.log("  POST   /api/deliveries");
  console.log("  PATCH  /api/deliveries/:id");
  console.log("  GET    /api/reviews");
  console.log("  POST   /api/reviews");
  console.log("  DELETE /api/reviews/:id");
  console.log("  GET    /api/health");
});

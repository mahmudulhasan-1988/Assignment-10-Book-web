import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME || "bibliodrop";

const COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1529158062015-cad636e205a0?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=600&fit=crop",
];

const LIBRARIANS = [
  { id: "6a5b48398b42cfb1c54959f7", name: "Arif Librarian" },
  { id: "6a5b05f5354d87e5ce011083", name: "Hasan Admin" },
];

const BOOKS = [
  { title: "The Midnight Library", author: "Matt Haig", category: "Fiction", description: "Between life and death there is a library, and within that library, the shelves go on forever.", deliveryFee: 3.5, coverImage: COVERS[0], status: "available", rating: 4.8, totalReviews: 2847, isbn: "978-0525559474", publishedYear: 2020, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro", category: "Fiction", description: "A novel told from the perspective of an Artificial Friend, observing the world from a store shelf.", deliveryFee: 3.5, coverImage: COVERS[1], status: "available", rating: 4.5, totalReviews: 1923, isbn: "978-0571364879", publishedYear: 2021, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Educated", author: "Tara Westover", category: "Biography", description: "A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge.", deliveryFee: 4.0, coverImage: COVERS[2], status: "checked_out", rating: 4.7, totalReviews: 3156, isbn: "978-0399590504", publishedYear: 2018, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "Piranesi", author: "Susanna Clarke", category: "Sci-Fi & Fantasy", description: "A man explores an endless, labyrinthine house filled with statues and a distant ocean.", deliveryFee: 4.0, coverImage: COVERS[3], status: "available", rating: 4.6, totalReviews: 1284, isbn: "978-1635575996", publishedYear: 2020, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Circe", author: "Madeline Miller", category: "Fiction", description: "A bold and subversive retelling of the goddess Circe's story from Greek mythology.", deliveryFee: 4.0, coverImage: COVERS[4], status: "available", rating: 4.9, totalReviews: 2567, isbn: "978-0316556347", publishedYear: 2018, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Silent Patient", author: "Alex Michaelides", category: "Fiction", description: "A woman's act of violence against her husband and her refusal to speak becomes a puzzle.", deliveryFee: 3.5, coverImage: COVERS[5], status: "checked_out", rating: 4.4, totalReviews: 4102, isbn: "978-1250301697", publishedYear: 2019, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Atomic Habits", author: "James Clear", category: "Self-Help", description: "An easy and proven way to build good habits and break bad ones.", deliveryFee: 3.0, coverImage: COVERS[6], status: "available", rating: 4.9, totalReviews: 8934, isbn: "978-0735211292", publishedYear: 2018, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "History", description: "A brief history of humankind, from the Stone Age to the Silicon Age.", deliveryFee: 4.5, coverImage: COVERS[7], status: "available", rating: 4.7, totalReviews: 6234, isbn: "978-0062316097", publishedYear: 2015, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Where the Crawdads Sing", author: "Delia Owens", category: "Fiction", description: "A coming-of-age tale wrapped in a murder mystery set in the marshlands of North Carolina.", deliveryFee: 3.5, coverImage: COVERS[8], status: "pending", rating: 4.8, totalReviews: 5678, isbn: "978-0735219090", publishedYear: 2018, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", description: "A philosophical story about a young shepherd who travels from Spain to Egypt in search of treasure.", deliveryFee: 2.5, coverImage: COVERS[9], status: "available", rating: 4.6, totalReviews: 12456, isbn: "978-0062511409", publishedYear: 1988, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "The Diary of a Young Girl", author: "Anne Frank", category: "Biography", description: "The writings from the Dutch wartime diary of Anne Frank while she was in hiding for two years.", deliveryFee: 2.0, coverImage: COVERS[10], status: "available", rating: 4.8, totalReviews: 9876, isbn: "978-0553296983", publishedYear: 1947, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Very Hungry Caterpillar", author: "Eric Carle", category: "Children's", description: "A caterpillar eats his way through a wide variety of foods before emerging as a butterfly.", deliveryFee: 2.0, coverImage: COVERS[11], status: "available", rating: 4.9, totalReviews: 7654, isbn: "978-0399226908", publishedYear: 1969, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Academic", description: "A groundbreaking tour of the mind that explains the two systems that drive the way we think.", deliveryFee: 5.0, coverImage: COVERS[0], status: "available", rating: 4.5, totalReviews: 4567, isbn: "978-0374533557", publishedYear: 2011, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Hate U Give", author: "Angie Thomas", category: "Fiction", description: "A novel about a teenage girl who witnesses the police shooting of her childhood friend.", deliveryFee: 3.5, coverImage: COVERS[1], status: "checked_out", rating: 4.7, totalReviews: 3890, isbn: "978-0062498533", publishedYear: 2017, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "A Brief History of Time", author: "Stephen Hawking", category: "Academic", description: "A landmark volume in science writing that explores the cosmos and our place within it.", deliveryFee: 4.5, coverImage: COVERS[2], status: "available", rating: 4.6, totalReviews: 5432, isbn: "978-0553380163", publishedYear: 1988, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.", deliveryFee: 2.0, coverImage: COVERS[3], status: "available", rating: 4.4, totalReviews: 15678, isbn: "978-0743273565", publishedYear: 1925, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "The Power of Now", author: "Eckhart Tolle", category: "Self-Help", description: "A guide to spiritual enlightenment that teaches readers to live in the present moment.", deliveryFee: 3.0, coverImage: COVERS[4], status: "available", rating: 4.5, totalReviews: 6789, isbn: "978-1577314806", publishedYear: 1997, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "Good Night Moon", author: "Margaret Wise Brown", category: "Children's", description: "A beloved bedtime classic that has lulled generations of children to sleep.", deliveryFee: 1.5, coverImage: COVERS[5], status: "pending", rating: 4.8, totalReviews: 8765, isbn: "978-0064430173", publishedYear: 1947, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", description: "An attempt to explain why some societies are more advanced than others.", deliveryFee: 4.5, coverImage: COVERS[6], status: "available", rating: 4.4, totalReviews: 3456, isbn: "978-0393354324", publishedYear: 1997, ownerId: LIBRARIANS[0].id, ownerName: LIBRARIANS[0].name },
  { title: "The Prophet", author: "Kahlil Gibran", category: "Poetry", description: "A collection of 26 poetic essays on life, love, work, and spirituality.", deliveryFee: 2.5, coverImage: COVERS[7], status: "available", rating: 4.7, totalReviews: 4321, isbn: "978-0679725503", publishedYear: 1923, ownerId: LIBRARIANS[1].id, ownerName: LIBRARIANS[1].name },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("books");

    const deleteResult = await collection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing books`);

    const now = new Date();
    const booksWithDates = BOOKS.map((book) => ({
      ...book,
      createdAt: now,
      updatedAt: now,
    }));

    const insertResult = await collection.insertMany(booksWithDates);
    console.log(`Inserted ${insertResult.insertedCount} books with ownerIds`);

    await collection.createIndex({ title: "text", author: "text", category: "text" });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ rating: -1 });
    await collection.createIndex({ ownerId: 1 });
    console.log("Created indexes");

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();

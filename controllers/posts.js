import pkg from 'pg';
const { Client } = pkg;

export const getPosts = async (req, res) => {
  try {
    const client = new Client({
      connectionString: process.env.PG_URI,
    });

    await client.connect();
    const results = await client.query('SELECT * FROM posts');

    await client.end();

    res.status(200).json(results.rows);
  } catch (error) {
    console.error('Error retrieving posts: ', error);
    res.status(500).json({ message: 'Internal Server Error'});
  }
};


export const createPost = async (req, res) => {
  try {
    const { author, title, content, cover } = req.body;

    if (!author || !title || !content || !cover) {
      return res.status(400).json({ message: "All fields a required"});
     }
    const client = new Client({
      connectionString: process.env.PG_URI,
    });

    await client.connect();

    const results = await client.query(
      'INSERT INTO posts (author, title, content, cover) VALUES ($1, $2, $3, $4) RETURNING *;',
      [author, title, content, cover]
    );

    await client.end();

    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error('Error creating product: ', error);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = new Client({
      connectionString: process.env.PG_URI
    });

    await client.connect();
    const results = await client.query('SELECT * FROM posts WHERE id = $1;', [id]);
    await client.end();

    if (results.rows.length === 0) {
      return res.status(404).json({message: 'Product not found'});
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.log('Error fetching post: ', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};
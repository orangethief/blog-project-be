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
      return res.status(404).json({message: 'Post not found'});
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.log('Error fetching post: ', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { author, title, content, cover } = req.body;

  if (!author || !title || !content || !cover) {
    return res.status(400).json({ message: "All fields a required"});
  }

  try {
    const client = new Client({
      connectionString: process.env.PG_URI,
    });

  await client.connect();

  const results = await client.query(
    'UPDATE posts SET author = $1, title = $2, content = $3, cover = $4 WHERE id = $5 RETURNING *;',
    [author, title, content, cover, id]
  );

  await client.end();

  if(results.rowCount === 0) {
    return res.status(404).json ({ message: 'Post not found'});
  }

  res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error('Error updating post: ', error);
    return res.status(500).json({ message: 'Internal Server Error'});
  }
};

export const deletePost = async (req, res) => {
  const {id} = req.params;
  try{
    const client = new Client({
      connectionString: process.env.PG_URI
    });
    await client.connect();
    const results = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *;', [id]);

    if (results.rowCount === 0) {
      await client.end();
      return res.status(404).json({ message: 'Post not found'});
    }
    await client.end();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post: ', error);
    res.status(500).json({ message: 'Internal Server Error'});
  }
  };

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
const connect = require("./lib/connect");
const Note = require("./model/notes");
const User = require("./model/users");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.type("html").send(html));

//Get all notes
app.get("/notes", async (req, res) => {
  await connect();
  const notes = await Note.find();
  if (!notes.length) {
    return res.json({ message: "Sorry🥺, could not find any notes." });
  }
  res.json(notes);
});
//See the list of users
app.get("/users", async (req, res) => {
  await connect();
  const users = await User.find();
  if (!users.length) {
    return res.json({ message: "Sorry🥺, could not find any users." });
  }
  res.json(users);
});
//USERS
//Creating a new user
app.post("/users", async (req, res) => {
  await connect();
  const { name } = req.body;
  const created = await User.create({ name });

  if (!created?._id) {
    return res.json({ message: "User could not be created!" });
  }
  res.json({ message: `User ${name} was created successfully.` });
});
//Routes with an specified user
//Post a note for a user (that must already exist)
app.post("/:user/notes", async (req, res) => {
  await connect();
  const { user } = req.params;
  const { content, category } = req.body;
  const foundUser = await User.findOne({ name: user });
  if (!foundUser) {
    return res.json(`User does not exist`);
  }
  await Note.create({ content, category, userId: foundUser._id });
  res.json({ message: `Note created successfully` });
});
//Get all the notes of an specific user
app.get("/:user/notes", async (req, res) => {
  await connect();
  const { user } = req.params;
  const foundUser = await User.findOne({ name: user });
  const notes = await Note.find({ userId: foundUser._id }).populate("userId");
  res.json(notes);
});
//Get a specific note of a specific user
app.get("/:user/notes/:id", async (req, res) => {
  await connect();
  const { user, id } = req.params;
  const foundUser = await User.findOne({ name: user });
  const notes = await Note.find({ userId: foundUser._id, _id: id }).populate(
    "userId"
  );
  res.json(notes);
});
//Delete a note by user and id
app.delete("/:user/notes/:id", async (req, res) => {
  await connect();
  const { id, user } = req.params;
  const foundUser = await User.findOne({ name: user });
  console.log(foundUser);
  if (!foundUser?.name) {
    return res.json(`The user doesn't exist`);
  }
  const foundNote = await Note.find({ _id: id });
  console.log(foundNote);

  if (!foundNote.length) {
    return res.json(`The note doesn't exist`);
  }
  const notes = await Note.deleteOne({ userId: foundUser._id, _id: id });
  res.json(`The following note was deleted: ${id} by user ${foundUser.name}`);
});
//Delete all the notes of an user
app.delete("/:user/notes", async (req, res) => {
  await connect();
  const { user } = req.params;
  const foundUser = await User.findOne({ name: user });
  console.log(foundUser);
  if (!foundUser?.name) {
    return res.json(`The user doesn't exist`);
  }

  const notes = await Note.deleteMany({ userId: foundUser._id });
  res.json(`All the notes of the user ${foundUser.name} were deleted`);
});
//Modify a note by user
app.patch(":user/notes/:id", async (req, res) => {
  await connect();
  const { id, user } = req.params;
  const { content, category, userId } = req.body;
  const foundUser = await User.findOne({ name: user });
  console.log(foundUser);
  if (!foundUser?.name) {
    return res.json(`The user doesn't exist`);
  }
  const foundNote = await Note.find({ _id: id });
  console.log(foundNote);
  if (!foundNote) {
    return res.json(`The note doesn't exist`);
  }

  const note = await Note.findOneAndReplace(
    { userId: foundUser._id, _id: id },
    { content, category, userId }
  );
  res.json(note);
});

//More routes only notes (no user specified)
// See a specific note - it´s working but you have to insert the long id into the address bar.
app.get("/notes/:id", async (req, res) => {
  await connect();
  const { id } = req.params;
  const notes = await Note.find({ _id: id });
  res.json(notes);
});
//Create a new note.
app.post("/notes", async (req, res) => {
  await connect();
  const { content, category } = req.body;
  const notes = await Note.create({ content, category });
  res.json(notes);
});

//Delete a note by id
app.delete("/notes/:id", async (req, res) => {
  await connect();
  const { id } = req.params;
  const notes = await Note.deleteOne({ _id: id });
  res.json(notes);
});

//Modify a note
app.patch("/notes/:id", async (req, res) => {
  await connect();
  const { id } = req.params;
  const { content, category } = req.body;
  const notes = await Note.findOneAndReplace(
    { _id: id },
    { content, category }
  );
  res.json(notes);
});
const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Mongoose connection with express!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;

import post from "@mkoys/post";

const app = post.app();

app.use(post.static("public"));

app.get("/", (req, res) => res.redirect("/index.html"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
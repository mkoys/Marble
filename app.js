import post from "@mkoys/post";

const app = post.app();

app.use(post.static("public"));

const port = 3000;

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
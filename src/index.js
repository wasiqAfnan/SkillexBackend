import app from "./app.js";
import connectToDb from "./configs/mongoDB.configs.js";
import constants from "./constants.js";

const port = constants.PORT || 8000;

connectToDb().then(() => {
    app.listen(port, () =>
        console.log(`Server is running. URL: http://localhost:${port}`)
    );
});
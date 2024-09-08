const express = require('express');
const app = express();
const errorHandler = require('./helper/errorHandel');
const router = require("./routes/authRoutes")

app.use(express.json());

// Registration routes
app.use('/api', router);


// Error handling middleware

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

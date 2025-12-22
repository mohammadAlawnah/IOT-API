import 'dotenv/config'
import express from 'express'
const app = express();
import { initApp } from './src/app.js';
const PORT = process.env.PORT || 3000;

initApp(app,express)
  
app.listen(PORT,"0.0.0.0", () => {
    console.log(`server is running .... port ${PORT}`);
});
  




import 'dotenv/config'
import express from 'express'
const app = express();
import { initApp } from './src/app.js';
const PORT =  3001 ;

initApp(app,express)
  
app.listen(PORT,"0.0.0.0", () => {
    console.log(`server is running .... port ${PORT}`);
});
  




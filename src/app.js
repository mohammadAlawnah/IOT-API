
import connectDB from "../DB/connection.js"
import authRouter from './modules/auth/auth.router.js'
import studentsRouter from './modules/students/students.router.js'
import fingerprintRouter from "./modules/fingerprint/fingerprint.router.js";
import room from "./modules/room/room.router.js"
import adminRouter from "./modules/admin/admin.router.js";
import reservationRouter from "./modules/reservation/reservation.router.js";
import accessRouter from "./modules/access/access.router.js";

import cors from 'cors'

export const initApp = (app,express)=>{
    app.use(express.json())
    app.use(cors())

    connectDB();
    


    app.use('/auth',authRouter);
    app.use("/admin", adminRouter); 
    // app.use('/user',userRouter)
    app.use("/fingerprint", fingerprintRouter);
    app.use("/reservations", reservationRouter);
    app.use("/access", accessRouter);

 

    app.use("/students",studentsRouter)
    app.use("/room",room);
    


    

    // app.use('/',(req,res)=>{
    //     res.json({message : 'welcome to tweet project'})
    // })

    
    app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});
    app.use('*',(req,res)=>{
        res.status(404).json({message : "page not found"})
    })

 app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: "Server Error",
    error: err.message || err,
  });
});

}

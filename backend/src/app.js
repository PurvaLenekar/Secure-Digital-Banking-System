const helmet = require('helmet');
const express  = require('express');
const logger = require('./middleware/logger');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const sanitizeMiddleware = require('./middleware/sanitize.middleware'); 
const errorhandler = require('./middleware/errorHandler');
const dashboardRoutes = require('./routes/dashboard.routes');


const hpp = require('hpp');

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(helmet());
app.use(logger);


app.use(hpp());

app.use(express.json());
app.use(sanitizeMiddleware);
app.use(cookieParser());

/*  Routes */ 
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes');
const analyticsRouter = require('./routes/analytics.routes');     
const otpRoutes = require('./routes/otp.routes');
const pinRoutes = require('./routes/pin.routes');
const securityRoutes = require('./routes/security.routes');

 /* USE routes*/
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/analytics", analyticsRouter);
app.use('/api/otp', otpRoutes);
app.use('/api/pin', pinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/security', securityRoutes);
app.use(errorhandler);

// Paste this near the very bottom of src/app.js right above module.exports = app;
app.get('/api/router-test-check', (req, res) => {
    return res.json({ message: "The main Express engine is completely updated!" });
});
module.exports = app;
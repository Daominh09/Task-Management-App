import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 2400;

const date = new Date();
let day = date.getDate();
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let monthLet = month[date.getMonth()];
const weekDay = ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"]
let weekDayLet = weekDay[date.getDay()];
const todayWorkLi = []
const workLi = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.render('index.ejs',{
        day: day,
        month: monthLet,
        weekDay: weekDayLet,
        todayWorkList: todayWorkLi,
    })
})

app.post('/submit', (req,res)=>{
    todayWorkLi.push(req.body.newWork)
    res.redirect('/')
})

app.get('/work', (req,res)=>{
    res.render('work.ejs', {
        workList : workLi
    })
})

app.post('/submitWork', (req,res)=>{
    workLi.push(req.body.newWork)
    res.redirect('/work')
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
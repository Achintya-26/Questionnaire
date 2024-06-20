const mysql=require('mysql2');
const express=require('express');
const path=require('path')
const app=express();
const publicPath = path.join(__dirname, 'public')

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publicPath))

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

const pool= mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Ag#26032003',
    database:'feedback'
}).promise();

app.get('/signup', (req, res) => {
    res.render('LoginSignup/signup')
})
app.get('/login', (req, res) => {
    res.render('LoginSignup/login')
})

app.post('/signup', async (req, res) => {
    
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    // const checking = await LogInCollection.findOne({ name: req.body.name })

    const checking = await pool.query(`Select * from auth where user_name='${data.name}'`)
    

   try{
    if (checking && (checking.user_name === req.body.name && checking.user_password===req.body.password)) {
        res.send("user details already exists")
    }
    else{
        await pool.query(`insert into auth(user_name,user_password) values('${data.name}','${data.password}')`)
    }
   }
   catch(e){
    res.send(e);
   }

    res.status(201).render("home", {
        naming: req.body.name
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await pool.query(`Select * from auth where user_name='${req.body.name}'`)
        // res.send(check[0][0]);

        if (check[0][0].user_password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("Incorrect password")
        }


    } 
    
    catch (e) {
        res.send("Wrong details")
    }
})



app.listen(3000, () => {
    console.log('port connected');
})
// pool.query("show tables").then(result=> {console.log(result);
//     pool.end();
// });

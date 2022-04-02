const router = require("express").Router();
const user = require("../model/user.js");

router.get("/", async (req, res) => {
    res.send("Hello World!")
});
router.get("/users", async (req, res) => {
    const users = await user.find();
    res.json(users);
});

router.get("/users/:id", async (req, res) =>{
    try {
        const foundUser = await user.findOne({ID: req.params.id})
        if (foundUser == null){
            throw "Returned user object is null"
        }
        res.send(foundUser)
    } catch (error) {
        console.log(error);
        res.status(404).send({error: "User doesn't exist"});
    }
});
router.post("/users", async (req, res) => {
    const users = await user.find();
    if(users.length == 0){
        largest = "0";
    } else {
        for (let user of users){
            var largest = user.ID
            if(user.ID > largest){
                largest = user.ID
            }
        }
        if (largest == "NaN"){
            largest = "0";
        }
    }
    const userID = parseInt(largest) + 1
    const newUser = new user({
        ID: userID,
        name: req.body.name,
        age: req.body.age
    });
    try {
        await newUser.save();
        const users = await user.find();
        res.status(201).send(users);
        console.log("User created");
    } catch (error) {
        console.log(error);
        res.status(409).send({error: "User already exists"});
    }
});

router.put("/users/:id", async (req, res) => {
    try {
        const updateUser = await user.findOne({ID: req.params.id});
        if (req.body.name){
            updateUser.name = req.body.name
        }
        if (req.body.age){
            updateUser.age = req.body.age
        }
        await updateUser.save()
        res.send({success: `User with ID ${req.params.id} was updated`})
    } catch (error) {
        console.log(error);
        res.status(404)
        res.send({error: "User doesn't exist"})
    }
    
});
router.delete("/users/:id", async (req, res) => {
    try {
        await user.deleteOne({ID: req.params.id})
        res.status(200).send({sucess: `User with ID ${req.params.id} was deleted`});
    } catch (error) {
        res.status(404)
        res.send({error: "User doesn't exist"})
    }
});

module.exports = router;
const express = require("express"),
    graphqlHTTP = require("express-graphql"),
    app = express(),
    schema = require("./schema/schema"),
    mongoose = require("mongoose");

app.use('/graphql',graphqlHTTP({
    graphiql: true,
    schema
}));

mongoose.connect("mongodb://admin:cipres8893@ds141024.mlab.com:41024/works-crew",{ useNewUrlParser: true });
mongoose.connection.once('open',() =>{
    console.log("connect to database");
});

app.listen("5000", () => {
    console.log("On port 5000")
})
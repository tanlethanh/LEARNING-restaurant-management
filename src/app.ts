import express from 'express';
import HomepageController from './controllers/HomepageController'
const Router = express.Router()
const app = express()
app.use(express.static('public'))
app.set("view engine", "ejs")
Router.get("/", HomepageController.getHomepageView)
Router.get("/", HomepageController.getHomepageView)
Router.get("/menu")
Router.get("/reservation", HomepageController.getHomepageReservationView)
Router.post("/reservation")

// const express = require('express');
// app.get("/", function (req, res) {
//     res.render("./pages/homepage/homepage")
// })
// app.get("/reservation", function (req, res) {
//     res.render("./pages/homepage/homepage-reservation")
// })
// app.get("/dashboard", function (req, res) {
//     res.render("./pages/dashboard/operation-page", {})
// })
app.listen(3000, function () {
    console.log("bts running on port 3000 hihi =))))")
})
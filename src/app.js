"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
mongoose.set('strictQuery', false);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
const people = [
    {
        name: "Chinmay",
        industry: "Software"
    },
    {
        name: "John",
        industry: "Hardware"
    },
    {
        name: "Jane",
        industry: "Marketing"
    },
];
const customer = new Customer({
    name: 'Chinmay',
    industry: 'Software'
});
app.get('/', (req, res) => {
    res.send('welcome');
});
app.get('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Customer.find();
        res.send({ "customers": result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.get('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: customerId } = req.params;
        const customer = yield Customer.findById(customerId);
        //const result = await Customer.find();
        res.json({ customer });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.put('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    //const result = await Customer.replaceOne({ _id: customerId }, req.body);
    const result = yield Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
    console.log(result);
    res.json({ customer: result });
    //modifiedCount
}));
app.patch('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    //const result = await Customer.replaceOne({ _id: customerId }, req.body);
    const result = yield Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
    console.log(result);
    res.json({ customer: result });
    //modifiedCount
}));
app.patch('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const orderId = req.params.id;
    try {
        const result = yield Customer.findOneAndUpdate({ 'orders._id': orderId }, { $set: { 'orders.$': req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found" });
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.get('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Customer.findOne({ 'orders._id': req.params.id });
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ 'error': 'Order not found' });
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500).json({ error: "Something went wrong" });
    }
}));
app.delete('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.id;
    const result = yield Customer.deleteOne({ _id: customerId }, req.body);
    console.log(result);
    res.json({ deletedCount: result.deletedCount });
}));
app.post('/api/customers', (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    customer.save();
    res.status(201).json({ customer });
    //res.send(req.body);
});
app.post('/', (req, res) => {
    res.send('this is a POST request!');
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT);
        });
    }
    catch (e) {
        console.log(e.message);
    }
});
start();

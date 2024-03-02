const express = require('express');
const mongoose = require('mongoose');
//const Customer = require('./models/customer');
import { Customer } from "./models/customer";
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

app.get('/api/customers', async (req, res) => {
    try {
        const result = await Customer.find();
        res.send({ "customers": result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }


});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const { id: customerId } = req.params;
        const customer = await Customer.findById(customerId);
        //const result = await Customer.find();
        res.json({ customer });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    const customerId = req.params.id;
    //const result = await Customer.replaceOne({ _id: customerId }, req.body);
    const result = await Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
    console.log(result);
    res.json({ customer: result })
    //modifiedCount
});

app.patch('/api/customers/:id', async (req, res) => {
    const customerId = req.params.id;
    //const result = await Customer.replaceOne({ _id: customerId }, req.body);
    const result = await Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
    console.log(result);
    res.json({ customer: result })
    //modifiedCount
});

app.patch('/api/orders/:id', async (req, res) => {
    console.log(req.params);
    const orderId = req.params.id;
    try {
        const result = await Customer.findOneAndUpdate(
            { 'orders._id': orderId },
            { $set: { 'orders.$': req.body } },
            { new: true }
        );

        console.log(result);

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "Order not found" });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const result = await Customer.findOne({ 'orders._id': req.params.id });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ 'error': 'Order not found' });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500).json({ error: "Something went wrong" });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId }, req.body);
    console.log(result);
    res.json({ deletedCount: result.deletedCount })
});

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

const start = async () => {
    try {
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT);
        });
    } catch (e) {
        console.log(e.message);
    }
};

start();
const connection = require('./db-config');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
    } else {
        console.log('connected to database with threadId :  ' + connection.threadId);
    }
});

app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
        } else {
            res.status(200).json(result);
        }
    });
});


app.post('/users', (req, res) => {
    const { firstname, lastname, email } = req.body;
    connection.query(
        'INSERT INTO users(firstname, lastname, email) VALUES (?, ?, ?)',
        [firstname, lastname, email],
        (err, result) => {
            if (err) {
                res.status(500).send('Error saving the user');
            } else {
                res.status(201).send('User successfully saved');
            }
        }
    )
})

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const userPropsToUpdate = req.body;
    connection.query(
        'UPDATE users SET ? WHERE id = ?',
        [userPropsToUpdate, userId],
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error updating a user');
            } else {
                res.status(200).send('User updated successfully 🎉');
            }
        }
    );
});


app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    connection.query(
        'DELETE FROM users WHERE id = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('😱 Error deleting an user');
            } else {
                res.status(200).send('🎉 User deleted!');
            }
        }
    );
});

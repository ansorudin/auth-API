const db = require('./../database/mysql')
const jwt = require('jsonwebtoken')
const dateNow = require('moment')
const { threadId } = require('./../database/mysql')


const getAllTodo = (req,res) => {
    db.query('select * from todos;',(err, result) => {
        try {
            if(err) throw err
            if(result.length === 0) throw {message : 'Data Null'}
            res.json({
                error : false,
                data : result
            })
        } catch (error) {
            res.json({
                error : true,
                message : error.message
            })
        }
    })
}

const getAllTodoById = (req, res) => {
    let token = req.params.id

    jwt.verify(token, '123abc', (err, data) => {
        try {
            if(err) throw err
            db.query('select * from todos where id_user = ?', data.id, (err, result) => {
                try {
                    if(err) throw err
                    res.json({
                        error : false,
                        data : result
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                    
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}

const getTodoToday = (req, res) => {
    let token = req.params.id
    let waktu = dateNow().format().slice(0,10)

    jwt.verify(token, '123abc', (err, data) => {
        try {
            if(err) throw err
            db.query('select * from todos where time_to_do = ? and id_user = ?', [waktu, data.id], (err, result) => {
                try {
                    if(err) throw err
                    if(result.length === 0) throw {message : 'Todo today not found'}
                    res.json({
                        error : false,
                        data : result
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}

const getTodoUpcoming = (req, res) => {
    let token = req.params.id
    let waktu = dateNow().format().slice(0,10)

    jwt.verify(token, '123abc', (err, data) => {
        try {
            if(err) throw err
            db.query('select * from todos where time_to_do > ? and id_user = ?', [waktu, data.id], (err, result) => {
                try {
                    if(err) throw err
                    if(result.length === 0) throw {message : 'Todo upcoming not found'}
                    res.json({
                        error : false,
                        data : result
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}

const newTodo = (req, res) => {
    let token = req.params.id

    jwt.verify(token, '123abc', (err, data) => {
        try {
            if(err) throw err
            db.query('select * from todos where id_user = ? order by created_at DESC limit 4', data.id, (err, result) => {
                try {
                    if(err) throw err
                    if(result.length === 0) throw {message : 'Todo New not found'}
                    res.json({
                        error : false,
                        data : result
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}


const addTodo = (req, res) => {
    const data = req.body

    jwt.verify(data.id_user, '123abc', (err, hasil) => {
        try {
            if(err) throw err
            data.id_user = hasil.id
            db.query('insert into todos set ?', data, (err, result) => {
                try {
                    if(err) throw err
                    res.json({
                        error : false,
                        message : 'Add data succes'
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}

const updateTodo = (req, res) => {
    const id = req.params.id
    const data = req.body
    
    db.query('select * from todos where id = ?', id, (err, result) => {
        try {
            if(err) throw err
            // console.log(result)
            if(result.length === 0) throw {message : 'Data not Found'}
            db.query('update todos set ? where id = ?', [data, id], (err, update)=>{
                try {
                    if(err) throw err
                    res.json({
                        error : false,
                        message : "Update berhasil"
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}

const deleteTodo = (req, res) => {
    const id = req.params.id

    db.query('select * from todos where id = ?', id, (err, result) => {
        try {
            if(err) throw err
            if(result.length === 0) throw {message : 'Data not Found'}
            db.query('delete from todos where id = ?', id, (err, hasil) => {
                try {
                    if(err) throw err
                    res.json({
                        error : false,
                        message : 'Delete data succes'
                    })
                } catch (error) {
                    res.json({error : true, message : error.message, detail : error})
                }
            })
        } catch (error) {
            res.json({error : true, message : error.message, detail : error})
        }
    })
}


module.exports = {
    getAllTodo,
    getAllTodoById,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodoToday,
    getTodoUpcoming,
    newTodo
}
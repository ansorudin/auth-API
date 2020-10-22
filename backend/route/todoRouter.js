const Router = require('express').Router()
const Contr = require('./../controller/todoController')


Router.get('/todos', Contr.getAllTodo )
Router.get('/todo/:id', Contr.getAllTodoById)
Router.get('/todo-today/:id', Contr.getTodoToday)
Router.get('/todo-upcoming/:id', Contr.getTodoUpcoming)
Router.get('/todo-new/:id', Contr.newTodo)
Router.post('/todo', Contr.addTodo)
Router.patch('/todo/:id', Contr.updateTodo)
Router.delete('/todo/:id', Contr.deleteTodo)

module.exports = Router
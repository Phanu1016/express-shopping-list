const express = require('express')
const router = new express.Router()
const items = require('../fakeDb')
const ExpressError = require('../expressError')



router.get("/", (request, response) => {
    return response.json(items)
})

module.exports = router

router.post("/", (request, response) => {
    const name = request.body.name
    const price = request.body.price
    if (name === undefined){
        throw new ExpressError("Name not found", 404)
    } else if (price === undefined){
        throw new ExpressError("Price not found", 404)        
    }


    const newItem = {name, price: parseFloat(price)}
    items.push(newItem)
    return response.status(201).json(newItem)
})


router.get("/:name", (request, response) => {
    const searchedItem = getItem(request.params.name)

    return response.json(searchedItem)
})


router.patch('/:name', (request, response) => {
    const name = request.body.name
    const price = request.body.price
    if (name === undefined){
        throw new ExpressError("Name not found", 404)
    } else if (price === undefined){
        throw new ExpressError("Price not found", 404)        
    }

    const searchedItem = getItem(request.params.name)
    searchedItem.name = name
    searchedItem.price = parseFloat(price)
    return response.json(searchedItem)

})

router.delete('/:name', (request, response) => {
    const searchedItemIndex = findItemIndex(request.params.name)
    items.splice(searchedItemIndex, 1)
    return response.json({message: 'Deleted'})
})

function getItem(name){
    const item = items.find(item => item.name === name)
    if (item === undefined){
        throw new ExpressError("Item not found", 404)
    }

    return item
}

function findItemIndex(name){
    const index = items.findIndex(item => item.name === name)
    if (index === -1){
        throw new ExpressError("Item not found", 404)
    }
    return index
}

module.exports = router
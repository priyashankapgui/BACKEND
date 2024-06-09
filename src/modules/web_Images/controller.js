import express from "express";

const multer = require('multer')
const path = require('path')

const addImage = async (req, res) => {

    let info = {
        image: req.file.path,
        imagePosition: req.body.title,
        
    }

    const Image = await Image.create(info)
    res.status(200).send(image)
    console.log("image succses")

}

const getOneImage = async (req, res) => {

    let id = req.params.id
    let product = await Product.findOne({ where: { id: id }})
    res.status(200).send(product)

}
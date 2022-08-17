try {
    const express = require('express');
    const router = express.Router();
    const kartController = require('../controllers/kart.controller');
    
    router.get('/:user_id/', kartController.getAllKart);
    router.post('/', kartController.addToKart);
    router.put('/', kartController.deleteProductInKart);
    router.delete('/', kartController.deleteAllProductsInKart);
    
    module.exports = router;   
} catch (error) {
    
}
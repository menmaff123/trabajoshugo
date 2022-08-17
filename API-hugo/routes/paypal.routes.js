try {
    const express = require('express');
    const router = express.Router();
    const paypalController = require('../controllers/paypal.controller');

    router.get('/:id/', paypalController.getPayPalOrderByID);
    router.post('/', paypalController.addPayPalOrder);
    router.put('/', paypalController.updatePayPalOrderStatus);
    router.get('/', paypalController.getAllPayPalOrders);

    module.exports = router;
} catch (error) {

}
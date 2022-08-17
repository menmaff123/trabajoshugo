// Se declara variable para la API
var API = new Schema();

// Esta variable es para el precio total de los productos agregados al carrito
var precioTotal = 0;

// Iniciacion de funciones cuando se carga la pagina
initPayPalButton();
initPayPalButtonCar();
productos();
tabla(true);

// boton de paypal para metodo POST
function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'blue',
            layout: 'horizontal',
            label: 'pay',

        },

        createOrder: function (data, actions) {

            return actions.order.create({
                purchase_units: [{ "amount": { currency_code: "MXN", value: "200" } }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {
                console.log(orderData);
                // Aqui comienza el metodo POST hacia la API
                //Cuidado con la variable api, esta se 
                //declara al inicio de este archivo y se 
                //importa la variable paypal desde el archivo Schema.js
                fetch(API.paypal, {
                    method: 'POST',
                    body: JSON.stringify({
                        paypal_order_id: orderData.id,
                        paypal_payer_id: orderData.payer.payer_id,
                        paypal_payer_email: orderData.payer.email_address,
                        paypal_country_code: orderData.payer.address.country_code,
                        paypal_amount: orderData.purchase_units[0].amount.value,
                        paypal_currency: orderData.purchase_units[0].amount.currency_code
                    }),
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(response => {
                    if (response.status == 200) {
                        // Saludo KAWAII DESU NEE
                        arigatou();

                    } else {

                    }
                }).catch(err => console.log(err));
            });
        },
        onError: function (err) {
            console.log(err);
        }

        // ------- A ESTO NO LE HAGAN CASO XDXDDDXDDXDXDDD ------- //

        // onCancel: function (data) {
        //     alert("pago cancelado");
        //     console.log(data);
        // }
    }).render('#paypal-button-container');
}

// Funcion para el ARIGATOU GOZAIMASU asi bien KAWAII DESU NEE
function arigatou() {
    let imgArigatou = '../res/gifarigatou.gif';
    $.alert({
        title: '',
        content: '' +
            '<div class="card"  style="margin-top: 10px;">' +
            '<h3 style="text-align:center;">Arigatou Gozaimasu</h3>' +
            '<img class="card-img-top" src="' + imgArigatou + '" alt="Card image cap">' +
            '<h4 style="text-align:center;">Gracias por tu compra!</h4>' +
            '</div>',
        buttons: {
            button1: {
                text: 'Continuar',
                action: function () {
                    location.reload();
                }
            }
        }
    });
    // Declaracion del audio 
    // Esto obviamente no es necesario, pero pos ahí esta, 
    // por si alguien lo quiere utilizar.
    var audiowo = document.getElementById("audioWO");
    audiowo.play();
}

// Funcion con el metodo GET para la tabla de las incerciones con el boton de Paypal
function tabla(reinicio) {
    fetch(API.paypal, {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        if (data.length > 0) {
            $("#valoresTabla").empty();
            for (let i = 0; i < data.length; i++) {
                var fechaPago = new Date(data[i].created_date);

                if (forfecha(fechaPago) == fechaPago.toLocaleDateString() && reinicio == false) {
                    $("#valoresTabla").append(
                        '<tr style="background-color: #d5d5d5;">' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + data[i].paypal_payer_email + '</td>' +
                        '<td>' + data[i].paypal_amount + '</td>' +
                        '<td>' + data[i].paypal_currency + '</td>' +
                        '<td>' + fechaPago.toLocaleDateString() + '</td>' +
                        '</tr>'
                    )
                } else if (reinicio == true) {
                    $("#valoresTabla").append(
                        '<tr style="background-color: #d5d5d5;">' +
                        '<th scope="row">' + (i + 1) + '</th>' +
                        '<td>' + data[i].paypal_payer_email + '</td>' +
                        '<td>' + data[i].paypal_amount + '</td>' +
                        '<td>' + data[i].paypal_currency + '</td>' +
                        '<td>' + fechaPago.toLocaleDateString() + '</td>' +
                        '</tr>'
                    )
                }

            }
        }
    }
    )
}

// Funcion para los campos de fechas
function forfecha(fechaPago) {
    var inicioFecha = new Date($("#start").val());
    var inicioFecha = new Date(inicioFecha.setDate(inicioFecha.getDate() + 1));
    var finFecha = new Date($("#end").val());
    var finFecha = new Date(finFecha.setDate(finFecha.getDate() + 1));
    var dateReturn = '';
    console.log(finFecha);
    for (var d = inicioFecha; d <= finFecha; d.setDate(d.getDate() + 1)) {
        fechan = new Date(d);
        if (fechan.toLocaleDateString() == fechaPago.toLocaleDateString()) {
            dateReturn = fechaPago.toLocaleDateString();
        }
    }
    return dateReturn;
}


// Detecta un cambio en el campo de fecha inicial y vuelve a llamar a la funcion tabla()
$("#start").change(
    function () {
        tabla(false);
    }
)

// Detecta un cambio en el campo de fecha final y vuelve a llamar a la funcion tabla()
$("#end").change(
    function () {
        tabla(false);
    }
)

// Detecta cuando se pulsa el boton "reiniciar" y reinicia la tabla 
$("#btnFecha").click(
    function () {
        tabla(true);
    }
)

// AQUI INICIA LA PRACTICA DE LOS PRODUCTOS
var productosCar;
// Funcion para traer los productos desde la base de datos desde la API con un metodo GET
function productos() {
    fetch(API.productos, {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        if (data.length > 0) {
            productosCar = data;
            for (let i = 0; i < data.length; i++) {
                $("#datos").append(
                    '<div class="card col-xl-3" style="padding: 1%; margin-top: 10px;">' +
                    '<img class="card-img-top" src="' + data[i].image + '" alt="Card image cap" style="height: 300px;">' +
                    '<hr><h5 style="padding-top: 10px;">' + data[i].name + '</h5>' +
                    '<div class="card-body row">' +
                    '<h6 class="card-text col-xl-4">$' + data[i].price + ' pesos</h6>' +
                    '<a class="btn btn-secondary col-xl-8" onclick="car(' + i + ')" style="height: 40px;">Agregar al carrito</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                )
            }
        }
    })
}

// Funcion para agregar productos al carrito
function car(i) {
    precioTotal += productosCar[i].price;
    $("#carritoCompra").append(
        '<div class="col-xl-3" >' +
        '<img class="card-img-top" src="' + productosCar[i].image + '" alt="Card image cap" style="height: 90px;">' +
        '</div>' +
        '<div class="col-xl-9">' +
        '<h5 style="padding-top: 10px;">' + productosCar[i].price + '</h5>' +
        '<h6 style="padding-top: 10px;">' + productosCar[i].name + '</h6>' +
        '<hr>' +
        '</div>'
    );
    $("#total").empty();
    $("#total").append(
        ' Carrito de compra total: $' + precioTotal
    );

}

function initPayPalButtonCar() {
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'blue',
            layout: 'horizontal',
            label: 'pay',

        },

        createOrder: function (data, actions) {

            return actions.order.create({
                purchase_units: [{ "amount": { currency_code: "MXN", value: precioTotal } }]
            });
        },

        onApprove: function (data, actions) {
            // Aqui va la programacon para mandar los datos de compra del carrito, pero aun no programamos eso aun xddxdxd.
        },
        onError: function (err) {
            console.log(err);
        }

        // ------- A ESTO NO LE HAGAN CASO XDXDDDXDDXDXDDD ------- //

        // onCancel: function (data) {
        //     alert("pago cancelado");
        //     console.log(data);
        // }
    }).render('#paypal-button-container2');
}

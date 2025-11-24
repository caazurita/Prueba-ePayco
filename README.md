# ePayco
**Servicio de billetera virtual SOAP + REST**

## Este proyecto consiste en un servicio de billetera virtual que permite:
- Registro Clientes.
- Recarga Billetera.
- Pagar.
- Confirmar Pago.
- Consultar Saldo.

## Stack

| Tipo           | Herramienta           |
|----------------|-----------------------|
| wallet-app     | Laravel 12            |
| bridge-api     | Node.js + Express     |
| Base de datos  | MySQL                 |
| ORM            | Eloquent    
| Mailing        | Laravel Mail + Gmail SMTP |
| SOAP           | PHP SoapServer        |
| http client    | Postman               |

## endPoints 

### REST (node.js)

| Método | Ruta                          | Descripción                  | Parámetros |
|--------|-------------------------------|------------------------------|------------|
| POST   | `/api/wallet/createUser`      | Crear usuario                | name, document, email, phone |
| POST   | `/api/server/balance`         | Consultar saldo              | phone, document |
| POST   | `/api/server/addCredit`       | Agregar credito              | phone, document, amount |
| POST   | `/api/server/requestPayment`  | Solicitar pago               | phone, document, amount|
| POST   | `/api/server/makePayment`     | Realizar pago                | sessionId, token|

**Ejemplo request (Realizar Pago) REST:**
{
    "sessionId": "8970bbbe-904f-4263-84c4-6fff4956ce36",
    "token": "522389"
}

**Ejemplo Respuesta**
{
    "success": false,
    "message": "TRANSACTION_NOT_FOUND",
    "code": "404",
    "data": [
        "TRANSACTION_NOT_FOUND"
    ]
}

### SOAP (Laravel)

| Método | Ruta                          | Descripción                  | Parámetros |
|--------|-------------------------------|------------------------------|------------|
| POST   | `/api/server/wallet`          | Crear usuario                | name, document, email, phone |
                                         | Consultar saldo              | phone, document |
                                         | Agregar credito              | phone, document, amount |
                                         | Solicitar pago               | phone, document, amount|
                                         | Realizar pago                | sessionId, token|

**Ejemplo request (crear usuario) SOAP:**

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <createUser xmlns="http://localhost/soap">
      <name>Carlos</name>
      <document>5919925</document>
      <email>carlos@demo.com</email>
      <phone>69023406</phone>
    </createUser>
  </soap:Body>
</soap:Envelope>

**Ejemplo Respuesta**
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body>
        <SOAP-ENV:createUserResponse>
            <result>{"success":true,"message":"user created successfully","cod_error":"00","data":{"name":"Carlos","email":"carlos1234@demo.com","phone":"69098531","document":"5919923"}}</result>
        </SOAP-ENV:createUserResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>


**Notas**
Existe algunas capturas en /asset 
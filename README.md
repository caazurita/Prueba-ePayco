# ePayco
**Servicio de billetera virtual SOAP + REST**

## Este proyecto consiste en un servicio de billetera virtual que permite:
- Registro Clientes.
- Recarga Billetera.
- Solicitar Pago + envío de token por correo.
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


**Ejemplo request (Crear Usuario) REST:**
```json
{
    "name": "Carlos Alvarado Z.",
    "email": "miCorreo@demo.com",
    "phone": "78987654",
    "document": "6765432"
}
```
**Ejemplo Respuesta**

```json
{
    "success": true,
    "message": "User created successfully",
    "code": "201",
    "data": [
        {
            "name": "Carlos Alvarado Z.",
            "email": "miCorreo@demo.com",
            "phone": "78987654",
            "document": "6765432"
        }
    ]
}
```

**Ejemplo request (Solicitar Pago) REST:**
```json
{
    "phone": "69023406",
    "document": "5919925",
    "amount": 100.5
}
```
**Ejemplo Respuesta**

```json
{
    "success": true,
    "message": "Payment request created successfully",
    "code": "200",
    "data": [
        {
            "document": "5919925",
            "session_id": "0d3894ea-e85c-4d73-b26c-326ab580b36b"
        }
    ]
}
```

**Ejemplo request (Realizar Pago) REST:**
```json
{
    "sessionId": "8970bbbe-904f-4263-84c4-6fff4956ce36",
    "token": "522389"
}
```
**Ejemplo Respuesta**

```json
{
    "success": false,
    "message": "TRANSACTION_NOT_FOUND",
    "code": "404",
    "data": [
        "TRANSACTION_NOT_FOUND"
    ]
}
```

### SOAP (Laravel)

| Método | Ruta                          | Descripción                  | Parámetros |
|--------|-------------------------------|------------------------------|------------|
| POST   | `/api/server/wallet`          | Crear usuario                | name, document, email, phone |
| POST   |                               | Consultar saldo              | phone, document |
| POST   |                               | Agregar credito              | phone, document, amount |
| POST   |                               | Solicitar pago               | phone, document, amount|
| POST   |                               | Realizar pago                | sessionId, token|


**Ejemplo request (crear usuario) SOAP:**
```xml
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
```

**Ejemplo Respuesta**
```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body>
        <SOAP-ENV:createUserResponse>
            <result>{"success":true,"message":"user created successfully","cod_error":"00","data":{"name":"Carlos","email":"carlos1234@demo.com","phone":"69098531","document":"5919923"}}</result>
        </SOAP-ENV:createUserResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

**Ejemplo request (Solicitar Pago) SOAP:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <requestPayment xmlns="http://localhost/soap">
            <phone>69023406</phone>
            <document>5919925</document>
            <amount>100</amount>
        </requestPayment>
    </soap:Body>
</soap:Envelope>

```

**Ejemplo Respuesta**
```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body>
        <SOAP-ENV:requestPaymentResponse>
            <result>{"success":true,"message":"payment request created
                successfully","cod_error":"00","data":{"document":"5919925","session_id":"c25aefa2-f396-47d8-8bfb-1f71dd66afe5"}}
            </result>
        </SOAP-ENV:requestPaymentResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

**Ejemplo request (Realizar Pago) SOAP:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <makePayment xmlns="http://localhost/soap">
            <sessionId>6ba5377a-7095-4f22-ac8f-99601ac0fb03</sessionId>
            <token>984181</token>
        </makePayment>
    </soap:Body>
</soap:Envelope>


```

**Ejemplo Respuesta**
```xml
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Body>
        <SOAP-ENV:makePaymentResponse>
            <result>{"success":true,"message":"Payment processed
                successfully","cod_error":"00","data":{"document":"5919925","new_balance":599}}</result>
        </SOAP-ENV:makePaymentResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

## Notas
Existe algunas capturas en /asset 
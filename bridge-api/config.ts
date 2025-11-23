// import "dotenv/config";
export default {
  port: process.env.PORT || 3000,
  soapWsdl:
    process.env.SOAP_WSDL || "http://localhost:8000/api/server/wallet?wsdl",
};

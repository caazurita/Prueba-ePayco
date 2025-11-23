import * as soap from "soap";

class UserService {
  constructor(private client: string) {
    this.client = client;
  }

  async create(data: any) {
    try {
      const client = await soap.createClientAsync(this.client);
      const [result] = await client.createUserAsync(data);
      const res = JSON.parse(result?.result);
      const cod = res?.cod_error;
      console.log("SOAP Response:", res);
      if (cod !== "00") {
        if (cod === "409") {
          throw new Error("USER_ALREADY_EXISTS");
        } else {
          throw new Error("ERROR_CREATING_USER");
        }
      }
      return res?.data;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;

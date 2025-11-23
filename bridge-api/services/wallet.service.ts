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

  async getBalance(data: any) {
    try {
      const client = await soap.createClientAsync(this.client);
      const [result] = await client.getBalanceAsync(data);
      const res = JSON.parse(result?.result);
      const cod = res?.cod_error;
      if (cod !== "00") {
        if (cod === "404") {
          throw new Error("USER_NOT_FOUND");
        } else {
          throw new Error("ERROR_FETCHING_BALANCE");
        }
      }
      return res?.data;
    } catch (error) {
      throw error;
    }
  }

  async addCredit(data: any) {
    try {
      const client = await soap.createClientAsync(this.client);
      const [result] = await client.addCreditAsync(data);
      const res = JSON.parse(result?.result);
      const cod = res?.cod_error;
      if (cod !== "00") {
        if (cod === "404") {
          throw new Error("USER_NOT_FOUND");
        } else {
          throw new Error("ERROR_ADDING_CREDIT");
        }
      }
      return res?.data;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;

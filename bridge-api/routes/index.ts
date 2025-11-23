import walletouter from "./wallet";

const routerApi = (app: any) => {
  app.use("/api/wallet", walletouter);
};

export default routerApi;

import Axios, { AxiosRequestConfig } from "axios";
import { RPCRequest, RPCResponse } from "../defined/rpc";

export default abstract class Client {
  protected uri: string;
  protected bulkData: RPCRequest[];
  protected reqConfig: AxiosRequestConfig;
  constructor(
    public user: string,
    public pass: string,
    public ip: string,
    public port: number
  ) {
    this.bulkData = [];
    this.reqConfig = {
      auth: {
        password: this.pass,
        username: this.user
      }
    };

    // if (/^https.+$/.test(this.ip)) {
    //   this.reqConfig.httpsAgent = new httpsAgent({ keepAlive: true });
    // } else {
    //   this.reqConfig.httpAgent = new httpAgent({ keepAlive: true });
    // }
    this.uri = /^http.+$/.test(this.ip)
      ? `${this.ip}:${this.port}`
      : `http://${this.ip}:${this.port}`;
  }

  public async RpcCall<T = string>(
    method: string,
    params?: any[],
    id?: number | string
  ) {
    const reqData: RPCRequest = {
      id: id || Date.now(),
      jsonrpc: "2.0",
      method,
      params: params || []
    };

    const ret = await Axios.post<RPCResponse<T>>(
      this.uri,
      reqData,
      this.reqConfig
    );
    return ret.data;
  }

  /**
   * Bulk rpc call addition
   * @param method
   * @param param
   * @param id
   */
  public BulkAdd(method: string, param?: any[], id?: number): void {
    const data: RPCRequest = {
      id: id || Date.now(),
      jsonrpc: "2.0",
      method,
      params: param || []
    };
    this.bulkData.push(data);
  }

  /**
   * Bulk RPC Call func
   * recommendation using it from same request bulk
   */
  public async BulkRpcCall<T = any>() {
    const reqData: RPCRequest[] = this.bulkData;
    // clear data
    this.bulkData = [];
    const res = await Axios.post<Array<RPCResponse<T>>>(
      this.uri,
      reqData,
      this.reqConfig
    );
    return res.data;
  }

  /**
   * RPC Request by user defined bulk data
   * here no using this.bulkData
   */
  public async BulkRpcExec<T = any>(data: RPCRequest[]) {
    const res = await Axios.post<Array<RPCResponse<T>>>(
      this.uri,
      data,
      this.reqConfig
    );
    return res.data;
  }
}

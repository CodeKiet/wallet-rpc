/// <reference types="node" />
import RPCClient, { IRpcConfig, IRpcResponse } from "../client";
export interface IEthSyncing {
    startingBlock: string;
    currentBlock: string;
    highestBlock: string;
}
export declare type IEthStatus = "earliest" | "latest" | "pending";
export interface IEthBlock {
    number: string | null;
    hash: string | null;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionsRoot: string;
    stateRoot: string;
    miner: string;
    difficulty: string;
    totalDifficulty: string;
    extraData: string;
    size: string;
    gasLimit: string;
    gasUsed: string;
    timestamp: string;
    uncles: string[];
}
export interface IEthBlockSimple extends IEthBlock {
    transactions: string[];
}
export interface IEthBlockVerbose extends IEthBlock {
    transactions: IEthTx[];
}
export interface IEthTx {
    hash: string;
    nonce: string;
    blockHash: string | null;
    blockNumber: string | null;
    transactionIndex: string | null;
    from: string;
    to?: string;
    value: string;
    gas: string;
    gasPrice: string;
    input: string;
    v: string;
    r: string;
    s: string;
}
export interface IEthTxReceipt {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string | null;
    contractAddress: string | null;
    cumulativeGasUsed: string;
    gasUsed: string;
    logs: IEthReceiptLogs[];
    logsBloom: string;
    status?: "0x1" | "0x0";
    root?: string;
}
export interface IEthReceiptLogs {
    address: string;
    topics: string[];
    data: string;
    blockNumber?: string;
    transactionHash?: string;
    transactionIndex?: string;
    blockHash?: string;
    logIndex: string;
    removed: boolean;
}
export interface IEthSentTxStruct {
    from: string;
    to: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data: string;
    nonce?: string;
}
export interface IEthCallFuncParam {
    from?: string;
    to?: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
}
export interface IEthTraceTxReturn {
    failed: boolean;
    gas: number;
    returnValue: string;
    structLogs: Array<{
        pc: number;
        op: object;
        gas: number;
        gasPrice: number;
        memory: object;
        stack: object[];
        account: string;
        err: string;
    }>;
}
export interface IParityCreateAction {
    from: string;
    value: string;
    gas: string;
    init: string;
}
export interface IParityCallAction {
    /** spell-checker: disable */
    callType: "call" | "callcode" | "delegatecall" | "staticcall";
    /** spell-checker: enable */
    from: string;
    to: string;
    value: string;
    gas: string;
    input: string;
}
export interface IParitySuicideAction {
    address: string;
    refundAddress: string;
    balance: string;
}
export interface IParityCreateResult {
    address: string;
    code: string;
    gasUsed: string;
}
export interface IParityCallResult {
    gasUsed: string;
    output: string;
}
export interface IParityTxTrace {
    action: IParityCallAction | IParityCreateAction | IParitySuicideAction;
    blockHash: string;
    blockNumber: number;
    result?: IParityCallResult | IParityCreateResult | null;
    subtraces: number;
    error?: string;
    traceAddress: number[];
    transactionHash: string;
    transactionPosition: number;
    type: "create" | "call" | "suicide";
}
export interface IEtherScanAbiResponse {
    status: string;
    message: string;
    result: string;
}
export interface IEthAbiStruct {
    name: string;
    type: "function" | "constructor" | "fallback";
    constant?: boolean;
    inputs?: IEthAbiInputStruct[];
    outputs?: IEthAbiOutputStruct[];
    payable?: boolean;
    stateMutability?: "view" | "pure" | "nonpayable" | "payable";
    anonymous?: boolean;
}
export interface IEthAbiCommonStruct {
    name: string;
    type: string;
}
export interface IEthAbiOutputStruct extends IEthAbiCommonStruct {
    components: IEthAbiOutputStruct[];
}
export interface IEthAbiInputStruct extends IEthAbiCommonStruct {
    indexed?: boolean;
}
export declare class EthereumClient extends RPCClient {
    constructor(conf?: IRpcConfig);
    /**
     * Returns an object with data about the sync status or false.
     * returns value
     * startingBlock: QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)
     * currentBlock: QUANTITY - The current block, same as eth_blockNumber
     * highestBlock: QUANTITY - The estimated highest block
     */
    syncProgress(): Promise<IRpcResponse<boolean | IEthSyncing>>;
    getBalance(address: string, status?: IEthStatus): Promise<IRpcResponse<string>>;
    getBlockCount(): Promise<IRpcResponse<string>>;
    getBlockByHash(hash: string, getFullTx?: boolean): Promise<IRpcResponse<IEthBlock>>;
    /**
     * Get information about a block by block number.
     * @param symbol QUANTITY|TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
     */
    getBlock(symbol: string): Promise<IRpcResponse<IEthBlockSimple>>;
    getBlockVerbose(symbol: string): Promise<IRpcResponse<IEthBlockVerbose>>;
    getTxByHash(hash: string): Promise<IRpcResponse<IEthTx | null>>;
    /**
     * Return raw transaction by hash
     * There is an "undocumented" method eth_getRawTransactionByHash
     * @param hash
     */
    getRawTxByHash(hash: string): Promise<IRpcResponse<string>>;
    /**
     * Returns the receipt of a transaction by transaction hash.
     * Note That the receipt is not available for pending transactions.
     * @param hash tx hash
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
     */
    getTxReceipt(hash: string): Promise<IRpcResponse<IEthTxReceipt | null>>;
    sendRawTx(raw: string): Promise<IRpcResponse<string>>;
    /**
     * Creates new message call transaction or a contract creation, if the data field contains code.
     * from: DATA, 20 Bytes - The address the transaction is send from.
     * to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.
     * gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.
     * gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas
     * value: QUANTITY - (optional) Integer of the value sent with this transaction
     * data: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. For details see Ethereum Contract ABI
     * nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
     * @see https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
     */
    sendTx(tx: IEthSentTxStruct): Promise<IRpcResponse<string>>;
    /**
     * Returns the number of transactions sent from an address.
     * alias for getTxCount
     * Geth(<=1.8.12) now doesn't supports pending nonce.
     * please use `parity` with `getAddrNextNonce` in the flow func
     */
    getAddrNonce(address: string, status?: IEthStatus): Promise<IRpcResponse<string>>;
    /**
     * Returns next available nonce for transaction from given account.
     * Includes pending block and transaction queue.
     * !! Only for parity node
     * @param address
     * @see https://wiki.parity.io/JSONRPC-parity-module#parity_nextnonce
     */
    getAddrNextNonce(address: string): Promise<IRpcResponse<string>>;
    /**
     * Returns the current price per gas in wei.
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
     */
    getCurrentGasPrice(): Promise<IRpcResponse<string>>;
    /**
     * Executes a new message call immediately without creating a transaction on the block chain.
     * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
     */
    callFunc(param: IEthCallFuncParam, status?: IEthStatus): Promise<IRpcResponse<string>>;
    /**
     * Returns code at a given address.
     * @param address DATA, 20 Bytes - address
     * @param status integer block number, or the string "latest", "earliest" or "pending"
     * @returns the code from the given address
     */
    getCode(address: string, status: IEthStatus): Promise<IRpcResponse<string>>;
    /**
     * Detect the address given is contract address or not
     * but if contract self destructor would be return false
     * @param address string
     * @param status string
     * @returns boolean
     */
    isContract(address: string): Promise<boolean>;
    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
     * The transaction will not be added to the blockchain.
     * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
     * for a variety of reasons including EVM mechanics and node performance.
     */
    getEstimateGas(param: IEthCallFuncParam): Promise<IRpcResponse<string>>;
    /**
     * Sign Message.
     * NOT Supports address which doesn't in you eth-rpc
     * @param address the address to sign with must be unlocked.
     * @param data N Bytes - message to sign
     */
    signMessage(address: string, data: Buffer): Promise<IRpcResponse<string>>;
    /**
     * debug trace transaction
     * you should start geth with `--rpcapi="web3,trace"
     * @see https://github.com/ethereum/go-ethereum/wiki/Management-APIs#debug_tracetransaction
     */
    traceTx(txid: string, opt?: {
        disableStorage?: boolean;
        disableMemory?: boolean;
        disableStack?: boolean;
        trace?: string;
        timeout?: string;
    }): Promise<IRpcResponse<IEthTraceTxReturn>>;
    traceTxByParity(txid: string): Promise<IRpcResponse<IParityTxTrace[] | null>>;
    ERC20Balance(token: string, address: string, isPending?: boolean): Promise<string>;
    ERC20Decimals(token: string): Promise<undefined | number>;
    ERC20TotalSupply(token: string): Promise<string | undefined>;
    ERC20Name(token: string): Promise<undefined | string>;
    ERC20Symbol(token: string): Promise<undefined | string>;
    ERC20TokenInfo(token: string): Promise<{
        address: string;
        decimals: number | undefined;
        name: string | undefined;
        symbol: string | undefined;
        totalSupply: string | undefined;
    }>;
}

/* global QBrowser */
import { useEffect, useState } from 'react';
import './PaymentEngine.css';
class InvoiceItem {
    constructor(
        productCode, // String
        description, // String
        saleCode, // QBrowser.QPay.SaleCode
        quantity, // Number
        unitOfMeasureCode, // String
        unitPrice, // String
        taxIncludedInPrice, // Boolean
        net, // Number
        tax, // Number
        discount, // Number
        gross // Number 
    ) {
        this.productCode = productCode;
        this.description = description;
        this.saleCode = saleCode;
        this.quantity = quantity;
        this.unitOfMeasureCode = unitOfMeasureCode;
        this.unitPrice = unitPrice;
        this.taxIncludedInPrice = taxIncludedInPrice;
        this.net = net;
        this.tax = tax;
        this.discount = discount;
        this.gross = gross;
    }
}
const PaymentEngine = () => {

    const [logs, setLogs] = useState([]);
    const [transaction, setTransaction] = useState('');
    const [transactionType, setTransactionType] = useState('');

    useEffect(() => {
        const handleMessage = e => {
            logToContainer(e.detail);
          };

        document.addEventListener(
            "message",
            (e) => {
                handleMessage(e);
            },
            false
          );
        
          return () => {
            document.removeEventListener('message', handleMessage);
          };

    }, []);

    const logToContainer = (message) => {
        console.log(message);
        setLogs((logs) => [...logs, message]);
    };

    const invoiceBuildError = (message) => {
        alert("Invoice build failed: " + message);
    };

    window.invoiceBuildError = invoiceBuildError;

    const invoiceBuildSuccess = (invoice) => {
        logToContainer("Transaction amount: " + invoice.gross);
        buildTransaction(invoice);
    };

    window.invoiceBuildSuccess = invoiceBuildSuccess;

    const peripheralMessageHandler = (message) => {
        logToContainer(message);
    };

    window.peripheralMessageHandler = peripheralMessageHandler;

    const peripheralStateHandler = (state) => {
        logToContainer(state);
    };

    window.peripheralStateHandler = peripheralStateHandler;

    const transactionStateHandler = (state, transaction) => {
        logToContainer(state);
    };

    window.transactionStateHandler = transactionStateHandler;

    const transactionResultHandler = (result) => {
        var resultEnum = QBrowser.QPay.TransactionResult[result.result];
        logToContainer("Result: " + resultEnum);

        //No need to show receipt if we are calling auth.
        if (resultEnum == "Approved" && transactionType != QBrowser.QPay.TransactionType.AUTH) {
            logToContainer("<a href='" + result.receipt.customerReceiptUrl + "'>Transaction Receipt</a>");
        }
    };

    window.transactionResultHandler = transactionResultHandler;

    const connectionStateHandler = (state) => {
        logToContainer(state);
    };

    window.connectionStateHandler = connectionStateHandler;

    const engineBuildError = (message) => {
        alert("PaymentEngine build failed: " + message);
    };

    window.engineBuildError = engineBuildError;

    const engineBuildSuccess = () => {
        logToContainer("PaymentEngine is ready!");
    };

    window.engineBuildSuccess = engineBuildSuccess;

    const qpayError = (message) => {
        const newMessage = "Error: " + message;
        setLogs(prevLog => prevLog + '\n' + newMessage);
        window.scrollTo(0, document.body.scrollHeight);
    };

    window.qpayError = qpayError;

    const transactionBuildError = (message) => {
        alert("Transaction build error: " + message);
    };

    window.transactionBuildError = transactionBuildError;

    const transactionBuildSuccess = (transactionParam) => {
        setTransaction(transactionParam)
        console.log(transactionParam);
        logToContainer("Transaction ID: " + transactionParam.ID);
    };

    window.transactionBuildSuccess = transactionBuildSuccess;

    const transactionResponse = (response) => {
        logToContainer("Response: " + JSON.stringify(response));
    };

    window.transactionResponse = transactionResponse;

    const buildTransaction = (invoice) => {
        var transactionBuilder = QBrowser.QPay.PaymentEngine.buildTransaction(invoice, qpayError);
        transactionBuilder.transactionType(transactionType, null, qpayError);
        transactionBuilder.amount(invoice.net.toString(), "USD", qpayError);
        transactionBuilder.build(transactionBuildSuccess, transactionBuildError);
    };

    const startTransaction = () => {
        QBrowser.QPay.PaymentEngine.startTransaction(transactionResponse);
    };

    window.startTransaction = startTransaction;


    const captureTransaction = () => {
        setTransactionType(QBrowser.QPay.TransactionType.CAPTURE);
        var transactionBuilder = QBrowser.QPay.PaymentEngine.buildTransaction('', qpayError);
        transactionBuilder.transactionType(QBrowser.QPay.TransactionType.CAPTURE, transaction.ID, qpayError);
        transactionBuilder.amount(transaction.invoice.net.toString(), "USD", qpayError);
        transactionBuilder.build(startTransaction, transactionBuildError);
    };

    const stopActiveTransaction = () => {
        QBrowser.QPay.PaymentEngine.stopActiveTransaction(qpayError);
    };

    const getStoredTransactions = () => {
        QBrowser.QPay.PaymentEngine.getStoredTransactions(storedTransactions, qpayError);
    };

    const storedTransactions = (results) => {
        alert("Stored: " + JSON.stringify(results));
    };

    window.storedTransactions = storedTransactions;
    
    const uploadAllStoredTransactions = () => {
        QBrowser.QPay.PaymentEngine.uploadAllStoredTransactions(uploadedTransactions, qpayError);
    };

    const uploadedTransactions = (results) => {
        logToContainer("Uploaded: " + results.length + " transactions");
    };
    
    window.uploadedTransactions = uploadedTransactions;
    
    const buildInvoiceSale = () =>{
        setTransactionType(QBrowser.QPay.TransactionType.SALE);
        buildInvoice();
    };

    const buildInvoiceAuth = () =>{
        setTransactionType(QBrowser.QPay.TransactionType.AUTH);
        buildInvoice();
    };

    const buildInvoice = () => {
        var invoiceBuilder = QBrowser.QPay.PaymentEngine.buildInvoice("IV12345", qpayError);
            invoiceBuilder.companyName("ACME", qpayError);
            invoiceBuilder.purchaseOrderReference("PO123", qpayError);

            // Item 1
            let invoiceItem = new InvoiceItem(
                "SKU123",
                "VIP Ticket",
                QBrowser.QPay.SaleCode.SALE,
                1,
                QBrowser.QPay.UnitOfMeasure.EACH,
                1.50,
                false,
                1.50,
                0.00,
                0.00,
                1.50
            );
            invoiceBuilder.addItem(invoiceItem, qpayError);

            // Item 2
            let invoiceItem2 = new InvoiceItem(
                "SKU125",
                "VIP Ticket2",
                QBrowser.QPay.SaleCode.SALE,
                1,
                QBrowser.QPay.UnitOfMeasure.EACH,
                2.50,
                false,
                2.50,
                0.00,
                0.00,
                2.50
            );
            invoiceBuilder.addItem(invoiceItem2, qpayError);

            // Build invoice with provided params above
            invoiceBuilder.build(invoiceBuildSuccess, invoiceBuildError);
    };

    const buildEngine = () => {
         // Vars
        const qpay = QBrowser.QPay;
        const paymentEngine = QBrowser.QPay.PaymentEngine;
        // Initilize QPay module with credentials from settings
        // When the app start, the QuantumPay module must be initialized if payment is required.
        // This initialization feeds the credentials and tenant keys to the QuantumPay module.
        // The credentials will be provided by Infinite Peripherals.
        qpay.initialize();

        // Set transaction callback functions to receive update throughout the payment process.
        paymentEngine.setConnectionStateHandler(connectionStateHandler);
        paymentEngine.setTransactionResultHandler(transactionResultHandler);
        paymentEngine.setTransactionStateHandler(transactionStateHandler);
        paymentEngine.setPeripheralStateHandler(peripheralStateHandler);
        paymentEngine.setPeripheralMessageHandler(peripheralMessageHandler);

        var deviceSerialNumber = "1620900138";//use null for usb connection on Android.
        // Create a PaymentEngineBuilder to build a PaymentEngine object
        paymentEngine.builder(qpayError)
            .addPeripheral(qpay.Peripherals.QPP451, deviceSerialNumber, qpayError)
            .server(qpay.ServerEnvironments.TEST, qpayError)
            .transactionTimeout(30, qpayError)
            .emvApplicationSelectionStrategy(qpay.EmvApplicationSelectionStrategy.FIRST, qpayError)
            .storeAndForward(qpay.StoreAndForwardMode.WHEN_OFFLINE, 60, qpayError)
            .build(engineBuildSuccess, engineBuildError);
    };

    return (
        <div>
            <div id="boxTop">
                <p id="pTitle">Quantum Pay</p>
                <button onClick={buildEngine}>Build Engine</button>
                <button onClick={buildInvoiceSale}>Build Invoice, Transaction - SALE</button>
                <button onClick={startTransaction}>Start Transaction</button>
                <button onClick={buildInvoiceAuth}>Build Invoice, Transaction - AUTH</button>
                <button onClick={startTransaction}>Start AUTH</button>
                <button onClick={captureTransaction}>Capture Transaction</button>
                <button onClick={stopActiveTransaction}>Stop Active Transaction</button>
                <button onClick={getStoredTransactions}>Get Stored Transactions</button>
                <button onClick={uploadAllStoredTransactions}>Upload Stored Transactions</button>
            </div>

            <div id="logBox">
                {/* Print logs */}
                {logs.map((log, index) => (
                    <p key={index}>{log}</p>
                ))}
            </div>
        </div>
    );
};

export default PaymentEngine;

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

    window.logToContainer = (message) => {
        console.log(message);
        setLogs((logs) => [...logs, message]);
    };

    window.invoiceBuildError = (message) => {
        alert("Invoice build failed: " + message);
    };

    window.invoiceBuildSuccess = (invoice) => {
        logToContainer("Transaction amount: " + invoice.gross);
        buildTransaction(invoice);
    };

    window.peripheralMessageHandler = (message) => {
        logToContainer(message);
    };

    window.peripheralStateHandler = (state) => {
        logToContainer(state);
    };

    window.transactionStateHandler = (state, transaction) => {
        logToContainer(state);
        setTransaction(transaction); // Assuming you have a transaction state
    };

    window.transactionResultHandler = (result) => {
        var resultEnum = QBrowser.QPay.TransactionResult[result.result];
        logToContainer("Result: " + resultEnum);

        if (resultEnum == "Approved") {
            logToContainer("<a href='" + result.receipt.customerReceiptUrl + "'>Transaction Receipt</a>");
        }
    };

    window.connectionStateHandler = (state) => {
        logToContainer(state);
    };

    window.engineBuildError = (message) => {
        alert("PaymentEngine build failed: " + message);
    };

    window.engineBuildSuccess = () => {
        logToContainer("PaymentEngine is ready!");
    };

    window.qpayError = (message) => {
        const newMessage = "Error: " + message;
        setLogs(prevLog => prevLog + '\n' + newMessage);
        window.scrollTo(0, document.body.scrollHeight);
    };

    window.transactionBuildError = (message) => {
        alert("Transaction build error: " + message);
    };

    window.transactionBuildSuccess = (transactionParam) => {
        setTransaction(transactionParam)
        logToContainer("Transaction ID: " + transactionParam.ID);
        console.log(transaction);
    };

    window.transactionResponse = (response) => {
        logToContainer("Response: " + JSON.stringify(response));
    };

    const buildTransaction = (invoice) => {
        var transactionBuilder = QBrowser.QPay.PaymentEngine.buildTransaction(invoice, qpayError);
        transactionBuilder.transactionType(QBrowser.QPay.TransactionType.SALE, null, qpayError);
        transactionBuilder.amount(invoice.net.toString(), "USD", qpayError);
        transactionBuilder.build(transactionBuildSuccess, transactionBuildError);
    };

    const startTransaction = () => {
        QBrowser.QPay.PaymentEngine.startTransaction(transactionResponse);
    };

    const stopActiveTransaction = () => {
        QBrowser.QPay.PaymentEngine.stopActiveTransaction(qpayError);
    };

    const getStoredTransactions = () => {
        alert("Still not in use");
        QBrowser.QPay.PaymentEngine.getStoredTransactions(storedTransactions, qpayError);
    };

    const storedTransactions = (results) => {
        alert("Still not in use");
        alert("Stored: " + JSON.stringify(results));
    };

    const uploadAllStoredTransactions = () => {
        alert("Still not in use");
        QBrowser.QPay.PaymentEngine.uploadAllStoredTransactions(uploadedTransactions, qpayError);
    };

    const uploadedTransactions = (results) => {
        logToContainer("Uploaded: " + results.length + " transactions");
    };


    const buildInvoice = () => {
        var invoiceBuilder = QBrowser.QPay.PaymentEngine.buildInvoice("IV12345", "qpayError");
            invoiceBuilder.companyName("ACME", "qpayError");
            invoiceBuilder.purchaseOrderReference("PO123", "qpayError");

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
            invoiceBuilder.addItem(invoiceItem, "qpayError");

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
            invoiceBuilder.addItem(invoiceItem2, "qpayError");

            // Build invoice with provided params above
            invoiceBuilder.build("invoiceBuildSuccess", "invoiceBuildError");
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
        paymentEngine.setConnectionStateHandler("connectionStateHandler");
        paymentEngine.setTransactionResultHandler("transactionResultHandler");
        paymentEngine.setTransactionStateHandler("transactionStateHandler");
        paymentEngine.setPeripheralStateHandler("peripheralStateHandler");
        paymentEngine.setPeripheralMessageHandler("peripheralMessageHandler");

        // Create a PaymentEngineBuilder to build a PaymentEngine object
        paymentEngine.builder("qpayError")
            .addPeripheral(qpay.Peripherals.QPP450, null, "qpayError")
            .server(qpay.ServerEnvironments.TEST, "qpayError")
            .transactionTimeout(30, "qpayError")
            .emvApplicationSelectionStrategy(qpay.EmvApplicationSelectionStrategy.FIRST, "qpayError")
            .storeAndForward(qpay.StoreAndForwardMode.WHEN_OFFLINE, 60, "qpayError")
            .build("engineBuildSuccess", "engineBuildError");
    };

    return (
        <div>
            <div id="boxTop">
                <p id="pTitle">Quantum Pay React</p>
                <button onClick={buildEngine}>Build Engine</button>
                <button onClick={buildInvoice}>Build Invoice, Transaction</button>
                <button onClick={startTransaction}>Start Transaction</button>
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
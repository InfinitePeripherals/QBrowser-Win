Getting Started with QBrowser in React
============================================

The `PaymentEngine` component in React is designed to provide payment functionalities within your application. It interacts with the QuantumPay library to handle transactions, build invoices, and manage peripheral devices. This guide will walk you through the necessary steps to integrate and utilize the `PaymentEngine` component effectively.

Prerequisites
-------------

Before getting started, make sure you have the following prerequisites in place:

-   Basic understanding of React and JavaScript
-   QuantumPay credentials and tenant keys (provided by Infinite Peripherals)
-   QuantumPay library manually referenced in your project

Installation
------------

To begin using the `PaymentEngine` component, ensure that the QuantumPay library is manually referenced in your project. Contact QuantumPay support to obtain the library files and follow their instructions to include it in your project.

Component Usage
---------------

The `PaymentEngine` component provides various functionalities that can be utilized in your application. Here's an overview of the available functions and their purposes:

### Initialization

Before using the `PaymentEngine`, make sure to initialize the QuantumPay library with the provided credentials. This initialization should be performed when your application starts. Add the following code to your application's initialization logic:

javascript

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <script src="./QBrowser.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Add the QuantumPay library script reference (`<script src="./QBrowser.js"></script>`) to your HTML file. This ensures that the QuantumPay library is loaded and accessible throughout your React application.

### Building the Payment Engine

To build the PaymentEngine object, use the `buildEngine` function. This function sets up the necessary configurations for the PaymentEngine. Call this function after the QuantumPay module is initialized:

javascript

```javascript
const buildEngine = () => {
  // Set transaction callback functions to receive updates throughout the payment process
  QBrowser.QPay.PaymentEngine.setConnectionStateHandler('connectionStateHandler');
  QBrowser.QPay.PaymentEngine.setTransactionResultHandler('transactionResultHandler');
  QBrowser.QPay.PaymentEngine.setTransactionStateHandler('transactionStateHandler');
  QBrowser.QPay.PaymentEngine.setPeripheralStateHandler('peripheralStateHandler');
  QBrowser.QPay.PaymentEngine.setPeripheralMessageHandler('peripheralMessageHandler');

  // Create a PaymentEngineBuilder to build a PaymentEngine object
  QBrowser.QPay.PaymentEngine.builder('qpayError')
    .addPeripheral(QBrowser.QPay.Peripherals.QPP450, null, 'qpayError')
    .server(QBrowser.QPay.ServerEnvironments.TEST, 'qpayError')
    .transactionTimeout(30, 'qpayError')
    .emvApplicationSelectionStrategy(QBrowser.QPay.EmvApplicationSelectionStrategy.FIRST, 'qpayError')
    .storeAndForward(QBrowser.QPay.StoreAndForwardMode.WHEN_OFFLINE, 60, 'qpayError')
    .build('engineBuildSuccess', 'engineBuildError');
};
```

### Building an Invoice and Transaction

To build an invoice and transaction, use the `buildInvoice` function. This function constructs an invoice with the provided parameters and initiates the payment transaction. Invoke this function when you want to initiate a payment:

javascript

```javascript
const buildInvoice = () => {
  const invoiceBuilder = QBrowser.QPay.PaymentEngine.buildInvoice('IV12345', 'qpayError');

  // Set invoice details
  invoiceBuilder.companyName('ACME', 'qpayError');
  invoiceBuilder.purchaseOrderReference('PO123', 'qpayError');

  // Add items to the invoice
  const invoiceItem = new QBrowser.InvoiceItem('SKU123', 'VIP Ticket', QBrowser.QPay.SaleCode.SALE, 1, QBrowser.QPay.UnitOfMeasure.EACH, 1.50, false, 1.50, 0.00, 0.00, 1.50);
  invoiceBuilder.addItem(invoiceItem, 'qpayError');

  const invoiceItem2 = new QBrowser.InvoiceItem('SKU125', 'VIP Ticket2', QBrowser.QPay.SaleCode.SALE, 1, QBrowser.QPay.UnitOfMeasure.EACH, 2.50, false, 2.50, 0.00, 0.00, 2.50);
  invoiceBuilder.addItem(invoiceItem2, 'qpayError');

  // Build the invoice with the provided parameters
  invoiceBuilder.build('invoiceBuildSuccess', 'invoiceBuildError');
};
```

### Starting and Stopping Transactions

To start a transaction, use the `startTransaction` function. This function triggers the payment process:

javascript

```javascript
const startTransaction = () => {
  QBrowser.QPay.PaymentEngine.startTransaction('transactionResponse');
};
```

To stop an active transaction, use the `stopActiveTransaction` function:

javascript

```javascript
const stopActiveTransaction = () => {
  QBrowser.QPay.PaymentEngine.stopActiveTransaction('qpayError');
};
```

### Handling Transaction Responses

You can define custom callback functions to handle various transaction events and responses. Here are some example handlers:

javascript

```javascript
window.transactionStateHandler = (state, transaction) => {
  // Handle transaction state updates
  // ...
};

window.transactionResultHandler = (result) => {
  // Handle transaction result
  // ...
};

window.transactionResponse = (response) => {
  // Handle transaction response
  // ...
};

window.qpayError = (message) => {
  // Handle QuantumPay errors
  // ...
};
```

### Logging

The `PaymentEngine` component provides a log container to display various messages and updates. You can access this container by calling `logToContainer` within the component. The logs can be rendered as follows:

```javascript
return (
  <div>
    <div id="boxTop">
      {/* Buttons and controls for initiating payment */}
    </div>

    <div id="logBox">
      {/* Render logs */}
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  </div>
);
```

Example Usage
-------------

Here's an example of how you can use the `PaymentEngine` component within your React application:

javascript

```javascript
import React from 'react';
import PaymentEngine from './PaymentEngine';

const App = () => {
  // Call the buildEngine function to initialize the PaymentEngine
  React.useEffect(() => {
    buildEngine();
  }, []);

  return (
    <div>
      {/* Your application content */}
      <PaymentEngine />
    </div>
  );
};

export default App;
```

In the above example, the `buildEngine` function is called inside a `useEffect` hook to ensure it runs once when the component mounts. Adjust the initialization logic according to your specific requirements.

Conclusion
----------

Congratulations! You have successfully integrated the `PaymentEngine` component into your React application. You can now initiate transactions, build invoices, and handle payment-related events using QuantumPay's functionality. Customize the component according to your specific requirements to enhance your application's payment capabilities.

For more detailed information and advanced usage, refer to the QuantumPay documentation and API reference.
![image](https://github.com/InfinitePeripherals/QPayBrowser/assets/135730479/b1e02fbc-4426-4f7b-8ac1-3f1c074807cd)

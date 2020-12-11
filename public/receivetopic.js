const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

const connectionString = "Endpoint=sb://myproductbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=rtc7YBO/sn93Un8kneBcNxEc2W1WykvYnzD8Gr987F4=";
const topicName = "myproducttopic";
const subscriptionName = "productsub";

 async function main() {
	// create a Service Bus client using the connection string to the Service Bus namespace
	const sbClient = new ServiceBusClient(connectionString);

	// createReceiver() can also be used to create a receiver for a queue.
	const receiver = sbClient.createReceiver(topicName, subscriptionName);

	// function to handle messages
	const myMessageHandler = async (messageReceived) => {
       // console.log(`${messageReceived}`);
       console.log(messageReceived.body);
		//console.log(`Received message: ${messageReceived.body}`);
	};

	// function to handle any errors
	const myErrorHandler = async (error) => {
		console.log(error);
	};

	// subscribe and specify the message and error handlers
	receiver.subscribe({
		processMessage: myMessageHandler,
		processError: myErrorHandler
	});

	// Waiting long enough before closing the sender to send messages
	await delay(5000);

	await receiver.close();	
	await sbClient.close();
}

// call the main function
main().catch((err) => {
	console.log("Error occurred: ", err);
	process.exit(1);
 });

 module.exports=main();
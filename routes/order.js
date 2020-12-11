const express = require('express');
const router = express.Router();
//const sender=require('../sendtopic');
const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

const connectionString = "Endpoint=sb://myproductbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=rtc7YBO/sn93Un8kneBcNxEc2W1WykvYnzD8Gr987F4=";
const topicName = "myproducttopic";
const subscriptionName = "productsub";

async function receivedata(){
    // create a Service Bus client using the connection string to the Service Bus namespace
	const sbClient = new ServiceBusClient(connectionString);

	// createReceiver() can also be used to create a receiver for a queue.
	const receiver = sbClient.createReceiver(topicName, subscriptionName);

    // function to handle messages
    var data=[];
	const myMessageHandler = async (messageReceived) => {
       data.push(messageReceived.body);
        console.log("Received Message: ");
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
async function senddata(data) {
    var messages=[];
    messages.push({body:data});
    //console.log(messages);

   // create a Service Bus client using the connection string to the Service Bus namespace
   const sbClient = new ServiceBusClient(connectionString);

   // createSender() can also be used to create a sender for a queue.
   const sender = sbClient.createSender(topicName);

   try {
       // Tries to send all messages in a single batch.
       // Will fail if the messages cannot fit in a batch.
       // await sender.sendMessages(messages);

       // create a batch object
       let batch = await sender.createMessageBatch(); 
       for (let i = 0; i < messages.length; i++) {
           // for each message in the arry			

           // try to add the message to the batch
           if (!batch.tryAddMessage(messages[i])) {			
               // if it fails to add the message to the current batch
               // send the current batch as it is full
               await sender.sendMessages(batch);

               // then, create a new batch 
               batch = await sender.createBatch();

               // now, add the message failed to be added to the previous batch to this batch
               if (!batch.tryAddMessage(messages[i])) {
                   // if it still can't be added to the batch, the message is probably too big to fit in a batch
                   throw new Error("Message too big to fit in a batch");
               }
           }
       }

       // Send the last created batch of messages to the topic
       await sender.sendMessages(batch);

       console.log(`Sent a batch of messages to the topic: ${topicName}`);

       // Close the sender
       await sender.close();
   } finally {
       await sbClient.close();
   }
}
router.get('/receive',function(req,res,next){
    receivedata().catch((err)=>{
        console.log("Error occurred: ", err);
        process.exit(1);    
    })
    res.render('success', { 
        message: "Successfully Done"
    });
});
router.post('',function(req,res,next){
    senddata(req.body).then(result=>{
        console.log(result);
        res.render('success', { 
            message: "Successfully Done"
        });
    }).catch(err=>{
        console.log("Error occurred: ", err);
	    process.exit(1);
    });
    
});

module.exports=router;
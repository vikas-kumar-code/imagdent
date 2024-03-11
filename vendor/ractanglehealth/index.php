<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <?php
        include './BridgeCommSDK.php';
        
        /////////////////////////Test the SDK/////////////////////////////////////////////////
        $request = new BridgeCommRequest();
        $request->RequestType = "004";
        $request->TransactionID = "17800220190919093402";
        $request->User = "madams";
        $request->Password = "T1Ger51983#";
        
        $request->requestMessage = new RequestMessage();
        $request->requestMessage->TransIndustryType = "RS";
        $request->requestMessage->TransactionType = "sale";
        $request->requestMessage->AcctType = "R";
        $request->requestMessage->Amount = "1000";
        $request->requestMessage->HolderType = "P";
        $request->requestMessage->MerchantCode = "178000";
        $request->requestMessage->MerchantAccountCode = "178002";
        $request->requestMessage->Track2 = ";341111597241002=22122011317125989?";
        $request->requestMessage->EntryPINMode = "S";
        $request->requestMessage->TerminalCapabilities = "manual|stripe|icc|signature|rfid";
        $request->requestMessage->CustomerAccountCode = "12345678910111213";
        $request->requestMessage->ShippingOriginZip = "681140000";
        $request->requestMessage->EntryMode = "SX";
        $request->requestMessage->EntryMedium = "MC";
        $request->requestMessage->PartialAuthorization = "false";
        
        $conn = new BridgeCommConnection();
        $response = $conn->processRequest("https://www.bridgepaynetsecuretest.com/paymentservice/requesthandler.svc", $request);
        
        print_r($response);


        ///////////////////////////Serialize//////////////////////////////////////////////////
//        $serializar = new BridgeCommRequest();
//        $serializar->ClientIdentifier = "SOAP";
//        $serializar->RequestType = "004";
//        $serializar->TransactionID = "X3NX41LJ";
//        $serializar->requestMessage = new RequestMessage();
//        $serializar->requestMessage->MerchantCode = "297000";
//        $serializar->requestMessage->MerchantAccountCode = "297022";
//        $serializar->requestMessage->TransIndustryType = "RS";
//        $custom = new CustomFields();
//        $custom->Age = "15";
//        $custom->Name = "Bob";
//        $serializar->requestMessage->CustomFields = $custom;
//        $item1 = new Item();
//        $item1->ItemCode = "code1";
//        $item1->ItemCommodityCode = "comm1";
//        $item2 = new Item();
//        $item2->ItemCode = "code2";
//        $item2->ItemCommodityCode = "comm2";
//        $serializar->requestMessage->Item[] = $item1;
//        $serializar->requestMessage->Item[] = $item2;
//        
//        $coco = BridgeCommConnection::Serialize($serializar);
//        echo $coco;
        
        ///////////////////////////Deserialize//////////////////////////////////////////////////
//        $stringXML = "<requestHeader>
//  <ClientIdentifier>SOAP</ClientIdentifier>
//  <RequestType>004</RequestType>
//  <TransactionID>X3NX41LJ</TransactionID>
//  <requestMessage>
//    <CurrencyCode>USD</CurrencyCode>
//    <MerchantCode>297000</MerchantCode>
//    <MerchantAccountCode>297022</MerchantAccountCode>
//    <TransIndustryType>RS</TransIndustryType>
//	<Item>
//		<ItemCode>code1</ItemCode>
//		<ItemCommodityCode>comm1</ItemCommodityCode>
//	</Item>
//	<Item>
//		<ItemCode>code2</ItemCode>
//		<ItemCommodityCode>comm2</ItemCommodityCode>
//	</Item>
//        <CustomFields>
//            <Age>15</Age>
//            <Name>Bob</Name>
//          </CustomFields>
//  </requestMessage>
//</requestHeader>";
//        $coco2 = BridgeCommConnection::DeserializeStringXMLToObject($stringXML, "BridgeCommRequest");
//        print_r($coco2);
        
        ?>
    </body>
</html>

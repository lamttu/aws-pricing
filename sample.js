/*
 * Copyright 2013. Amazon Web Services, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// Load the SDK and UUID
var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" }); //Pricing only offers in us-east-1 or ap-south-1 I'm just picking one of them
var pricing = new AWS.Pricing(); // Create a pricing client

// These are the parameters that will be used to request the pricing
var params = {
  FormatVersion: "aws_v1",
  MaxResults: 1,
  ServiceCode: "AmazonEC2",
  Filters: [
    // Example filter only, we need to work on this to figure out what field we need to request the result we want
    {
      Field: "ServiceCode",
      Type: "TERM_MATCH",
      Value: "AmazonEC2"
    },
    {
      Field: "instanceType",
      Type: "TERM_MATCH",
      Value: "r5d.8xlarge"
    },
    {
      Field: "location",
      Type: "TERM_MATCH",
      Value: "Asia Pacific (Sydney)"
    }
  ]
};

pricing.getProducts(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else {
    console.log("got the price");
    var priceList = data["PriceList"][0]["terms"]["OnDemand"];
    var result = JSON.stringify(priceList); // I'm only showing part of the result but you can stringify data and console.log to see the whole thing
    console.log(result); // successful response
  }
});

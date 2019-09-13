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
const axios = require("axios");
const HOURS_PER_MONTH = 730;

async function getExchangeRate() {
  try {
    const response = await axios.get(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=AUD"
    );
    const exchangeRate = response.data["rates"]["AUD"];
    console.log(exchangeRate);
    return exchangeRate;
  } catch (error) {
    console.log("Something has gone wrong while retrieving exchange rate");
  }
}

async function getPricingForComputeEngineAzure(exchangeRate) {
  try {
    const response = await axios.get(
      "https://azure.microsoft.com/api/v3/pricing/virtual-machines/calculator/?culture=en-us&discount=mosp&v=20190910-1131-88025"
    );
    const smallWindows = response.data["offers"]["windows-d4v3-standard"];
    const smallWindowsMonthly =
      smallWindows["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const mediumWindows = response.data["offers"]["windows-d16v3-standard"];
    const mediumWindowsMonthly =
      mediumWindows["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const largeWindows = response.data["offers"]["windows-d48v3-standard"];
    const largeWindowsMonthly =
      largeWindows["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const smallLinux = response.data["offers"]["linux-d4v3-standard"];
    const smallLinuxMonthly =
      smallLinux["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const mediumLinux = response.data["offers"]["linux-d16v3-standard"];
    const mediumLinuxMonthly =
      mediumLinux["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const largeLinux = response.data["offers"]["linux-d48v3-standard"];
    const largeLinuxMonthly =
      largeLinux["prices"]["perhour"]["australia-southeast"]["value"] *
      exchangeRate *
      HOURS_PER_MONTH;
    const computeEnginePrices = {
      windows: {
        small: smallWindowsMonthly,
        medium: mediumWindowsMonthly,
        large: largeWindowsMonthly
      },
      linux: {
        small: smallLinuxMonthly,
        medium: mediumLinuxMonthly,
        large: largeLinuxMonthly
      }
    };
    return computeEnginePrices;
  } catch (error) {
    console.log(
      "Something has gone wrong while retrieving compute engine pricing for Azure"
    );
  }
}

async function getPricingForStorageAzure(exchangeRate) {
  try {
    const response = await axios.get(
      "https://azure.microsoft.com/api/v2/pricing/managed-disks/calculator/?culture=en-us&discount=mosp&v=20190910-1131-88025"
    );
    const operationPrices =
      response.data["offers"]["transactions-ssd"]["prices"][
        "australia-southeast"
      ]["value"] * exchangeRate;
    const smallDiskPrice =
      response.data["offers"]["standardssd-e15"]["prices"][
        "australia-southeast"
      ]["value"] * exchangeRate;
    const mediumDiskPrice =
      response.data["offers"]["standardssd-e20"]["prices"][
        "australia-southeast"
      ]["value"] * exchangeRate;
    const largeDiskPrice =
      response.data["offers"]["standardssd-e30"]["prices"][
        "australia-southeast"
      ]["value"] * exchangeRate;
    const storagePrice = {
      operationPrices: operationPrices,
      smallDiskPrice: smallDiskPrice,
      mediumDiskPrice: mediumDiskPrice,
      largeDiskPrice: largeDiskPrice
    };
    return storagePrice;
  } catch (error) {
    console.log(
      "Something has gone wrong while retrieving storage pricing for Azure" +
        error
    );
  }
}

async function getAzureData() {
  const exchangeRate = await getExchangeRate();
  const computeEnginePrices = await getPricingForComputeEngineAzure(
    exchangeRate
  );
  const storagePrices = await getPricingForStorageAzure(exchangeRate);
  const azureData = {};
  azureData["computeEngine"] = computeEnginePrices;
  azureData["storage"] = storagePrices;
  return azureData;
}

var azureData = {};
getAzureData().then(response => {
  azureData = response;
  console.log(azureData);
});

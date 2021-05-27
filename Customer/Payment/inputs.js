class C2bDataSamples {
    constructor(amount, custIsdn, refTransaction, thirdPartyId, description) {
        this.amount = amount
        this.custIsdn = custIsdn
        this.refTransaction = refTransaction
        this.thirdPartyId = thirdPartyId
        this.description = description
    }
    //'1e9b674j1dug8af09402a896cbc98f5p'
    c2bDataSample() {
        /* {
                        input_Amount: 15000,
                        input_CustomerMSISDN: '000000000001',
                        input_Country: 'TZN',
                        input_Currency: 'TZS',
                        input_ServiceProviderCode: '000000',
                        input_TransactionReference: 'M19768Z',
                        input_ThirdPartyConversationID: '1e9b674j1dug8af09402a896cbc98f5p',
                        input_PurchasedItemsDesc: 'Lod ananinusumbua',
                    }*/
        return {
            input_Amount: this.amount,
            input_CustomerMSISDN: this.custIsdn,
            input_Country: 'TZN',
            input_Currency: 'TZS',
            input_ServiceProviderCode: '000000',
            input_TransactionReference: this.refTransaction,
            input_ThirdPartyConversationID: this.thirdPartyId,
            input_PurchasedItemsDesc: this.description
        }
    }
}

class QueryTransaction {
    constructor(queryRef, thirdPartyConversionId) {
        this.queryRef = queryRef
        this.thirdPartyConversionId = thirdPartyConversionId
    }

    /*  {
                        input_QueryReference: '000000000001',
                        input_ServiceProviderCode: '000000',
                        input_ThirdPartyConversationID: "1e9b674j1dug8af09402a896cbc98f5p",
                        input_Country: "TZN",
                    }*/
    queryStatusDataSample() {
        return {
            input_QueryReference: this.queryRef,
            input_ServiceProviderCode: '000001',
            input_ThirdPartyConversationID: this.thirdPartyConversionId,
            input_Country: 'TZN'
        }
    }
}
module.exports = {
    c2bSample: C2bDataSamples,
    queryTranSample: QueryTransaction
}
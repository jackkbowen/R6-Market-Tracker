import axios from 'axios';

const url = 'https://public-ubiservices.ubi.com/v1/profiles/me/uplay/graphql';
const headers = {
    'content-type': 'application/json'
};
const payload = {
    "operationName":"GetItemDetails",
    "variables": {
        "spaceId":"0d2ae42d-4c27-4cb7-af6c-2099062302bb",
        "itemId": "7636a2cf-b53e-45d5-90e5-441c42442d90",
        "tradeId":"",
    },
    query: "query GetItemDetails($spaceId: String!, $itemId: String!, $tradeId: String!, $fetchTrade: Boolean!) {\n  game(spaceId: $spaceId) {\n    id\n    marketableItem(itemId: $itemId) {\n      id\n      item {\n        ...SecondaryStoreItemFragment\n        ...SecondaryStoreItemOwnershipFragment\n        __typename\n      }\n      marketData {\n        ...MarketDataFragment\n        __typename\n      }\n      paymentLimitations {\n        id\n        paymentItemId\n        minPrice\n        maxPrice\n        __typename\n      }\n      __typename\n    }\n    viewer {\n      meta {\n        id\n        trades(filterBy: {states: [Created], itemIds: [$itemId]}) {\n          nodes {\n            ...TradeFragment\n            __typename\n          }\n          __typename\n        }\n        trade(tradeId: $tradeId) @include(if: $fetchTrade) {\n          ...TradeFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SecondaryStoreItemFragment on SecondaryStoreItem {\n  id\n  assetUrl\n  itemId\n  name\n  tags\n  type\n  viewer {\n    meta {\n      id\n      isReserved\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemOwnershipFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      isOwned\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MarketDataFragment on MarketableItemMarketData {\n  id\n  sellStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  buyStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  lastSoldAt {\n    id\n    paymentItemId\n    price\n    performedAt\n    __typename\n  }\n  __typename\n}\n\nfragment TradeFragment on Trade {\n  id\n  tradeId\n  state\n  category\n  createdAt\n  expiresAt\n  lastModifiedAt\n  failures\n  tradeItems {\n    id\n    item {\n      ...SecondaryStoreItemFragment\n      ...SecondaryStoreItemOwnershipFragment\n      __typename\n    }\n    __typename\n  }\n  payment {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentOptions {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentProposal {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    __typename\n  }\n  viewer {\n    meta {\n      id\n      tradesLimitations {\n        ...TradesLimitationsFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemQuantityFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TradesLimitationsFragment on UserGameTradesLimitations {\n  id\n  buy {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    __typename\n  }\n  sell {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    resaleLocks {\n      itemId\n      expiresAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
};

axios.post(url, payload, { headers })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });

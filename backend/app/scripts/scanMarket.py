from __future__ import annotations

from datetime import datetime, timezone

import time
import aiohttp
import base64
import time
import json
import contextlib
import os
import asyncio
from os.path import exists

class FailedToConnect(Exception):
    pass
class InvalidRequest(Exception):
    def __init__(self, *args, code=0, **kwargs):
        super().__init__(*args, **kwargs)
        self.code = code
class InvalidAttributeCombination(Exception):
    pass


class Auth:
    """ Holds the authentication information """

    @staticmethod
    def get_basic_token(email: str, password: str) -> str:
        token = base64.b64encode(f"{email}:{password}".encode("utf-8")).decode("utf-8")
        print(f'[ - Generated token: {token} ]')
        return token

    def __init__(
            self,
            email: str = None,
            password: str = None,
            token: str = None,
            appid: str = None,
            creds_path: str = None,
            cachetime: int = 120,
            max_connect_retries: int = 1,
            session: aiohttp.ClientSession = None,
            refresh_session_period: int = 180,
            item_id: str = "",
    ):
        print("[ - Generating session data... ]")
        self.session: aiohttp.ClientSession = session or aiohttp.ClientSession()
        self.max_connect_retries: int = max_connect_retries
        self.refresh_session_period: int = refresh_session_period

        print("[ - Generating token data... ]")
        self.token: str = token or Auth.get_basic_token(email, password)
        self.creds_path: str = creds_path or f"{os.getcwd()}/creds/{self.token}.json"
        self.appid: str = appid or 'e3d5ea9e-50bd-43b7-88bf-39794f4e3d40'
        self.sessionid: str = ""
        self.key: str = ""
        self.new_key: str = ""
        self.spaceid: str = ""
        self.spaceids: dict[str: str] = {
            "uplay": "0d2ae42d-4c27-4cb7-af6c-2099062302bb",
            "psn": "0d2ae42d-4c27-4cb7-af6c-2099062302bb",
            "xbl": "0d2ae42d-4c27-4cb7-af6c-2099062302bb"
        }
        self.profileid: str = ""
        self.userid: str = ""
        self.expiration: str = ""
        self.new_expiration: str = ""

        print("[ - Generating cache data... ]")
        self.cachetime: int = cachetime
        self.cache = {}

        print("[ - Generating time data... ]")
        self._login_cooldown: int = 0
        self._session_start: float = time.time()

    async def _ensure_session_valid(self) -> None:
        if not self.session:
            await self.refresh_session()
        elif 0 <= self.refresh_session_period <= (time.time() - self._session_start):
            await self.refresh_session()

    async def refresh_session(self) -> None:
        """ Closes the current session and opens a new one """
        if self.session:
            try:
                await self.session.close()
            except:
                pass

        self.session = aiohttp.ClientSession()
        self._session_start = time.time()

    async def get_session(self) -> aiohttp.ClientSession:
        """ Retrieves the current session, ensuring it's valid first """
        await self._ensure_session_valid()
        return self.session

    def save_creds(self) -> None:
        """ Saves the credentials to a file """

        if not os.path.exists(os.path.dirname(self.creds_path)):
            os.makedirs(os.path.dirname(self.creds_path))

        if not os.path.exists(self.creds_path):
            with open(self.creds_path, 'w') as f:
                json.dump({}, f)

        # write to file, overwriting the old one
        with open(self.creds_path, 'w') as f:
            json.dump({
                "sessionid": self.sessionid,
                "key": self.key,
                "new_key": self.new_key,
                "spaceid": self.spaceid,
                "profileid": self.profileid,
                "userid": self.userid,
                "expiration": self.expiration,
                "new_expiration": self.new_expiration,
            }, f, indent=4)

    def load_creds(self) -> None:
        """ Loads the credentials from a file """

        if not os.path.exists(self.creds_path):
            return

        with open(self.creds_path, "r") as f:
            data = json.load(f)

        self.sessionid = data.get("sessionid", "")
        self.key = data.get("key", "")
        self.new_key = data.get("new_key", "")
        self.spaceid = data.get("spaceid", "")
        self.profileid = data.get("profileid", "")
        self.userid = data.get("userid", "")
        self.expiration = data.get("expiration", "")
        self.new_expiration = data.get("new_expiration", "")

        self._login_cooldown = 0

    async def connect(self, _new: bool = False) -> None:
        """ Connect to Ubisoft, automatically called when needed """
        self.load_creds()

        if self._login_cooldown > time.time():
            raise FailedToConnect("Login on cooldown")

        # If keys are still valid, don't connect again
        if _new:
            if self.new_key and datetime.fromisoformat(self.new_expiration[:26]+"+00:00") > datetime.now(timezone.utc):
                return
        else:
            if self.key and datetime.fromisoformat(self.expiration[:26]+"+00:00") > datetime.now(timezone.utc):
                print("[ Outdated key detected, re-authenticating... ]")
                
                await self.connect(_new=True)
                return

        session = await self.get_session()
        headers = {
            "User-Agent": "UbiServices_SDK_2020.Release.58_PC64_ansi_static",
            "Content-Type": "application/json; charset=UTF-8",
            "Ubi-AppId": self.appid,
            "Authorization": "Basic " + self.token
        }

        if _new:
            headers["Ubi-AppId"] = self.appid
            headers["Authorization"] = "Ubi_v1 t=" + self.key

        resp = await session.post(
            url="https://public-ubiservices.ubi.com/v3/profiles/sessions",
            headers=headers,
            data=json.dumps({"rememberMe": True})
        )

        data = await resp.json()

        if "ticket" in data:
            if _new:
                self.new_key = data.get('ticket')
                self.new_expiration = data.get('expiration')
            else:
                self.key = data.get("ticket")
                self.expiration = data.get("expiration")
            self.profileid = data.get('profileId')
            self.sessionid = data.get("sessionId")
            self.spaceid = data.get("spaceId")
            self.userid = data.get("userId")
            print("[ Logged in successfully ]")
        else:
            message = "Unknown Error"
            if "message" in data and "httpCode" in data:
                message = f"HTTP {data['httpCode']}: {data['message']}"
            elif "message" in data:
                message = data["message"]
            elif "httpCode" in data:
                message = str(data["httpCode"])
            print(f"[ Error: \"{message}\" ]")
            raise FailedToConnect(message)

        self.save_creds()
        await self.connect(_new=True)

    async def close(self) -> None:
        """ Closes the session associated with the auth object """
        self.save_creds()
        await self.session.close()

    async def get(self, *args, retries: int = 0, json_: bool = True, new: bool = False, **kwargs) -> dict | str:
        if (not self.key and not new) or (not self.new_key and new):
            last_error = None
            for _ in range(self.max_connect_retries):
                try:
                    await self.connect()
                    break
                except FailedToConnect as e:
                    last_error = e

                    print(f"[ Failed to connect for reason \"{e}\" ]")
            else:
                # assume this error is going uncaught, so we close the session
                await self.close()

                if last_error:
                    raise last_error
                else:
                    raise FailedToConnect("Unknown Error")

        if "headers" not in kwargs:
            kwargs["headers"] = {}

        authorization = kwargs["headers"].get("Authorization") or "Ubi_v1 t=" + (self.new_key if new else self.key)
        appid = kwargs["headers"].get("Ubi-AppId") or self.appid

        kwargs["headers"]["Authorization"] = authorization
        kwargs["headers"]["Ubi-AppId"] = appid
        kwargs["headers"]["Ubi-LocaleCode"] = kwargs["headers"].get("Ubi-LocaleCode") or "en-US"
        kwargs["headers"]["Ubi-SessionId"] = kwargs["headers"].get("Ubi-SessionId") or self.sessionid
        kwargs["headers"]["User-Agent"] = kwargs["headers"].get("User-Agent") or "UbiServices_SDK_2020.Release.58_PC64_ansi_static"
        kwargs["headers"]["Connection"] = kwargs["headers"].get("Connection") or "keep-alive"
        kwargs["headers"]["expiration"] = kwargs["headers"].get("expiration") or self.expiration

        session = await self.get_session()
        resp = await session.get(*args, **kwargs)

        if json_:
            try:
                data = await resp.json()
            except Exception:
                text = await resp.text()
                message = text.split("h1>")
                message = message[1][:-2] if len(message) > 1 else text
                raise InvalidRequest(f"Received a text response, expected JSON response. Message: {message}")

            if "httpCode" in data:
                if data["httpCode"] == 401:
                    if retries >= self.max_connect_retries:
                        # wait 30 seconds before sending another request
                        self._login_cooldown = time.time() + 30

                    # key no longer works, so remove key and let the following .get() call refresh it
                    self.key = None
                    return await self.get(*args, retries=retries + 1, **kwargs)
                else:
                    msg = data.get("message", "")
                    if data["httpCode"] == 404:
                        msg = f"Missing resource {data.get('resource', args[0])}"
                    raise InvalidRequest(f"HTTP {data['httpCode']}: {msg}", code=data["httpCode"])

            return data
        else:
            return await resp.text()
    async def get_db(self, *args, retries: int = 0, json_: bool = True, new: bool = False, **kwargs) -> dict | str:
        if (not self.key and not new) or (not self.new_key and new):
            last_error = None
            for _ in range(self.max_connect_retries):
                try:
                    await self.connect()
                    break
                except FailedToConnect as e:
                    last_error = e
            else:
                # assume this error is going uncaught, so we close the session
                await self.close()

                if last_error:
                    raise last_error
                else:
                    raise FailedToConnect("Unknown Error")

        if "headers" not in kwargs:
            kwargs["headers"] = {}

        authorization = kwargs["headers"].get("Authorization") or "Ubi_v1 t=" + (self.new_key if new else self.key)
        appid = kwargs["headers"].get("Ubi-AppId") or self.appid


        kwargs["headers"]["content-type"] = "application/json"
        kwargs["headers"]["Authorization"] = authorization
        kwargs["headers"]["Ubi-AppId"] = appid
        kwargs["headers"]["Ubi-LocaleCode"] = kwargs["headers"].get("Ubi-LocaleCode") or "en-US"
        kwargs["headers"]["Ubi-SessionId"] = kwargs["headers"].get("Ubi-SessionId") or self.sessionid
        kwargs["headers"]["User-Agent"] = kwargs["headers"].get("User-Agent") or "UbiServices_SDK_2020.Release.58_PC64_ansi_static"
        kwargs["headers"]["Connection"] = kwargs["headers"].get("Connection") or "keep-alive"
        kwargs["headers"]["expiration"] = kwargs["headers"].get("expiration") or self.expiration

        """
        Query to get the users sellable items

        query = {
            "operationName":"GetSellableItems",
            "variables": {
                "withOwnership": false,
                "spaceId":"0d2ae42d-4c27-4cb7-af6c-2099062302bb",
                limit: 40,
                offset: 0,
                "filterBy": {
                    types: [],
                    tags: []},
                "sortBy": {
                    field: "ACTIVE_COUNT",
                    direction: "DESC",
                    orderType: "Buy",
                    paymentItemId: "9ef71262-515b-46e8-b9a8-b6b6ad456c67"}
            },
            "query":"query GetSellableItems($spaceId: String!, $limit: Int!, $offset: Int, $filterBy: MarketableItemFilter, $withOwnership: Boolean = false, $sortBy: MarketableItemSort) {\n  game(spaceId: $spaceId) {\n    id\n    viewer {\n      meta {\n        id\n        marketableItems(\n          limit: $limit\n          offset: $offset\n          filterBy: $filterBy\n          sortBy: $sortBy\n          withMarketData: true\n        ) {\n          nodes {\n            ...MarketableItemFragment\n            __typename\n          }\n          totalCount\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment MarketableItemFragment on MarketableItem {\n  item {\n    ...SecondaryStoreItemFragment\n    ...SecondaryStoreItemOwnershipFragment @include(if: $withOwnership)\n    __typename\n  }\n  marketData {\n    ...MarketDataFragment\n    __typename\n  }\n  viewer {\n    meta {\n      id\n      activeTrade {\n        ...TradeFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemFragment on SecondaryStoreItem {\n  id\n  assetUrl\n  itemId\n  name\n  tags\n  type\n  __typename\n}\n\nfragment SecondaryStoreItemOwnershipFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      isOwned\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MarketDataFragment on MarketableItemMarketData {\n  id\n  sellStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  buyStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  lastSoldAt {\n    id\n    paymentItemId\n    price\n    performedAt\n    __typename\n  }\n  __typename\n}\n\nfragment TradeFragment on Trade {\n  id\n  tradeId\n  state\n  category\n  createdAt\n  expiresAt\n  lastModifiedAt\n  failures\n  tradeItems {\n    id\n    item {\n      ...SecondaryStoreItemFragment\n      ...SecondaryStoreItemOwnershipFragment\n      __typename\n    }\n    __typename\n  }\n  payment {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentOptions {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentProposal {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    __typename\n  }\n  viewer {\n    meta {\n      id\n      tradesLimitations {\n        ...TradesLimitationsFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemQuantityFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TradesLimitationsFragment on UserGameTradesLimitations {\n  id\n  buy {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    __typename\n  }\n  sell {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    resaleLocks {\n      itemId\n      expiresAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"}]
        }
        """


        query = {
            "operationName":"GetItemDetails",
            "variables": {
                "spaceId":"0d2ae42d-4c27-4cb7-af6c-2099062302bb",
                "itemId": self.item_id,
                "tradeId":"",
                "fetchTrade":False
            },
            "query":"query GetItemDetails($spaceId: String!, $itemId: String!, $tradeId: String!, $fetchTrade: Boolean!) {\n  game(spaceId: $spaceId) {\n    id\n    marketableItem(itemId: $itemId) {\n      id\n      item {\n        ...SecondaryStoreItemFragment\n        ...SecondaryStoreItemOwnershipFragment\n        __typename\n      }\n      marketData {\n        ...MarketDataFragment\n        __typename\n      }\n      paymentLimitations {\n        id\n        paymentItemId\n        minPrice\n        maxPrice\n        __typename\n      }\n      __typename\n    }\n    viewer {\n      meta {\n        id\n        trades(filterBy: {states: [Created], itemIds: [$itemId]}) {\n          nodes {\n            ...TradeFragment\n            __typename\n          }\n          __typename\n        }\n        trade(tradeId: $tradeId) @include(if: $fetchTrade) {\n          ...TradeFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SecondaryStoreItemFragment on SecondaryStoreItem {\n  id\n  assetUrl\n  itemId\n  name\n  tags\n  type\n  viewer {\n    meta {\n      id\n      isReserved\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemOwnershipFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      isOwned\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MarketDataFragment on MarketableItemMarketData {\n  id\n  sellStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  buyStats {\n    id\n    paymentItemId\n    lowestPrice\n    highestPrice\n    activeCount\n    __typename\n  }\n  lastSoldAt {\n    id\n    paymentItemId\n    price\n    performedAt\n    __typename\n  }\n  __typename\n}\n\nfragment TradeFragment on Trade {\n  id\n  tradeId\n  state\n  category\n  createdAt\n  expiresAt\n  lastModifiedAt\n  failures\n  tradeItems {\n    id\n    item {\n      ...SecondaryStoreItemFragment\n      ...SecondaryStoreItemOwnershipFragment\n      __typename\n    }\n    __typename\n  }\n  payment {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentOptions {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    transactionFee\n    __typename\n  }\n  paymentProposal {\n    id\n    item {\n      ...SecondaryStoreItemQuantityFragment\n      __typename\n    }\n    price\n    __typename\n  }\n  viewer {\n    meta {\n      id\n      tradesLimitations {\n        ...TradesLimitationsFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SecondaryStoreItemQuantityFragment on SecondaryStoreItem {\n  viewer {\n    meta {\n      id\n      quantity\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TradesLimitationsFragment on UserGameTradesLimitations {\n  id\n  buy {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    __typename\n  }\n  sell {\n    resolvedTransactionCount\n    resolvedTransactionPeriodInMinutes\n    activeTransactionCount\n    resaleLocks {\n      itemId\n      expiresAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
        }
        kwargs["data"] = json.dumps(query)

        session = await self.get_session()
        resp = await session.post(*args, **kwargs)

        if json_:
            try:
                data = await resp.json()
            except Exception:
                text = await resp.text()
                message = text.split("h1>")
                message = message[1][:-2] if len(message) > 1 else text
                print(f"[ Error: \"{message}\" ]")
                raise InvalidRequest(f"Received a text response, expected JSON response. Message: {message}")

            if "httpCode" in data:
                if data["httpCode"] == 401:
                    if retries >= self.max_connect_retries:
                        # wait 30 seconds before sending another request
                        self._login_cooldown = time.time() + 30

                    # key no longer works, so remove key and let the following .get() call refresh it
                    self.key = None

                    print("[ Broken Key! ]")

                    return await self.get(*args, retries=retries + 1, **kwargs)
                else:
                    msg = data.get("message", "")
                    if data["httpCode"] == 404:
                        msg = f"Missing resource {data.get('resource', args[0])}"

                    print(f"[ Error: \"{msg}\" ]")
                    raise InvalidRequest(f"HTTP {data['httpCode']}: {msg}", code=data["httpCode"])

            return data
        else:
            return await resp.text()
    
    async def try_query_db(self):
        await asyncio.sleep(.25)

        res = await self.get_db(f"https://public-ubiservices.ubi.com/v1/profiles/me/uplay/graphql")

        failed = False
        try:
            res["errors"]
            failed = True
            print("Rate Limited!")
        except:
            pass
        if (failed):
            return -1
        
        name = None
        tags = None
        item_type = None

        lowest_buyer = None
        highest_buyer = None
        volume_buyers = None

        lowest_seller = None
        highest_seller = None
        volume_sellers = None

        last_sold = None
        
        asset_url = None
        try:
            name = res["data"]["game"]["marketableItem"]["item"]["name"]
        except:
            print(f'ERR')    
        try:
            tags = res["data"]["game"]["marketableItem"]["item"]["tags"]
        except:
            print(f'ERR')    
        try:
            item_type = res["data"]["game"]["marketableItem"]["item"]["type"]
        except:
            print(f'ERR')    

        try:
            lowest_buyer = res["data"]["game"]["marketableItem"]["marketData"]["buyStats"][0]["lowestPrice"]
        except:
            print(f'ERR')    
        try:
            highest_buyer = res["data"]["game"]["marketableItem"]["marketData"]["buyStats"][0]["highestPrice"]
        except:
            print(f'ERR')   
        try: 
            volume_buyers = res["data"]["game"]["marketableItem"]["marketData"]["buyStats"][0]["activeCount"]
        except:
            print(f'ERR')    

        try:
            lowest_seller = res["data"]["game"]["marketableItem"]["marketData"]["sellStats"][0]["lowestPrice"]
        except:
            print(f'ERR')    
        try:
            highest_seller = res["data"]["game"]["marketableItem"]["marketData"]["sellStats"][0]["highestPrice"]
        except:
            print(f'ERR')    
        try:
            volume_sellers = res["data"]["game"]["marketableItem"]["marketData"]["sellStats"][0]["activeCount"]
        except:
            print(f'ERR')    
        
        try:
            last_sold = res["data"]["game"]["marketableItem"]["marketData"]["lastSoldAt"][0]["price"]
        except:
            print(f'ERR')    

        try:
            asset_url = res["data"]["game"]["marketableItem"]["item"]["assetUrl"]
        except:
            print(f'ERR')    
        
        return [
            name,
            item_type,
            tags,

            lowest_buyer,
            highest_buyer,
            volume_buyers,

            lowest_seller,
            highest_seller,
            volume_sellers,

            last_sold,

            asset_url
        ]

async def scan_market():
    with contextlib.suppress(Exception):
        print("[ Opening Session ]")

        auth = Auth(os.environ["AUTH_EMAIL"], os.environ["AUTH_PW"])
        counter = 0  # Initialize a counter
        
        print("[ Scanning market... ]")
        for key, item_id in item_ids.items():
            if counter >= 118:  # Check if 119 items have been scanned
                break

            print(f'[ - [ Scanning {key} ] ]')

            auth.item_id = item_id
            res = await auth.try_query_db()
            if (not res):
                print("Rate Limited!")
                continue
            # Meta: NAME | TYPE | TAGS - Buyers: LOW | HIGH | VOL - Sellers: LOW | HIGH | VOL
            try:
                data[item_id]
            except:
                data[item_id] = {
                    "name": res[0],
                    "type": res[1],
                    "tags": res[2],
                    "asset_url": res[10],
                    "sold": [],
                    "data": None
                }
            if data[item_id]["data"] == None or data[item_id]["data"] != [res[3], res[4], res[5], res[6], res[7], res[8]]:
                data[item_id]["data"] = [res[3], res[4], res[5], res[6], res[7], res[8]]
                print('[ - - NEW PRIMARY DATA ]')
            
            if len(data[item_id]["sold"]) == 0 or data[item_id]["sold"][len(data[item_id]["sold"]) - 1][0] != res[9]:
                data[item_id]["sold"] = data[item_id]["sold"] + [[res[9], time.time()]]
                print('[ - - NEW LAST SOLD ]')
            
            counter += 1  # Increment the counter
            
            print(f'[ ~ [ Done checking {key} ] ]')
            
        
        print("[ Closing Session ]")
        await auth.close()

        print("[ WRITING TO 'data.json' ]")

        data_file = open("../backend/app/scripts/assets/data.json", "w")
        data_file.write(json.dumps(data, indent=2))
        data_file.close()

        print("[ FINISHED WRITING TO 'data.json' ]")
        prevTime = time.ctime(time.time())
        print("[ TIME FINISHED: ", prevTime, "]")

       

if ( not exists("../backend/app/scripts/assets/data.json") ):
    with open('../backend/app/scripts/assets/data.json', 'w') as f:
        f.write("{}")

if ( not exists("../backend/app/scripts/assets/idList_1.json") ):
    with open('../backend/app/scripts/assets/idList_1.json', 'w') as f:
        f.write('{"black ice r4-c": "aee4bdf2-0b54-4c6d-af93-9fe4848e1f76"}')

data_file = open("../backend/app/scripts/assets/data.json", "r")
data = json.loads(data_file.read())
data_file.close()

item_id_file = open("../backend/app/scripts/assets/idList_1.json", "r")
item_ids = json.loads(item_id_file.read())
item_id_file.close()

if __name__ == "__main__":
    asyncio.run(scan_market())


# IF RUNNING FROM SCRIPTS FOLDER, MUST RESET ENV VARIABLES
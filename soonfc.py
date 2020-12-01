from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.ATR import ATR
from smartcard.CardType import AnyCardType

from time import sleep
import sys , requests , json , socket ,psutil
import getmac

def postUrl(self):
    hostname = socket.gethostname()
    mac = psutil.net_if_addrs()
    mac = getmac.get_mac_address()
    
    params = {"uid": uid , "mac": mac, "hostname": hostname }
    hed = {'Content-Type': 'application/json'}
    res = requests.request('post', 'http://sooyeonjae.com/users/postest', headers=hed, data=json.dumps(params))
    print(res.text)
    resjson = json.loads(res.text)
    print(resjson["success"]) # 등록된 사용자인지 검증
    
    
r = readers()

if len(r) < 1:
	print ("error: No readers available!")
	sys.exit()
else :
    reader = r[0]
    print ("Using: ", reader)

connection = reader.createConnection()

while True:
    try:
        connection.connect()
    except:
        print("No Card")
        sleep(2)
        continue #여기다가 화면잠금 함수추가

    cmdMap = {
	    "getuid":[0xFF, 0xCA, 0x00, 0x00, 0x00]
    }

    data, sw1, sw2 = connection.transmit( cmdMap['getuid'] )
    uid = toHexString(data)
    print ("UID : " + uid)
    print ("Status words: %02X %02X" % (sw1, sw2))
    if (sw1, sw2) == (0x90, 0x0):
        print ("Status: The operation completed successfully.")
    elif (sw1, sw2) == (0x63, 0x0):
        print ("Status: The operation failed.")

    postUrl(uid)
    sleep(5) # 카드접촉 및 등록사용자 검증 주기

from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.ATR import ATR
from smartcard.CardType import AnyCardType

from time import sleep
import sys , requests , json , socket ,psutil , os
import getmac

def postUrl(uid , url, username):
    #def postUrl(uid , url, username, mac, hostname):
    #테스트 환경에서 편리성을 위해 현재pc 데이터 자동으로 받아오는것임
    hostname = socket.gethostname()
    mac = psutil.net_if_addrs()
    mac = getmac.get_mac_address()
    #여기까지
    
    params = {"uid": uid , "mac": mac, "hostname": hostname , "username": username}
    hed = {'Content-Type': 'application/json'}
    res = requests.request('post', 'http://sooyeonjae.com/users/'+url, headers=hed, data=json.dumps(params))
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


try:
    connection.connect()
except:
    print("No Card")
    sleep(2)


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

print("1.등록")
print("2.삭제")
select = input("기능 선택 : ")
if select == "1" :
    username = input("사용자 이름 입력 : ")
#    hostname = input("사용자 Hostname 입력 : ")
#    mac = input("사용자 MAC Address 입력 : ")
    
    url = "uidadd"
    postUrl(uid,url,username)
#    postUrl(uid,url,username,mac,hostname) 
elif select == "2" :
    url = "uidrm"
    postUrl(uid,url,username="")

os.system("pause")

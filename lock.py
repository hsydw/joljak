import tkinter as tk
from tkinter import *
import string
from PIL import Image
import pyautogui

from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.ATR import ATR
from smartcard.CardType import AnyCardType

from time import sleep
import sys , requests , json , socket , psutil
import getmac

from threading import Thread

#User Data
hostname = socket.gethostname()
mac = psutil.net_if_addrs()
mac = getmac.get_mac_address()

#global variable
window = tk.Tk()
window.title("LOCKER")
window.wm_attributes("-topmost", 1)
key_is_pressed = False

source_image = "aabb.png"
target_image = "aabb.png"
image = Image.open(source_image)
resize_image = image.resize((pyautogui.size().width, pyautogui.size().height))
resize_image.save(target_image, "PNG", quality=95)

wall = PhotoImage(file = "aabb.png")
wall_label = Label(image = wall)
wall_label.place(x=-2, y=-2)

#define functions
def checkUid(uid):
    global window
    params = {"uid": uid , "mac": mac, "hostname": hostname }
    hed = {'Content-Type': 'application/json'}
    res = requests.request('post', 'http://sooyeonjae.com/users/postest', headers=hed, data=json.dumps(params))
    print(res.text)
    resjson = json.loads(res.text)
    if resjson["success"] is True:
        window.iconify()
        

def do_exit(event):
    global window
    global key_is_pressed
    if key_is_pressed:
        print("No")
        key_is_pressed = False


def deny_none_alnu(event):
    if event.char in string.printable:
        print(event, "denied!!!")
        key_is_pressed = True


def work():
    r = readers()

    if len(r) < 1:
            print ("error: No readers available!")
            sys.exit()
    else :
        reader = r[0]
        print ("Using: ", reader)

    connection = reader.createConnection()

    while(True):
        try:
            connection.connect()
            cmdMap = {
                "getuid":[0xFF, 0xCA, 0x00, 0x00, 0x00]
            }
            data, sw1, sw2 = connection.transmit( cmdMap['getuid'] )
            uid = toHexString(data)
            checkUid(uid)
            sleep(1)
        except:
            print("No Card")
            window.deiconify()
            sleep(1)
            continue
        

t1 = Thread(target=work)
t1.start()

window.attributes('-fullscreen', True)
window.bind('<Key>', deny_none_alnu)
window.protocol("WM_DELETE_WINDOW",do_exit)
window.mainloop()
t1.join()



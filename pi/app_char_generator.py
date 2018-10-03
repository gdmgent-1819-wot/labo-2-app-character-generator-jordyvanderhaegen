import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from sense_hat import SenseHat
from time import time, sleep
import os
import sys
import random
from math import floor, ceil

# constants
COLOR_BLUE = (0, 0, 255)
COLOR_BLACK = (0, 0, 0)

serviceAccountKey = '../../../../keys/serviceAccountKey.json'
databaseURL = 'https://wot-1819-85183.firebaseio.com'
firebase_ref_new = ''


def create_matrix(string):
    matrix = []
    print(string)
    for p in string:
        # print(p)
        bit = int(p)
        color = COLOR_BLUE if bit == 1 else COLOR_BLACK
        matrix.append(color)
    # print(matrix)
    return(matrix)
    
def main():
  firebase_ref_characters = db.reference('characters')
  while True:
      characters = firebase_ref_characters.get()
      for character in characters:
        char_obj = characters[character]
        char_string = char_obj['string']
        matrix = create_matrix(char_string)
        sense_hat = SenseHat()
        sense_hat.set_pixels(matrix)
        sleep(2);
    #   sleep(10)


try:
    # Fetch the service account key JSON file contents
    firebase_cred = credentials.Certificate(serviceAccountKey)
    # Initalize the app with a service account; granting admin privileges
    firebase_admin.initialize_app(firebase_cred, {
    'databaseURL': databaseURL
    })
    # As an admin, the app has access to read and write all data
    firebase_ref_new = db.reference('new')
    print('Firebase initialized!')
except:
    print('Unable to initialize Firebase: {}'.format(sys.exc_info()[0]))
    sys.exit(1)

try:
    # SenseHat
    sense_hat = SenseHat()
    sense_hat.set_imu_config(False, False, False)
except:
    print('Unable to initialize the Sense Hat library: {}'.format(sys.exc_info()[0]))
    sys.exit(1)

        
if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, SystemExit):
        print('Interrupt received! Stopping the application...')
    finally:
        print('Cleaning up the mess...')
        sense_hat.clear()
        sys.exit(0)
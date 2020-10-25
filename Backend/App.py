import flask
from flask import Flask, render_template, request
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import re
import sys
import os
import base64
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import requests

# init flask app
app = Flask(__name__)

# Load trained model
model = load_model("model.h5")

# Define the class names in plain text so that we can return these values
CLASS_NAMES = ['cardboard', 'glass', 'metal',
               'organtic', 'paper', 'plastic', 'trash']
RECYCLE = ('cardboard', 'glass', 'metal', 'plastic', 'paper')
TRASH = ('trash')
COMPOST = ('organtic')

def predict(img_path):
    """
    This function when given a path to an image will make a prediction regarding its class
    this prediction will be in probabilities and we will choose the highest probability
    and return its class name
    """
    # Read the image and put it into a numpy array
    img = plt.imread(img_path)

    # Resize image if necessary
    # img = cv2.resize(img, (512, 384))

    img = np.array([img])

    # Make a prediction, this will return an array with the probabilities of the prediction
    prediction = model.predict(tf.cast(img, tf.float32))[0]
    print(prediction)

    # Determine what the predicted label is by gettng the highest probability
    predicted_label = CLASS_NAMES[np.argmax(prediction)]
    return predicted_label


@app.route('/')
def home_endpoint():
    return json.dumps({"response": "Hello World!"})


@app.route('/image_upload/', methods=['PUT'])
def update():
    """
    Endpoint to make a prediction with the loaded model.
    Expects a json object with the base64 encoded value under the 
    "data" attribute
    """
    request_dict = json.loads(request.data)

    # Save image
    with open("sent_image.jpg", "wb") as fh:
        fh.write(base64.b64decode(request_dict["data"]))

    # Make a prediction with the model
    prediction = predict("sent_image.jpg")

    if(prediction in RECYCLE):
        requests.get('http://192.168.1.91:12388/recycle')
    elif(prediction in TRASH):
        requests.get('http://192.168.1.91:12388/garbage')
    elif(prediction in COMPOST):
        requests.get('http://192.168.1.91:12388/compost')

    # Return the Prediction
    return json.dumps({"predicted_class": prediction})


# Start the flask server
if (__name__ == '__main__'):
    port = int(os.environ.get('PORT', 12387))
    app.run(host='0.0.0.0', port=port)

import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

# Load trained model
model = tf.keras.models.load_model("cat_dog_model.h5")

# Path to new image you want to predict
img_path = "test.jpg"  # replace with your image path
img = image.load_img(img_path, target_size=(150, 150))

# Preprocess image
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Predict
prediction = model.predict(img_array)

if prediction[0][0] > 0.5:
    print("Dog 🐶")
else:
    print("Cat 🐱")
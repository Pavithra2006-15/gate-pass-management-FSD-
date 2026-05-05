import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# Image settings
img_size = (150, 150)
batch_size = 4

# Load dataset
train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    "Dataset/Training",
    image_size=img_size,
    batch_size=batch_size
)

class_names = train_dataset.class_names
print("Classes:", class_names)

# Normalize pixel values
normalization_layer = layers.Rescaling(1./255)
train_dataset = train_dataset.map(lambda x, y: (normalization_layer(x), y))

# Build model
model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(150,150,3)),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # binary classification
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    train_dataset,
    epochs=10
)

# Save model
model.save("cat_dog_model.h5")

print("Model trained and saved!")
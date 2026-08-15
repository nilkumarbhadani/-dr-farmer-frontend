import tensorflow as tf
from keras import layers, models

# Dataset Path
dataset_path = r"C:\Users\HARDIK\.cache\kagglehub\datasets\emmarex\plantdisease\versions\1\PlantVillage"

# 1. Load Data
batch_size = 32
img_height = 224
img_width = 224

print("Loading datasets for training...")
train_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    dataset_path,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size
)

# Store Class Names
class_names = train_ds.class_names
num_classes = len(class_names)
print(f"\nTraining on {num_classes} classes: {class_names}\n")

# Performance Optimization (Prefetching batches to prevent memory crashes)
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

# 2. Build Mobile-Optimized Model (MobileNetV2 Base)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(img_height, img_width, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False  # Freeze pre-trained weights for faster training

model = models.Sequential([
    layers.Input(shape=(img_height, img_width, 3)),
    layers.Rescaling(1./127.5, offset=-1), # Scale pixels for MobileNet
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2), # Prevents overfitting
    layers.Dense(num_classes, activation='softmax')
])

# 3. Compile Model
model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=['accuracy']
)

# 4. Train Model
epochs = 5
print("Starting Model Training...\n")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=epochs
)

# 5. Save Model File
model_filename = "dr_farmer_plant_model.h5"
model.save(model_filename)
print(f"\nTraining Complete! Model saved as '{model_filename}' in your project directory.")
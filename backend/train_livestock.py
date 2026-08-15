import tensorflow as tf
from keras.applications import MobileNetV2
from keras.layers import Dense, GlobalAveragePooling2D, RandomFlip, RandomRotation, RandomZoom
from keras.models import Sequential, Model
from keras.utils import image_dataset_from_directory
# 1. Dataset Parameters
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
DATASET_DIR = "dataset_livestock" 

# 2. Modern Data Loading (tf.data.Dataset)
train_dataset = image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'
)

val_dataset = image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'
)

# 3. Native Data Augmentation Layers
data_augmentation = Sequential([
    RandomFlip("horizontal"),
    RandomRotation(0.2),
    RandomZoom(0.2),
])

# 4. Build Model Architecture
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base layers

# Construct the pipeline
inputs = tf.keras.Input(shape=(224, 224, 3))
x = data_augmentation(inputs)
x = tf.keras.applications.mobilenet_v2.preprocess_input(x) # Auto-scales pixel values
x = base_model(x, training=False)
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)

# Dynamically get the number of disease classes from the folders
num_classes = len(train_dataset.class_names)
outputs = Dense(num_classes, activation='softmax')(x)

model = Model(inputs, outputs)

# 5. Compile & Train
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

print("Training modern livestock disease classification model...")
model.fit(train_dataset, validation_data=val_dataset, epochs=5)

# 6. Save Model
model.save("dr_farmer_livestock_model.h5")
print("Livestock model successfully trained and saved!")
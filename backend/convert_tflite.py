import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
print("Importing TF...")
import tensorflow as tf
print("Converting Plant Model...")
plant_model = tf.keras.models.load_model('dr_farmer_plant_model.h5')
converter = tf.lite.TFLiteConverter.from_keras_model(plant_model)
tflite_plant = converter.convert()
with open('dr_farmer_plant_model.tflite', 'wb') as f:
    f.write(tflite_plant)
print("Plant Model converted to TFLite!")

print("Converting Livestock Model...")
livestock_model = tf.keras.models.load_model('dr_farmer_livestock_model.h5')
converter2 = tf.lite.TFLiteConverter.from_keras_model(livestock_model)
tflite_livestock = converter2.convert()
with open('dr_farmer_livestock_model.tflite', 'wb') as f:
    f.write(tflite_livestock)
print("Livestock Model converted to TFLite!")

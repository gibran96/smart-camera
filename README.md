# SmartCamera - Real-time Object Detection Web Application

SmartCamera is a web application built using React.js and TensorFlow.js. It leverages the `coco-ssd` object detection model to detect multiple objects in real-time through your webcam. The application allows users to visualize object detection by showing bounding boxes around detected objects, along with their predicted class and confidence score.

## Features

- Real-time object detection using your webcam.
- Utilizes TensorFlow.js and the COCO-SSD model.
- Displays bounding boxes around detected objects with confidence levels.
- Easy-to-use interface with a single button to enable and disable the webcam.

## Demo
The application is deployed using Netlify. The demo can be found [here](https://smart-cam.netlify.app/).

## Model
The model used in this application is a pre-trained model from [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) provided by TensorFlow.js.

## Applications
This web application is a simple demonstration of how pretrained models can be used in a web application using TensorFlow.js. A camera that detects multiple objects can have various use cases, such as in alarm systems, security cameras, and for home automation.
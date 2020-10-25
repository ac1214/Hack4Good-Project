FROM tensorflow/tensorflow:2.3.1-gpu

# Install necessary packages
RUN pip install flask matplotlib cv2

# Copy the backend code
COPY ./App.py /deploy/

# Copy the model
COPY ./model.h5 /deploy/

WORKDIR /deploy/

# Expose the necessary port
EXPOSE 80

# Define entrypoint to start the server
ENTRYPOINT ["python", "App.py"]

import random

center_lat = 51.049999
center_long = -114.066666


points = 5000
with open('points.txt', 'w') as fp:
    for i in range(points):
        shift_lat = random.uniform(-0.11, 0.11)
        shift_long = random.uniform(-0.11, 0.11)
        new_lat = center_lat + shift_lat
        new_long = center_long + shift_long
        string = "new google.maps.LatLng({}, {}),\n".format(new_lat, new_long)

        fp.write(string)

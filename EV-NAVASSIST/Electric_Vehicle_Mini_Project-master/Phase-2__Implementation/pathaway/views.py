import json
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import PathawayUsers, ChargingStation
from django.contrib.auth import logout
from geopy.distance import distance
from django.http import JsonResponse
import requests


username =''
firstname=''
lastname=''
email=''
contactnumber = ''
password=''
isactive = 0
isverified = 0

# Create your views here.
def home (request):
    return render(request, 'pathaway/index.html')

def signup(request):
    global firstname, username, lastname, email, contactnumber, password, isactive, isverified

    if request.method == 'POST':
        username = request.POST['username']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        email = request.POST['email']
        contactnumber = request.POST['contactnumber']
        password = request.POST['password']

        if PathawayUsers.objects.filter(email=email).exists():
            messages.error(request, "User already exists")
            return redirect('signup')
        else:
            newuser = PathawayUsers(
            username=username,
            firstname=firstname,
            lastname=lastname,
            email=email,
            contactnumber=contactnumber,
            password=password
            )
            newuser.save()
            messages.success(request, "Your account has been created successfully")
            return redirect('signin')

    return render(request, 'pathaway/signup.html')

def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            # Check if the user exists
            user = PathawayUsers.objects.get(username=username, password=password)
            
            # Update isactive field to 1
            user.isactive = 1
            user.save()
            messages.success(request, 'You are successfully logged in.')
            # Redirect to a success page
            firstname = user.firstname
            lastname = user.lastname
            print("Hi")
            # return redirect('features', {'fname':firstname}) 
            return redirect('features') 
            
        except PathawayUsers.DoesNotExist:
            messages.error(request, 'Invalid password or username.')
            # User doesn't exist or incorrect password
            return redirect('signin')  # Replace 
    return render(request, 'pathaway/signin.html')


def features(request):
    return render(request, 'pathaway/features.html')

def signout(request):
    user = request.user
    if isinstance(user, PathawayUsers):
        user.isactive = 0
        user.save()
    logout(request)
    return redirect('home')

def routing(request):
    return render(request, 'pathaway/routing.html')

def slotbooking(request):
    return render(request, 'pathaway/slotbooking.html')

def breakdownassistance(request):
    return render(request, 'pathaway/breakdownassistance.html')


# def calculateChargingStations(request):
#     if request.method == 'POST':
#         route_data = json.loads(request.body)
#         source = route_data['source']
#         destination = route_data['destination']
#         waypoints = route_data['waypoints']

#         # Calculate the bounding box
#         min_lat = min(source['lat'], destination['lat'], *[waypoint['lat'] for waypoint in waypoints])
#         max_lat = max(source['lat'], destination['lat'], *[waypoint['lat'] for waypoint in waypoints])
#         min_lng = min(source['lng'], destination['lng'], *[waypoint['lng'] for waypoint in waypoints])
#         max_lng = max(source['lng'], destination['lng'], *[waypoint['lng'] for waypoint in waypoints])

#         # Query charging stations within the bounding box
#         charging_stations = ChargingStation.objects.filter(
#             latitude__range=(min_lat, max_lat),
#             longitude__range=(min_lng, max_lng)
#         )

#         # Filter charging stations within 2.5km from the route
#         filtered_charging_stations = []
#         for charging_station in charging_stations:
#             charging_station_location = (charging_station.latitude, charging_station.longitude)
#             charging_station_distance = min(
#                 distance(charging_station_location, (source['lat'], source['lng'])).km,
#                 distance(charging_station_location, (destination['lat'], destination['lng'])).km,
#                 *[distance(charging_station_location, (waypoint['lat'], waypoint['lng'])).km for waypoint in waypoints]
#             )
#             if charging_station_distance <= 2.5:
#                 filtered_charging_stations.append(charging_station)

#         charging_station_count = len(filtered_charging_stations)

#         data = {
#             'charging_stations': list(filtered_charging_stations.values()),
#             'charging_station_count': charging_station_count,
#         }

#         return JsonResponse(data)

# def calculateStations(request):
#     if request.method == 'POST':
#         print("Request received on calculateChargingStations endpoint")
        
#         # Retrieve the route data from the request's POST data
#         # route_data = request.POST.get('route_data')
#         route_data = json.loads(request.body)
#         # return JsonResponse({'error': 'Invalid JSON object'})

#         source = route_data['source']
#         destination = route_data['destination']
#         waypoints = route_data['waypoints']

#         if not source or not destination or not waypoints:
#             return JsonResponse({'error': 'Missing source, destination, or waypoints'})

#         min_lat = min(source['lat'], destination['lat'], *[waypoint['lat'] for waypoint in waypoints])
#         max_lat = max(source['lat'], destination['lat'], *[waypoint['lat'] for waypoint in waypoints])
#         min_lng = min(source['lng'], destination['lng'], *[waypoint['lng'] for waypoint in waypoints])
#         max_lng = max(source['lng'], destination['lng'], *[waypoint['lng'] for waypoint in waypoints])

#         charging_stations = ChargingStation.objects.filter(
#             latitude__range=(min_lat, max_lat),
#             longitude__range=(min_lng, max_lng)
#         )

#         filtered_charging_stations = []
#         for charging_station in charging_stations:
#             charging_station_location = (charging_station.latitude, charging_station.longitude)
#             charging_station_distance = min(
#                 distance(charging_station_location, (source['lat'], source['lng'])).km,
#                 distance(charging_station_location, (destination['lat'], destination['lng'])).km,
#                 *[distance(charging_station_location, (waypoint['lat'], waypoint['lng'])).km for waypoint in waypoints]
#             )
#             if charging_station_distance <= 2.5:
#                 filtered_charging_stations.append(charging_station)

#         charging_station_count = len(filtered_charging_stations)

#         data = {
#             'charging_stations': list(filtered_charging_stations.values()),
#             'charging_station_count': charging_station_count,
#         }

#         return JsonResponse(data)
#     else:
#         return JsonResponse({'error': 'Method not allowed'})

from django.http import JsonResponse
from geopy.distance import distance
from shapely.geometry import Point, LineString
import requests

from shapely.geometry import LineString, Point
from shapely.geometry import LineString, Point

def calculateStations(request):
    if request.method == 'POST':
        print("Request received on calculateChargingStations endpoint")
        
        route_data = json.loads(request.body)

        source = route_data.get('source')
        destination = route_data.get('destination')
        waypoints = route_data.get('waypoints')

        if not source or not destination:
            return JsonResponse({'error': 'Missing source or destination'})

        route_line = create_route_line(source, destination, waypoints)

        charging_stations = ChargingStation.objects.all()

        filtered_charging_stations = []
        for charging_station in charging_stations:
            charging_station_location = Point(charging_station.latitude, charging_station.longitude)
            if route_line.distance(charging_station_location) <= 0.1:  # Adjust the threshold as needed
                charging_station_dict = {
                    'id': charging_station.id,
                    'name': charging_station.name,
                    'latitude': charging_station.latitude,
                    'longitude': charging_station.longitude
                }
                filtered_charging_stations.append(charging_station_dict)

        charging_station_count = len(filtered_charging_stations)

        data = {
            'charging_stations': filtered_charging_stations,
            'charging_station_count': charging_station_count,
        }

        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Method not allowed'})

def create_route_line(source, destination, waypoints):
    route_coordinates = [(source['lat'], source['lng'])]

    if waypoints:
        route_coordinates.extend([(waypoint['lat'], waypoint['lng']) for waypoint in waypoints])

    route_coordinates.append((destination['lat'], destination['lng']))

    route_line = LineString(route_coordinates)

    return route_line

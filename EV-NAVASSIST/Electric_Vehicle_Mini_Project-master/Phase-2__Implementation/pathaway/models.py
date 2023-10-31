from django.db import models

# Create your models here.
class PathawayUsers(models.Model):
    username = models.CharField(max_length=25, unique=True)
    firstname = models.CharField(max_length=25)
    lastname = models.CharField(max_length=25)
    email = models.EmailField(max_length=35)
    contactnumber = models.CharField(max_length=12)
    password = models.CharField(max_length=20)
    isactive = models.IntegerField(default=0)
    isverified = models.IntegerField(default=0)

class ChargingStation(models.Model):
    name = models.CharField(max_length=1000)
    address = models.CharField(max_length=2000)
    latitude = models.FloatField()
    longitude = models.FloatField()

class BreakdownStation(models.Model):
    name = models.CharField(max_length=1000)
    address = models.CharField(max_length=2000)
    latitude = models.FloatField()
    longitude = models.FloatField()
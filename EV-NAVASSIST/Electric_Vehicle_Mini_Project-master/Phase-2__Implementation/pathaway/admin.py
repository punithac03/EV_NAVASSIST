from django.contrib import admin
from .models import PathawayUsers
from .models import ChargingStation
from .models import BreakdownStation

# Register your models here.
@admin.register(PathawayUsers)
@admin.register(ChargingStation)
@admin.register(BreakdownStation)

class DataAdmin(admin.ModelAdmin):
    pass
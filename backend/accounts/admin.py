from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('phone',)}),
    )
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'date_joined')

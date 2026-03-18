from django.db import models
from django.conf import settings

class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    service_name = models.CharField(max_length=255)
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    renewal_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.service_name} - {self.cost}"

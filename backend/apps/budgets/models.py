from django.db import models
from django.conf import settings

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='budgets')
    monthly_limit = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField() # Representing the start of the month
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.month.strftime('%Y-%B')} - {self.monthly_limit}"

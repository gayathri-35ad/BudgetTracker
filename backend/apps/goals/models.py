from django.db import models
from django.conf import settings

class SavingsGoal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='savings_goals')
    goal_name = models.CharField(max_length=255)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.goal_name} - {self.target_amount}"

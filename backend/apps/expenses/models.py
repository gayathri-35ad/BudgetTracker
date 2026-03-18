from django.db import models
from django.conf import settings

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('FO', 'Food'),
        ('TR', 'Travel'),
        ('SH', 'Shopping'),
        ('EN', 'Entertainment'),
        ('HE', 'Health'),
        ('ED', 'Education'),
        ('OT', 'Others'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('CA', 'Cash'),
        ('CC', 'Credit Card'),
        ('DC', 'Debit Card'),
        ('UP', 'UPI'),
        ('NB', 'Net Banking'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES, default='OT')
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    payment_method = models.CharField(max_length=2, choices=PAYMENT_METHOD_CHOICES, default='CA')
    location = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.category} - {self.amount}"

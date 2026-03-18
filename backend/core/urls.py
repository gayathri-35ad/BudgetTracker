from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/income/', include('income.urls')),
    path('api/budgets/', include('budgets.urls')),
    path('api/goals/', include('goals.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/analytics/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

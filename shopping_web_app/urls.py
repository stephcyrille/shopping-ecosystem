"""
URL configuration for shopping_web_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myproxy.views import * 
from myproxy.apis.session_apis import * 
from myproxy.apis.products_apis import * 
from myproxy.apis.banners_apis import * 
from myproxy.apis.home_collections_apis import * 
from myproxy.apis.categories_apis import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('apis/test/', TestView.as_view()),
    path('apis/init', GetSessionIdViews.as_view()),
    path('apis/products/categories', GetCategoriesListAPIViews.as_view()),
    path('apis/products/list', GetProductListAPIViews.as_view()),
    path('apis/products/single/<int:id>', GetSingleProductAPIViews.as_view()),
    path('apis/banners/list', GetBannersListAPIViews.as_view()),
    path('apis/home/collections', GetHomeCollectionsAPIViews.as_view()),
]

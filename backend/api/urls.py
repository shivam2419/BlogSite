from django.urls import path
from .views import *


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),  # GET all posts, POST a new post
    path("posts/<int:post_id>/like/", LikePostView.as_view(), name="like-post"),  # POST request to like/unlike a post
    path("posts/<int:post_id>/comment/", CommentPostView.as_view(), name="add-comment"),
    path("posts/<int:pk>/", PostDetailView.as_view(), name="post-detail"),  # GET single post, DELETE post

]
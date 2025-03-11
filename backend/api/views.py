from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import logout
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, permission_classes
import json
from django.http import Http404
from django.shortcuts import get_object_or_404

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]  
    serializer_class = LoginSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            "id" : serializer.validated_data["user_id"],
            "username" : serializer.validated_data["username"],
            "access": serializer.validated_data["access"],
            "refresh": serializer.validated_data["refresh"],
        }, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])  # Ensure no authentication is needed
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")  # Ensure correct key

        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)

        # Blacklist the refresh token
        token = RefreshToken(refresh_token)
        token.blacklist()   
        logout(request)
        return Response({"message": "User logged out successfully"}, status=200)

    except Exception as e:
        print(f"Logout error: {e}")  # Debugging
        return Response({"error": str(e)}, status=400)


# ✅ Create & List Posts
from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 5  # ✅ Number of posts per request
    page_size_query_param = "page_size"
    max_page_size = 50

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # ✅ Ensure authentication
    pagination_class = CustomPagination
    def perform_create(self, serializer):
        """Assign the logged-in user before saving the post."""
        serializer.save(user=self.request.user)  # ✅ This fixes the error!
# ✅ Like a Post
class LikePostView(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            like.delete()
            return Response({"message": "Like removed", "like_count": post.likes.count(), "comment_count" : post.comments.count()}, status=status.HTTP_200_OK)
        
        return Response({"message": "Post liked", "like_count": post.likes.count(), "comment_count" : post.comments.count()}, status=status.HTTP_201_CREATED)


# ✅ Comment on a Post
from rest_framework.response import Response
from rest_framework import status
class CommentPostView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post = get_object_or_404(Post, id=self.kwargs.get("post_id"))
        serializer.save(user=self.request.user, post=post)  # ✅ Assign post automatically

class PostDetailView(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        """Retrieve a single post or raise 404 if not found"""
        try:
            return Post.objects.get(pk=self.kwargs["pk"])
        except Post.DoesNotExist:
            raise Http404

    def delete(self, request, *args, **kwargs):
        """Allow only the owner to delete their post"""
        post = self.get_object()
        if post.user != request.user:
            return Response(
                {"error": "You are not authorized to delete this post."}, status=status.HTTP_403_FORBIDDEN
            )
        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
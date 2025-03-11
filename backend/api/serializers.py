from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login

from django.contrib.auth import authenticate, login
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context.get("request")  # self.request.get() will not work in this context because self refers to the serializer instance, and serializers do not have a request attribute by default.
        user = authenticate(username=data["username"], password=data["password"])
        
        if user is None:
            raise serializers.ValidationError("Invalid username or password")

        refresh = RefreshToken.for_user(user)

        if request:
            login(request, user)  # Pass request object

        return {
            "user_id": user.id,
            "username": user.username,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


# Main
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username') # if you do user.id then in reponse it will return id of user, basically here we are updating user data that is visible on response.
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField() # SerializerMethodField() tells Django to look for a method named get_<field_name>.
    comments = CommentSerializer(many=True, read_only=True) 
    

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'created_at', 'like_count', 'comment_count', 'comments']

    def get_like_count(self, obj): # obj is Post object, which is going to related_name comments
        return obj.likes.count()
    def get_comment_count(self, obj):
        return obj.comments.count()

